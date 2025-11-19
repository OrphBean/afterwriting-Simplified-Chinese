define(function(require) {

    var Plugin = require('core/plugin'),
        InitHelpController = require('plugin/help/controller/init-help-controller');

    /**
     * @module plugin/help/help-plugin
     * @augments module:core/plugin
     */
    var HelpPlugin = Plugin.extend({

        $create: function(context) {
            context.register(InitHelpController.create());
        }

    });

    return HelpPlugin;
});