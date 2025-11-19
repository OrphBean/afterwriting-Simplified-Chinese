define(function(require) {

    var BaseSectionViewPresenter = require('theme/aw-bubble/presenter/base-section-view-presenter');

    var HelpViewPresenter = BaseSectionViewPresenter.extend({

        $create: function() {
            // No special initialization needed
        }

    });

    return HelpViewPresenter;
});