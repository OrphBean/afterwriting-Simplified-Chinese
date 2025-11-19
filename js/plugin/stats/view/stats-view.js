define(function(require) {

    var template = require('text!plugin/stats/view/stats.hbs'),
        $ = require('jquery'),
        helper = require('utils/helper'),
        Header = require('theme/aw-bubble/view/header'),
        Protoplast = require('protoplast'),
        SpiderChart = require('utils/charts/spider'),
        BarChart = require('utils/charts/bar'),
        PieChart = require('utils/charts/pie'),
        PageBalanceChart = require('utils/charts/page_balance'),
        LineChart = require('utils/charts/line'),
        LocationsBreakdown = require('utils/charts/locations_breakdown'),
        SectionViewMixin = require('theme/aw-bubble/view/section-view-mixin'),
        StatsViewPresenter = require('plugin/stats/view/stats-view-presenter'),
        ThemeModel = require('theme/aw-bubble/model/theme-model'),
        ThemeController = require('theme/aw-bubble/controller/theme-controller'),
        BaseComponent = require('core/view/base-component');

    return BaseComponent.extend([SectionViewMixin], {

        $meta: {
            presenter: StatsViewPresenter
        },

        hbs: template,

        themeController: {
            inject: ThemeController
        },

        themeModel: {
            inject: ThemeModel
        },

        $sceneLengthType: null,

        // TODO: Move to presenter? (+)
        settings: {
            inject: 'settings'
        },

        whoWithWhoHeader: {
            component: Header
        },

        scriptPulseHeader: {
            component: Header
        },

        sceneLengthHeader: {
            component: Header
        },

        locationsBreakdownHeader: {
            component: Header
        },

        pageBalanceHeader: {
            component: Header
        },

        daysAndNightsHeader: {
            component: Header
        },

        intVsExtHeader: {
            component: Header
        },

        data: null,

        spiderChart: null,

        barChart: null,

        pieChart: null,

        pageBalanceChart: null,

        lineChart: null,

        locationsBreakdown: null,

        init: function() {
            BaseComponent.init.call(this);

            this.spiderChart = SpiderChart;
            this.barChart = BarChart;
            this.pieChart = PieChart;
            this.pageBalanceChart = PageBalanceChart;
            this.lineChart = LineChart;
            this.locationsBreakdown = LocationsBreakdown;

            this.whoWithWhoHeader.id = "stats-who";
            this.whoWithWhoHeader.title = "谁与谁对话（按场景数）";
            this.whoWithWhoHeader.description = "每个人物由一个圆圈表示（最多 10 个人物）。如果人物之间有线连接，表示他们在同一场景中对话。线条越粗，共同出现的场景越多。将鼠标悬停在人物圆圈上，可查看该人物与其他人物的对话场景数。";

            this.scriptPulseHeader.id = "stats-tempo";
            this.scriptPulseHeader.title = "剧本节奏";
            this.scriptPulseHeader.description = "短场景和短动作/对白段落会加快节奏。长场景和长段落会减慢节奏。";

            this.sceneLengthHeader.id = "stats-scene-length";
            this.sceneLengthHeader.title = "场景长度";
            this.sceneLengthHeader.description = "每个条形代表一个场景（白色条形为白天场景，黑色条形为晚上场景）。将鼠标悬停在条形上可查看场景的估计时长。您可以点击条形跳转到编辑器中的相应场景。";

            this.locationsBreakdown.id = "stats-locations-breakdown";
            this.locationsBreakdownHeader.title = "地点分布";
            this.locationsBreakdownHeader.description = "Blocks on the top strip represent amount of time spent in a location. If a location occurs more than once in the script, it's highlighted by a colour (white colour is used for each location occurring only once).<br />Pie chart below shows time distribution for each location. Mouse over the blocks to see corresponding data on the pie chart (and vice versa).";

            this.pageBalanceHeader.id = "stats-page-balance";
            this.pageBalanceHeader.title = "页面平衡";
            this.pageBalanceHeader.description = "Shows balance between action time and dialogue time on each page. Click on a page to jump to the editor.";

            this.daysAndNightsHeader.id = "stats-days-nights";
            this.daysAndNightsHeader.title = "白天与晚上";
            this.daysAndNightsHeader.description = "饼图显示白天与晚上场景的分布。将鼠标悬停在区域上可查看白天/晚上场景的数量。";

            this.intVsExtHeader.id = "stats-int-ext";
            this.intVsExtHeader.title = "内景 vs 外景";
            this.intVsExtHeader.description = "饼图显示内景与外景场景的分布。将鼠标悬停在区域上可查看内景/外景场景的数量。";
        },

        addBindings: function() {
            Protoplast.utils.bind(this, 'data', this._render);
        },

        addInteractions: function() {
            var themeModel = this.themeModel;

            this.$sceneLengthType.on('change', this._render);

            Protoplast.utils.bind(themeModel, 'expanded', function() {
                if (this.active) {
                    this._render();
                }
            }.bind(this));
        },
        
        refresh: function() {
            // TODO: Remove refresh method, chart should refresh when parent content changes (+)
            // Timeout is added to make sure _render is called after content is fully expanded/collapsed
            // as chart components rely on query ".content" to calculate width of the chart
            setTimeout(function() {
                this._render();
            }.bind(this), 0);
        },

        _render: function() {

            var themeController = this.themeController;
            var themeModel = this.themeModel;

            if (!this.data) {
                return;
            }

            this.spiderChart.render('#who-with-who', this.data.who_with_who.characters, this.data.who_with_who.links, {
                label: 'name'
            });

            this.barChart.render('#stats-scene-length', this.data.scenes, {
                tooltip: function(d) {
                    return d.header + ' (time: ' + helper.format_time((d.length / this.settings.print.lines_per_page)) + ')';
                }.bind(this),
                value: 'length',
                small: themeModel.small,
                show_tooltip: themeController.showTooltip.bind(themeController),
                hide_tooltip: themeController.hideTooltip.bind(themeController),
                move_tooltip: themeController.moveTooltip.bind(themeController),
                color: function(d) {
                    if (this.$sceneLengthType.val() === "int_ext") {
                        if (d.location_type === 'mixed') {
                            return '#777777';
                        } else if (d.location_type === 'int') {
                            return '#eeeeee';
                        } else if (d.location_type === 'ext') {
                            return '#111111';
                        } else if (d.location_type === 'other') {
                            return '#444444';
                        }
                    }

                    if (d.type == 'day') {
                        return '#eeeeee';
                    } else if (d.type == 'night') {
                        return '#222222';
                    } else {
                        return '#777777';
                    }
                }.bind(this),
                bar_click: function(d) {
                    if (!themeModel.small) {
                        this._goto(d.token.line);
                    }
                }.bind(this)
            });

            this.pieChart.render('#stats-days-and-nights', this.data.days_and_nights, {
                tooltip: function(d) {
                    return d.data.label + ': ' + d.data.value + (d.data.value == 1 ? ' 个场景' : ' 个场景');
                },
                value: 'value',
                small: themeModel.small,
                show_tooltip: themeController.showTooltip.bind(themeController),
                hide_tooltip: themeController.hideTooltip.bind(themeController),
                move_tooltip: themeController.moveTooltip.bind(themeController),
                color: function(d) {
                    if (d.data.label == 'DAY') {
                        return '#eeeeee';
                    } else if (d.data.label == 'NIGHT') {
                        return '#222222';
                    } else if (d.data.label == 'DAWN') {
                        return '#777777';
                    } else if (d.data.label == 'DUSK') {
                        return '#444444';
                    } else {
                        return '#aaaaaa';
                    }
                }
            });

            var int_ext_labels = {
                int: 'INT.',
                ext: 'EXT.',
                mixed: 'INT./EXT.',
                other: 'OTHER'
            };

            this.pieChart.render('#stats-int-ext', this.data.int_and_ext, {
                tooltip: function(d) {
                    return int_ext_labels[d.data.label] + ': ' + d.data.value + (d.data.value == 1 ? ' 个场景' : ' 个场景');
                },
                value: 'value',
                small: themeModel.small,
                show_tooltip: themeController.showTooltip.bind(themeController),
                hide_tooltip: themeController.hideTooltip.bind(themeController),
                move_tooltip: themeController.moveTooltip.bind(themeController),
                color: function(d) {
                    if (d.data.label == 'mixed') {
                        return '#777777';
                    } else if (d.data.label == 'int') {
                        return '#eeeeee';
                    } else if (d.data.label == 'ext') {
                        return '#111111';
                    } else if (d.data.label == 'other') {
                        return '#444444';
                    }
                }
            });

            this.pageBalanceChart.render('#stats-page-balance', this.data.page_balance, {
                page_click: function(d) {
                    if (!themeModel.small) {
                        this._goto(d.first_line.token.line);
                    }
                }.bind(this),
                small: themeModel.small,
                show_tooltip: themeController.showTooltip.bind(themeController),
                hide_tooltip: themeController.hideTooltip.bind(themeController),
                move_tooltip: themeController.moveTooltip.bind(themeController)
            });

            this.lineChart.render('#stats-tempo', this.data.tempo, {
                value: 'tempo',
                small: themeModel.small,
                show_tooltip: themeController.showTooltip.bind(themeController),
                hide_tooltip: themeController.hideTooltip.bind(themeController),
                move_tooltip: themeController.moveTooltip.bind(themeController),
                tooltip: function(d, i) {
                    if (i === this.data.tempo.length - 1) {
                        return '';
                    }
                    return d.scene + '<br />...' + d.line + '... ';
                }.bind(this),
                click: function(d) {
                    if (!themeModel.small) {
                        this._goto(d.line_no);
                    }
                }.bind(this)
            });

            this.locationsBreakdown.render('#locations-breakdown', this.data.locationsBreakdown, {
                small: themeModel.small,
                show_tooltip: themeController.showTooltip.bind(themeController),
                hide_tooltip: themeController.hideTooltip.bind(themeController),
                move_tooltip: themeController.moveTooltip.bind(themeController)
            });

        },

        _goto: function(position) {
            this.dispatch('goto', position);
        }

    });

});
