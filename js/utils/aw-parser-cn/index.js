/**
 * Chinese Fountain Parser
 * Entry point for the Chinese-only parser module
 */

define(['utils/aw-parser-cn/parser', 'utils/aw-parser-cn/helpers'], function(parser, helpers) {
    return {
        parser: parser,  // The parser object with parse method
        helpers: helpers
    };
});