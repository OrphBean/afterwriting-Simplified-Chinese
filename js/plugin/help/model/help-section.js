define(function(require) {

    var Section = require('theme/aw-bubble/model/section'),
        HelpView = require('plugin/help/view/help-view');

    /**
     * @module plugin/help/model/help-section
     * @augments module:theme/aw-bubble/model/section
     */
    var HelpSection = Section.extend({
        
        title: '语法指南',

        shortTitle: '帮助',

        smallIcon: 'gfx/icons/help.svg',

        MainContent: {
            value: HelpView
        }

    });

    return HelpSection;
});