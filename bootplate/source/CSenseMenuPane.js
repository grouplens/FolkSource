enyo.kind({
    name: "CSenseMenuPane",
    classes: "enyo-fit",
    handlers: {
        onSuccessCode: "unPop",
        onFailureCode: "rePop",
        onPlaceChosen: "openSense",
        onSubmissionMade: "closeSense",
        onRenderScroller: "renderScroller"
    },
    events: {
        onSenseOpened: ""
    },
    components: [{
        kind: "onyx.Popup",
        centered: !0,
        modal: !0,
        autoDismiss: !1,
        style: "position: fixed; z-index: 15;",
        components: [{
            kind: "CSenseLoginRegister"
        }]
    }, {
        name: "menupane",
        kind: "rwatkins.MenuPane",
        style: "height: 100%;",
        onViewChanged: "viewChangedHandler",
        onMenuOpened: "menuOpenedHandler",
        onMenuClosed: "menuClosedHandler",
        menu: [{
            content: "I want to see:",
            classes: "menu-header"
        }, {
            content: "Campaign List",
            view: "campList",
            classes: "menu-item"
        }, {
            name: "lb",
            content: "Leaderboard",
            view: "lboard",
            classes: "menu-item"
        }],
        components: [{
            name: "campList",
            kind: "enyo.FittableRows",
            classes: "view enyo-fit",
            components: [{
                kind: "Toolbar",
                header: "Campaign List",
                onToggleMenu: "toolbarToggleMenuHandler",
                onToggleSecondaryMenu: "toolbarToggleSecondaryMenuHandler",
                classes: "toolbar"
            }, {
                style: "clear: both;",
                classes: "content",
                fit: !0,
                kind: "FilledPanels"
            }]
        }, {
            name: "lboard",
            kind: "enyo.FittableRows",
            classes: "view enyo-fit",
            components: [{
                kind: "Toolbar",
                header: "Leaderboard",
                onToggleMenu: "toolbarToggleMenuHandler",
                onToggleSecondaryMenu: "toolbarToggleSecondaryMenuHandler",
                classes: "toolbar"
            }, {
                classes: "content",
                kind: "LeaderboardList",
                fit: !0,
                multiselect: !1
            }]
        }, {
            name: "sense",
            kind: "enyo.FittableRows",
            fit: !0,
            classes: "view",
            components: [{
                kind: "Toolbar",
                onToggleMenu: "toolbarToggleMenuHandler",
                onToggleSecondaryMenu: "toolbarToggleSecondaryMenuHandler",
                classes: "toolbar"
            }, {
                name: "sensr",
                classes: "content",
                style: "height: 400px;",
                kind: "enyo.Scroller",
                components: [{
                    kind: "TryComplexSensr",
                    complex: !1
                }]
            }]
        }]
    }],
    unPop: function () {
        this.$.popup.setShowing(!1);
    },
    rePop: function () {
        this.$.popup.setShowing(!1), this.$.popup.setShowing(!0);
    },
    renderScroller: function () {
        this.$.sensr.render();
    },
    openSense: function (a, b) {
        var c = b.originator;
        for (var d in c.tasks[0].questions) {
            if (c.tasks[0].questions[d].type.indexOf("complex") != -1) {
                this.$.tryComplexSensr.complex = !0;
                break;
            }
            this.$.tryComplexSensr.complex = !1;
        }
        return this.$.tryComplexSensr.setTaskData(c), this.$.sensr.reflow(), this.$.menupane.selectView("sense"), !0;
    },
    closeSense: function (a, b) {
        return this.log(), this.$.menupane.selectView("campList"), !0;
    },
    create: function () {
        this.inherited(arguments), LocalStorage.get("user") === undefined && this.$.popup.show(), document.addEventListener("backKeyDown", enyo.bind(this, "backKey"), !0);
    },
    backKey: function () {
        this.curView != "campList" && this.$.menupane.selectView("campList");
    },
    viewChangedHandler: function (a, b) {
        this.curView = b.originator, this.curView === "sense" && this.$.tryComplexSensr.openNext(), this.curView === "lboard" && this.$.lboard.render(), this.curView !== "campList";
    },
    menuOpenedHandler: function (a, b) {
        this.log();
    },
    menuClosedHandler: function (a, b) {
        this.log();
    },
    toolbarToggleMenuHandler: function (a, b) {
        this.log(), this.$.menupane.toggleMenu();
    }
});
