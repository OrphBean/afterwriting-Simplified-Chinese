define(function(require) {

    var Section = require('theme/aw-bubble/model/section'),
        FactsView = require('plugin/stats/view/facts-view');
    
    var FactsSection = Section.extend({
        
        title: '数据',

        shortTitle: '数据',

        smallIcon: 'gfx/icons/facts.svg',

        isVisibleInMenu: false,

        MainContent: {
            value: FactsView
        }

    });

    return FactsSection;
});