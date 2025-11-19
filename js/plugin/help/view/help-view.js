define(function(require) {

    var template = require('text!plugin/help/view/help.hbs'),
        $ = require('jquery'),
        HelpViewPresenter = require('plugin/help/view/help-view-presenter'),
        BaseComponent = require('core/view/base-component'),
        SectionViewMixin = require('theme/aw-bubble/view/section-view-mixin');

    return BaseComponent.extend([SectionViewMixin], {

        $meta: {
            presenter: HelpViewPresenter
        },
        
        hbs: template

    });

});