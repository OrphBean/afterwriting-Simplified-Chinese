define(function(require) {

    var template = require('text!plugin/preview/view/tools-menu/preview-view-menu.hbs'),
        Protoplast = require('protoplast'),
        BaseComponent = require('core/view/base-component'),
        PreviewViewMenuPresenter = require('plugin/preview/view/tools-menu/preview-view-menu-presenter'),
        SectionViewMixin = require('theme/aw-bubble/view/section-view-mixin');

    return BaseComponent.extend([SectionViewMixin], {
    
        $meta: {
            presenter: PreviewViewMenuPresenter
        },
        
        hbs: template,

        $saveLocally: null,

        addBindings: function() {
        },

        addInteractions: function() {
            this.$saveLocally.click(this.dispatch.bind(this, 'save-as-pdf'));
        },


    });
});

