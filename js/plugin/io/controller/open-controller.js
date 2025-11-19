define(function(require) {

    var Protoplast = require('protoplast'),
        local = require('utils/local'),
        tree = require('utils/tree'),
        helper = require('utils/helper'),
        EditorController = require('plugin/editor/controller/editor-controller'),
        LastUsedInfo = require('plugin/io/model/last-used-info'),
        IoModel = require('plugin/io/model/io-model'),
        ThemeController = require('theme/aw-bubble/controller/theme-controller'),
        samples = require('samples');
    
    var OpenController = Protoplast.Object.extend({

        pub: {
            inject: 'pub'
        },

        scriptModel: {
            inject: 'script'
        },
        
        storage: {
            inject: 'storage'
        },
        
        settings: {
            inject: 'settings'
        },
        
        themeController: {
            inject: ThemeController
        },
        
        ioModel: {
            inject: IoModel
        },

        editorController:{
            inject: EditorController
        },

        settingsLoaderModel: {
            inject: 'settingsLoaderModel'
        },

        init: function() {

            Protoplast.utils.bind(this.scriptModel, 'script', function () {
                var title = '';
                this.storage.setItem('last-used-script', this.scriptModel.script);
                this.storage.setItem('last-used-date', helper.format_date(new Date()));
                if (this.scriptModel.script) {
                    var title_match;
                    var wait_for_non_empty = false;
                    this.scriptModel.script.split('\n').some(function (line) {
                        title_match = line.match(/title\:(.*)/i);
                        if (wait_for_non_empty) {
                            title = line.trim().replace(/\*/g, '').replace(/_/g, '');
                            wait_for_non_empty = !title;
                        }
                        if (title_match) {
                            title = title_match[1].trim();
                            wait_for_non_empty = !title;
                        }
                        return title && !wait_for_non_empty;
                    });
                }
                this.storage.setItem('last-used-title', title || 'No title');
            }.bind(this));

            if (this.storage.getItem('last-used-date')) {
                this.ioModel.fileName = '';
                // log.info('Last used exists. Loading: ', data.data('last-used-title'), data.data('last-used-date'));
                var lastUsedInfo = LastUsedInfo.create();
                lastUsedInfo.script = this.storage.getItem('last-used-script');
                lastUsedInfo.date = this.storage.getItem('last-used-date');
                lastUsedInfo.title = this.storage.getItem('last-used-title');
                this.ioModel.lastUsedInfo = lastUsedInfo;
            }

            Protoplast.utils.bind(this, 'settingsLoaderModel.userSettingsLoaded', this._openLastUsedOnStartup);
        },

        createNew: function() {
            // Chinese title page template
            var chineseTemplate = '标题: \n署名: \n作者: \n联系: \n版权: \n草稿: \n草稿日期: \n\n';
            this._setScript(chineseTemplate);
        },

        openSample: function(name) {
            var file_name = 'samples/' + name + '.fountain';
            var text = samples[file_name]();
            this._setScript(text);
        },

        openLastUsed: function() {
            if (this.ioModel.lastUsedInfo) {
                this._setScript(this.ioModel.lastUsedInfo.script);
            }
        },

        openFile: function(selectedFile) {
            var fileReader = new FileReader();
            var self = this;
            fileReader.onload = function () {
                var value = this.result;
                self._setScript(value);
                local.local_file = selectedFile;
                self.pub('plugin/io/opened-local-file', self.scriptModel.format);
            };
            fileReader.readAsText(selectedFile);
        },

        _openLastUsedOnStartup: function() {
            if (this.settings.load_last_opened) {
                this.openLastUsed();
                this.pub('plugin/io/startup/opened-last-used');
            }
        },

        _setScript: function(value) {
            this._clearLastOpened();
            // TODO: remove dependency to editor (++)
            // https://github.com/ifrost/afterwriting-labs/issues/40
            // Encapsulate file related props in File objects (stuff like IoModel.dbPath)
            // and clean up the editor when file is set (in EditorController)
            this.editorController.cleanUp();
            this.scriptModel.script = value;
            this.themeController.clearSelectedSection();
        },

        _clearLastOpened: function() {
            this.scriptModel.format = undefined;
            this.ioModel.fountainFileName = '';
            this.ioModel.pdfFileName = '';
            local.local_file = null;
        }
        
    });

    return OpenController;
});