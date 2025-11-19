define(function(require) {

    var Section = require('theme/aw-bubble/model/section'),
        OpenView = require('plugin/io/view/open-view');

    var OpenSection = Section.extend({

        id: 'open-start',

        title: '开始',

        shortTitle: '打开',

        smallIcon: 'gfx/icons/open.svg',
        
        description: '您可以打开.fountain或.fdx文件（将转换为Fountain格式），或使用下面的示例。',
        
        MainContent: {
            value: OpenView
        }

    });

    return OpenSection;
});