/**
 * Chinese Fountain Parser - Main Module
 * Parses Chinese screenplays written in Fountain format with Chinese keywords
 */

define(['utils/aw-parser-cn/helpers'], function(h) {

var parser = {};

// Map Chinese keywords to English type names for internal use
var chineseToEnglishKeywords = {
    '标题': 'title',
    '作者': 'author',
    '署名': 'credit',
    '草稿': 'draft',
    '草稿日期': 'draft date',
    '版权': 'copyright',
    '联系': 'contact',
    '来源': 'source',
    '备注': 'notes'
};

// Chinese-only regex patterns
var regex = {
    // Title page - Chinese keywords with both : and ： (full-width colon)
    title_page: /(标题|作者|署名|草稿|草稿日期|版权|联系|来源|备注)[:\uff1a].*/,

    section: /^(#+)(?: *)(.*)/,
    synopsis: /^(?:\=(?!\=+) *)(.*)/,

    // Scene headings - Chinese location and time
    // 内景 (INT), 外景 (EXT), 内外景 (INT/EXT), 内/外景
    scene_heading: /^(内景|外景|内外景|内\/外景)[.。:\uff1a]?\s*.+/,
    scene_number: /#(.+)#/,

    // Transitions - Chinese transition words
    // 切入, 切换, 转场, 淡入, 淡出, 化入, 化出, 叠化
    transition: /^(切入|切换|转场|淡入|淡出|化入|化出|叠化)[:\uff1a\u3002]?\s*$/,

    // Character names - Chinese characters (CJK Unified Ideographs)
    // Supports Chinese characters, full-width letters, some punctuation, and ^ for dual dialogue
    character: /^[\u4e00-\u9fff\u3400-\u4dbf\uff21-\uff3a\uff41-\uff5a\u3000-\u303f\s\^]+$/,
    
    // Parentheticals - support both () and （）
    parenthetical: /^[\uff08\(][^\uff09\)]+[\uff09\)]$/,

    action: /^(.+)/g,
    centered: /^(?:> *)(.+)(?: *<)(\n.+)*/g,

    page_break: /^\={3,}$/,
    line_break: /^ {2}$/
};

parser.parse = function(original_script, cfg) {

    var script = original_script,
        result = {
            title_page: [],
            tokens: []
        };
    if (!script) {
        return result;
    }

    var new_line_length = script.match(/\r\n/) ? 2 : 1;

    if (!cfg.print_notes) {
        script = script.replace(/ {0,1}\[\[/g, " /*").replace(/\]\] {0,1}/g, "*/");
    }

    var lines = script.split(/\r\n|\r|\n/);

    var create_token = function(text, cursor, line) {
        return h.create_token({
            text: text,
            start: cursor,
            end: cursor + text.length - 1 + new_line_length,
            line: line
        });
    };

    var lines_length = lines.length,
        current = 0,
        scene_number = 1,
        match, text, last_title_page_token,
        token, last_was_separator = false,
        top_or_separated = false,
        token_category = "none",
        last_character_index,
        dual_right,
        state = "normal",
        cache_state_for_comment,
        nested_comments = 0,
        title_page_started = false;

    var reduce_comment = function(prev, current) {
        if (current === "/*") {
            nested_comments++;
        } else if (current === "*/") {
            nested_comments--;
        } else if (!nested_comments) {
            prev = prev + current;
        }
        return prev;
    };

    var if_not_empty = function(a) {
        return a;
    };

    // Helper to check if text is all Chinese characters (for character names)
    var is_chinese_character_name = function(text) {
        // Must be non-empty and match character pattern
        return text.trim().length > 0 && regex.character.test(text.trim());
    };

    for (var i = 0; i < lines_length; i++) {
        text = lines[i];

        // replace inline comments
        text = text.split(/(\/\*){1}|(\*\/){1}|([^\/\*]+)/g).filter(if_not_empty).reduce(reduce_comment, "");

        if (nested_comments && state !== "ignore") {
            cache_state_for_comment = state;
            state = "ignore";
        } else if (state === "ignore") {
            state = cache_state_for_comment;
        }

        if (nested_comments === 0 && state === "ignore") {
            state = cache_state_for_comment;
        }

        token = create_token(text, current, i);
        current = token.end + 1;

        if (text.trim().length === 0 && text !== "  ") {
            var skip_separator = cfg.merge_multiple_empty_lines && last_was_separator;

            state = "normal";

            if (skip_separator || state === "title_page") {
                continue;
            }

            dual_right = false;
            token.type = "separator";
            last_was_separator = true;
            result.tokens.push(token);
            continue;
        }

        top_or_separated = last_was_separator || i === 0;
        token_category = "script";

        if (!title_page_started && regex.title_page.test(token.text)) {
            state = "title_page";
        }

        if (state === "title_page") {
            if (regex.title_page.test(token.text)) {
                // Support both : and ： (full-width colon)
                var colonIndex = token.text.indexOf(":");
                var fullColonIndex = token.text.indexOf("：");
                var index = colonIndex !== -1 ? colonIndex : fullColonIndex;
                
                if (index !== -1) {
                    var chineseKeyword = token.text.substr(0, index).trim();
                    // Map Chinese keyword to English type name
                    token.type = chineseToEnglishKeywords[chineseKeyword] || chineseKeyword.toLowerCase();
                    token.text = token.text.substr(index + 1).trim();
                    last_title_page_token = token;
                    result.title_page.push(token);
                    title_page_started = true;
                }
                continue;
            } else if (title_page_started) {
                last_title_page_token.text += (last_title_page_token.text ? "\n" : "") + token.text.trim();
                continue;
            }
        }

        if (state === "normal") {
            if (token.text.match(regex.line_break)) {
                token_category = "none";
            } else if (token.text.match(regex.scene_heading)) {
                if (cfg.each_scene_on_new_page && scene_number !== 1) {
                    var page_break = h.create_token({
                        type: "page_break",
                        start: token.start,
                        end: token.end
                    });
                    result.tokens.push(page_break);
                }

                token.type = "scene_heading";
                token.number = scene_number;
                if (match = token.text.match(regex.scene_number)) {
                    token.text = token.text.replace(regex.scene_number, "");
                    token.number = match[1];
                }
                scene_number++;
            } else if (token.text.match(regex.centered)) {
                token.type = "centered";
                token.text = token.text.replace(/>|</g, "").trim();
            } else if (token.text.match(regex.transition)) {
                token.type = "transition";
            } else if (match = token.text.match(regex.synopsis)) {
                token.text = match[1];
                token.type = token.text ? "synopsis" : "separator";
            } else if (match = token.text.match(regex.section)) {
                token.level = match[1].length;
                token.text = match[2];
                token.type = "section";
            } else if (token.text.match(regex.page_break)) {
                token.text = "";
                token.type = "page_break";
            } else if (token.text.length && token.text[0] === "!") {
                token.type = "action";
                token.text = token.text.substr(1);
            } else if (is_chinese_character_name(token.text) && top_or_separated) {
                // Check if next line exists and is not empty (dialogue follows)
                if (i < lines_length - 1 && lines[i + 1].trim().length > 0) {
                    state = "dialogue";
                    token.type = "character";
                    
                    // Handle dual dialogue marker ^
                    if (token.text[token.text.length - 1] === "^") {
                        if (cfg.use_dual_dialogue) {
                            // update last dialogue to be dual:left
                            var dialogue_tokens = ["dialogue", "character", "parenthetical"];
                            while (last_character_index !== undefined && 
                                   dialogue_tokens.indexOf(result.tokens[last_character_index].type) !== -1) {
                                result.tokens[last_character_index].dual = "left";
                                last_character_index++;
                            }
                            token.dual = "right";
                            dual_right = true;
                        }
                        token.text = token.text.replace("^", "");
                    }
                    last_character_index = result.tokens.length;
                } else {
                    token.type = "action";
                }
            } else {
                token.type = "action";
            }
        } else {
            if (token.text.match(regex.parenthetical)) {
                token.type = "parenthetical";
            } else {
                token.type = "dialogue";
            }
            if (dual_right) {
                token.dual = "right";
            }
        }

        last_was_separator = false;

        if (token_category === "script" && state !== "ignore") {
            if (token.is("scene_heading", "transition")) {
                // Keep original case for Chinese text
                title_page_started = true; // ignore title tags after first heading
            }
            if (token.text && token.text[0] === "~") {
                token.text = "*" + token.text.substr(1) + "*";
            }
            token.text = token.is("action") ? token.text : token.text.trim();
            result.tokens.push(token);
        }
    }

    var current_index = 0, previous_type = null;
    // tidy up separators
    while (current_index < result.tokens.length) {
        var current_token = result.tokens[current_index];

        if (
            (!cfg.print_actions && current_token.is("action", "transition", "centered", "shot")) ||
            (!cfg.print_notes && current_token.type === "note") ||
            (!cfg.print_headers && current_token.type === "scene_heading") ||
            (!cfg.print_sections && current_token.type === "section") ||
            (!cfg.print_synopsis && current_token.type === "synopsis") ||
            (!cfg.print_dialogues && current_token.is_dialogue()) ||
            (cfg.merge_multiple_empty_lines && current_token.is("separator") && previous_type === "separator")) {

            result.tokens.splice(current_index, 1);
            continue;
        }

        if (cfg.double_space_between_scenes && current_token.is("scene_heading") && current_token.number !== 1) {
            var additional_separator = h.create_separator(token.start, token.end);
            result.tokens.splice(current_index, 0, additional_separator);
            current_index++;
        }
        previous_type = current_token.type;
        current_index++;
    }

    // clean separators at the end
    while (result.tokens.length > 0 && result.tokens[result.tokens.length - 1].type === "separator") {
        result.tokens.pop();
    }

    return result;
};

return parser;

});