define(function(require) {

    var Section = require('theme/aw-bubble/model/section'),
        StatsView = require('plugin/stats/view/stats-view');
    
    var FactsSection = Section.extend({
        
        title: '统计数据',

        shortTitle: '统计',

        smallIcon: 'gfx/icons/stats.svg',

        isVisibleInMenu: false,

        MainContent: {
            value: StatsView
        }

    });

    return FactsSection;
});