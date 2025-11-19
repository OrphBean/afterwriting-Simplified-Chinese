define(function(require) {

    var Protoplast = require('protoplast'),
        HelpSection = require('plugin/help/model/help-section'),
        ThemeController = require('theme/aw-bubble/controller/theme-controller');

    var InitHelpController = Protoplast.Object.extend({
        
        themeController: {
            inject: ThemeController
        },
        
        init: function() {
            var helpSection = HelpSection.create('help');
            this.themeController.addSection(helpSection);
        }
        
    });

    return InitHelpController;
});