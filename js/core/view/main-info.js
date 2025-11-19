define(function(require) {
    var Switcher = require('theme/aw-bubble/view/switcher'),
        BaseComponent = require('core/view/base-component'),
        MainInfoPresenter = require('core/presenter/main-info-presenter');

    var MainInfo = BaseComponent.extend({

        html: '<div class="appInfo">' +
            '<p><b>’afterwriting</b> 将 Fountain 剧本转换为精美 PDF。免费、开源、离线优先。无需注册、无广告、简单易用。</p>' +
            '<p>从上方菜单开始，<span data-comp="switchToInfo" class="switch" href="#"></span>或<span data-comp="switchToOpen" class="switch" href="#" section="open"></span>。</p>' +
            '<p style="padding-top: 30px"><a href="./privacy.html" target="_blank">隐私政策</a> | <a href="./terms.html" target="_blank">服务条款</a></p>' +
            '</div>',

        $meta: {
            presenter: MainInfoPresenter
        },

        switchToInfo: {
            component: Switcher
        },

        switchToOpen: {
            component: Switcher
        },

        addInteractions: function() {
            this.switchToOpen.sectionName = 'open';
            this.switchToOpen.title = "打开新文件";

            this.switchToInfo.sectionName = 'info';
            this.switchToInfo.title = "了解更多";
        },

        left: {
            set: function(value) {
                this.$root.offset({left: value});
            },
            get: function() {
                return this.$root && this.$root.offset().left;
            }
        },

        outerWidth: {
            get: function() {
                return this.$root ? this.$root.outerWidth() : null;
            }
        },

    });

    return MainInfo;

});