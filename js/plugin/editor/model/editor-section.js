define(function(require) {

    var Section = require('theme/aw-bubble/model/section'),
        EditorView = require('plugin/editor/view/editor-view'),
        EditorMenuView = require('plugin/editor/view/tools-menu/editor-view-menu');

    var EditorSection = Section.extend({
        
        title: 'Fountain编辑器',

        shortTitle: '编辑',

        smallIcon: 'gfx/icons/editor.svg',

        isVisibleInMenu: false,

        description: '一个简洁的 Fountain 编辑器。使用 Ctrl-Space 进行自动完成。访问 <a href="http://fountain.io" target="_blank">fountain.io</a> 了解更多 Fountain 格式详情。<br/>点击眼睛图标打开预览功能，实时查看剧本格式化效果。<br />使用保存功能将剧本下载为 .fountain 文件，或导出为 PDF。',

        MainContent: {
            value: EditorView
        },

        Tools: {
            value: EditorMenuView
        }

    });

    return EditorSection;
});