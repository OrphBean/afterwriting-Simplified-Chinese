define(function(require) {

    var Section = require('theme/aw-bubble/model/section'),
        PreviewView = require('plugin/preview/view/preview-view'),
        PreviewViewMenu = require('plugin/preview/view/tools-menu/preview-view-menu');

    var PreviewSection = Section.extend({
        
        title: '预览',

        shortTitle: '预览',

        smallIcon: 'gfx/icons/preview.svg',

        isVisibleInMenu: false,

        MainContent: {
            value: PreviewView
        },
        
        Tools: {
            value: PreviewViewMenu
        }

    });

    return PreviewSection;
});