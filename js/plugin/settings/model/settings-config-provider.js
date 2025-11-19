define(function(require) {

    var Protoplast = require('protoplast'),
        Input = require('core/view/control/input'),
        Checkbox = require('core/view/control/checkbox'),
        Dropdown = require('core/view/control/dropdown'),
        SettingsGroup = require('plugin/settings/model/settings-group'),
        SettingsEntry = require('plugin/settings/model/settings-entry'),
        fontLoaders = require('fonts/font-loaders');

    var SettingsConfigProvider = Protoplast.Object.extend({

        /**
         * Return list of groups used by settings addon
         */
        getSettingGroups: function() {
            return Protoplast.Collection.create([
                this.getPrintGroup(),
                this.getLayoutGroup(),
                this.getTextGroup(),
                this.getMiscellaneousGroup(),
                this.getStatsGroup(),
                this.getExperimentalGroup()
            ]);
        },

        getPrintGroup: function() {
            var printGroup = SettingsGroup.create('打印');

            printGroup.addEntry(this.createDropdown('print_profile', '页面尺寸', [{label: 'A4', value: 'a4'}, {label: 'US letter', value: 'usletter'}]));
            printGroup.addEntry(this.createDropdown('font_family', '字体', fontLoaders.fontsList.map(function(font) {
                return {
                    label: font.label,
                    value: font.name
                };
            })));
            printGroup.addEntry(this.createCheckbox('print_title_page', '打印标题页'));
            printGroup.addEntry(this.createCheckbox('print_sections', '打印章节'));
            printGroup.addEntry(this.createCheckbox('print_synopsis', '打印概要'));
            printGroup.addEntry(this.createCheckbox('print_notes', '打印备注'));
            printGroup.addEntry(this.createCheckbox('print_headers', '打印页眉'));
            printGroup.addEntry(this.createCheckbox('print_actions', '打印动作描述'));
            printGroup.addEntry(this.createCheckbox('print_dialogues', '打印对白'));
            printGroup.addEntry(this.createInput('print_header', '页眉'));
            printGroup.addEntry(this.createInput('print_footer', '页脚'));
            printGroup.addEntry(this.createInput('print_watermark', '水印'));
            return printGroup;
        },

        getLayoutGroup: function() {
            var layoutGroup = SettingsGroup.create('布局');
            layoutGroup.addEntry(this.createCheckbox('split_dialogue', '跨页分割对白'));
            layoutGroup.addEntry(this.createCheckbox('use_dual_dialogue', '接受双栏对白'));
            layoutGroup.addEntry(this.createCheckbox('double_space_between_scenes', '场景间双倍行距'));
            layoutGroup.addEntry(this.createCheckbox('each_scene_on_new_page', '场景后分页'));
            layoutGroup.addEntry(this.createCheckbox('number_sections', '章节编号'));
            layoutGroup.addEntry(this.createCheckbox('embolden_scene_headers', '场景标题加粗'));
            layoutGroup.addEntry(this.createCheckbox('underline_scene_headers', '场景标题下划线'));
            layoutGroup.addEntry(this.createDropdown('scenes_numbers', '场景编号', [
                {label: '无', value: 'none'},
                {label: '左侧', value: 'left'},
                {label: '右侧', value: 'right'},
                {label: '两侧', value: 'both'}
            ]));
            layoutGroup.addEntry(this.createCheckbox('scene_continuation_bottom', '场景延续（页面底部）'));
            layoutGroup.addEntry(this.createCheckbox('scene_continuation_top', '场景延续（下一页顶部）'));
            layoutGroup.addEntry(this.createCheckbox('merge_empty_lines', '合并空行'));
            return layoutGroup;
        },

        getTextGroup: function() {
            var textGroup = SettingsGroup.create('文本');
            textGroup.addEntry(this.createInput('text_more', '覆盖（未完）文本为'));
            textGroup.addEntry(this.createInput('text_contd', '覆盖（续）文本为'));
            textGroup.addEntry(this.createInput('text_scene_continued', '覆盖场景延续文本为'));
            return textGroup;
        },

        getMiscellaneousGroup: function() {
            var miscellaneousGroup = SettingsGroup.create('其他');
            miscellaneousGroup.addEntry(this.createCheckbox('show_background_image','显示背景图片'));
            miscellaneousGroup.addEntry(this.createCheckbox('load_last_opened','启动时加载上次打开的文件'));
            miscellaneousGroup.addEntry(this.createCheckbox('night_mode','夜间模式'));
            return miscellaneousGroup;
        },

        getStatsGroup: function() {
            var statsGroup = SettingsGroup.create('统计');
            statsGroup.addEntry(this.createCheckbox('stats_keep_last_scene_time', '未指定时保留上一场景的时间'));
            statsGroup.addEntry(this.createInput('stats_who_with_who_max', '“谁与谁”最大字符数'));
            return statsGroup;
        },

        getExperimentalGroup: function() {
            var experimentalGroup = SettingsGroup.create('实验性功能');
            experimentalGroup.addEntry(this.createCheckbox('pdfjs_viewer', 'JavaScript PDF查看器'));
            return experimentalGroup;
        },

        createDropdown: function(key, label, options) {
            var dropdown = Dropdown.create();
            dropdown.id = key;
            dropdown.options = options;
            return SettingsEntry.create(key, label, dropdown);
        },

        createCheckbox: function(key, label) {
            var checkbox = Checkbox.create();
            checkbox.id = key;
            return SettingsEntry.create(key, label, checkbox);
        },

        createInput: function(key, label) {
            var input = Input.create();
            return SettingsEntry.create(key, label, input);
        }

    });

    return SettingsConfigProvider;
});