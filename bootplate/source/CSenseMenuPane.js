enyo.kind({
    name: "CSenseMenuPane",
    kind: "enyo.FittableRows",
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
    components: [
        {kind: "onyx.Popup", centered: true, modal: true, autoDismiss: false, style: "position: fixed; z-index: 15;", components: [
            {kind: "CSenseLoginRegister"}
        ]},
        {name: "menupane", kind: "rwatkins.MenuPane", fit: true, onViewChange: "viewChangedHandler", onMenuOpened: "menuOpenedHandler", onMenuClosed: "menuClosedHandler", menu: [
            {content: "I want to see:", classes: "menu-header"},
            {content: "Campaign List", view: "campList", classes: "menu-item"},
            {name: "lb", content: "Leaderboard", view: "lboard",classes: "menu-item"}
        ],
        components: [
            {name: "campList", layoutKind: "enyo.FittableRowsLayout", classes: "view enyo-fit", components: [
                {kind: "Toolbar", header: "Campaign List", onToggleMenu: "toolbarToggleMenuHandler", onToggleSecondaryMenu: "toolbarToggleSecondaryMenuHandler", classes: "toolbar"},
                {classes: "content", fit: true,kind: "FilledPanels"}
            ]},
            {name: "lboard", layoutKind: "enyo.FittableRowsLayout", classes: "view enyo-fit", components: [
                {kind: "Toolbar", header: "Leaderboard", onToggleMenu: "toolbarToggleMenuHandler", onToggleSecondaryMenu: "toolbarToggleSecondaryMenuHandler", classes: "toolbar"},
                {classes: "content", kind: "LeaderboardList", multiselect: false}
            ]},
            {name: "sense", layoutKind: "enyo.FittableRowsLayout", classes: "view enyo-fit", components: [
                {kind: "Toolbar", onToggleMenu: "toolbarToggleMenuHandler", onToggleSecondaryMenu: "toolbarToggleSecondaryMenuHandler", classes: "toolbar"}
            ]}
        ]}
    ],
    unPop: function () {
        this.$.popup.setShowing(!1);
    },
    rePop: function () {
        this.$.popup.setShowing(!1), this.$.popup.setShowing(!0);
    },
    renderScroller: function () {
        this.log();
        /*this.reflow();
        this.$.sensr.render();
        this.resized();
        this.$.sense.resized();
        this.$.sensr.resized();
        this.reflow();
        this.$.sense.reflow();
        this.$.sensr.reflow();
        this.render();
        this.$.sense.render();
        this.$.sensr.render();*/
    },
    openSense: function (a, b) {
        var c = b.originator;
        var complex = false;
        for (var d in c.tasks[0].questions) {
            if (c.tasks[0].questions[d].type.indexOf("complex") != -1) {
                complex = true;
                break;
            }
        }
        if(this.$.sensr != undefined)
            this.$.sensr.destroy();

        this.$.sense.createComponent({name: "sensr", kind: "ComplexSensr", fit: true, complex: complex, data: c, classes: "content"}, {owner: this});
        //this.$.sensr.setTaskData(c);
        /*this.$.sensr.resized();
        this.$.sensr.reflow();
        this.$.sensr.render();*/
        this.$.menupane.selectView("sense");
        return true;
    },
    closeSense: function (a, b) {
        return this.log(), this.$.menupane.selectView("campList"), !0;
    },
    create: function () {
        this.inherited(arguments);
        if(LocalStorage.get("user") === undefined) {
            this.$.popup.show();
        }
    },
    backKey: function () {
        this.curView != "campList" && this.$.menupane.selectView("campList");
    },
    viewChangedHandler: function (a, b) {
        var start = b.originator;
        if(start === "sense")
            this.$.sensr.openNext();
        if(this.curView === "lboard")
           this.$.lboard.render();
        //if(this.curView !== "campList")
            //
    },
    menuOpenedHandler: function (a, b) {
        this.log();
    },
    menuClosedHandler: function (a, b) {
        this.log();
    },
    toolbarToggleMenuHandler: function (a, b) {
        this.log();
        this.$.menupane.toggleMenu();
    }
});
