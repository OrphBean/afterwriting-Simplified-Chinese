define(function(require) {

    var Protoplast = require('protoplast'),
        IoModel = require('plugin/io/model/io-model'),
        $ = require('jquery'),
        saveAs = require('saveAs'),
        forms = require('utils/forms');
    
    var SaveController = Protoplast.Object.extend({

        ioModel: {
            inject: IoModel
        },
        
        scriptModel: {
            inject: 'script'
        },
        
        settings: {
            inject: 'settings'
        },
        
        pdfController: {
            inject: 'pdf'
        },

        saveFountainLocally: function() {
            forms.text('Select file name:', this.ioModel.fountainFileName || 'screenplay.fountain', function (result) {
                var blob = new Blob([this.scriptModel.script], {
                    type: "text/plain;charset=utf-8"
                });
                this.ioModel.fountainFileName = result.text;
                this.ioModel.pdfFileName = result.text.split('.')[0] + '.pdf';
                saveAs(blob, result.text);
            }.bind(this));
        },

        savePdfLocally: function() {
            forms.text('Select file name:', this.ioModel.pdfFileName || 'screenplay.pdf', function (result) {
                this.pdfController.getPdf(function (pdf) {
                    this.ioModel.pdfFileName = result.text;
                    this.ioModel.fountainFileName = result.text.split('.')[0] + '.fountain';
                    saveAs(pdf.blob, result.text);
                }.bind(this));
            }.bind(this));
        },

        _fileSaved: function() {
            $.prompt.close();
            $.prompt('File saved!');
        },

        _fileNotSaved: function() {
            $.prompt.close();
            $.prompt('Could not save the file. Try again later.');
        }

    });

    return SaveController;
});