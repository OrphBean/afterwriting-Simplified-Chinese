define(function(require) {

    var Section = require('theme/aw-bubble/model/section'),
        SaveView = require('plugin/io/view/save-view');

    var SaveSection = Section.extend({
        
        title: '保存',

        shortTitle: '保存',

        description: '您可以在此处以Fountain或PDF格式保存剧本。如果您想在移动设备上阅读，请选择移动设备友好版本（字体更大）。',

        smallIcon: 'gfx/icons/save.svg',

        isVisibleInMenu: false,

        MainContent: {
            value: SaveView
        }

    });

    return SaveSection;
});