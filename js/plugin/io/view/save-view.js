define(function(require) {

    var Protoplast = require('protoplast'),
        template = require('text!plugin/io/view/save.hbs'),
        BaseComponent = require('core/view/base-component'),
        SectionViewMixin = require('theme/aw-bubble/view/section-view-mixin'),
        SaveViewPresenter = require('plugin/io/view/save-view-presenter');
    
    return BaseComponent.extend([SectionViewMixin], {

        $meta: {
            presenter: SaveViewPresenter
        },
        
        hbs: template,

        $saveFountainLocally: null,

        $savePdfLocally: null,

        $saveMobilePdfLocally: null,

        addBindings: function() {
        },

        addInteractions: function() {

            this.$saveFountainLocally.click(this.dispatch.bind(this, 'save-as-fountain'));

            this.$savePdfLocally.click(this.dispatch.bind(this, 'save-as-pdf'));

            this.$saveMobilePdfLocally.click(this.dispatch.bind(this, 'save-as-mobile-pdf'));
        },


    });

});
