define(function(require) {

    var Protoplast = require('protoplast');

    var IoModel = Protoplast.Model.extend({

        fileName: null,
        
        fountainFileName: null,
        
        pdfFileName: null,
        
        /**
         * @type {LastUsedInfo}
         */
        lastUsedInfo: undefined,

        /**
         * @type {boolean}
         */
        lastUsedInfoLoaded: false
    });

    return IoModel;
});