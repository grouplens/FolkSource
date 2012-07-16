enyo.kind({
    name: "CSenseMenuPane",
    classes: "enyo-fit",
    handlers: {
        onSuccessCode: "unPop",
        onFailureCode: "rePop",
        onPlaceChosen: "openSense",
        onSubmissionMade: "closeSense"
    },
    events: {
        onSenseOpened: ""
    },
    components: [
        {kind: "onyx.Popup", centered: true, modal: true, autoDismiss: false, style: "position: fixed; z-index: 15;", components: [
            {kind: "CSenseLoginRegister"}
    ]},
    { name: "menupane", kind: "MenuPane",
        style: "height: 100%;",
        onViewChanged: "viewChangedHandler",
        onMenuOpened: "menuOpenedHandler",
        onMenuClosed: "menuClosedHandler",
        menu: [
            { content: "I want to see:", classes: "menu-header" },
            { content: "Campaign List", view: "campList", classes: "menu-item" },
            {name: "lb", content: "Leaderboard", view: "lboard", classes: "menu-item"}
        ],
        components: [
            { name: "campList", classes: "view enyo-fit", components: [
                { kind: "Toolbar", header: "Campaign List", onToggleMenu: "toolbarToggleMenuHandler", onToggleSecondaryMenu: "toolbarToggleSecondaryMenuHandler", classes: "toolbar"},
                {style: "clear: both;", classes: "content", fit: true, kind: "FilledPanels"}
        ]},
        { name: "lboard", classes: "view enyo-fit", components: [
            { kind: "Toolbar", header: "Leaderboard", onToggleMenu: "toolbarToggleMenuHandler", onToggleSecondaryMenu: "toolbarToggleSecondaryMenuHandler", classes: "toolbar"},
            {classes: "content", kind: "LeaderboardList", fit: true, multiselect: false}
        ]},
        { name: "sense", classes: "view enyo-fit", components: [
            { kind: "Toolbar", fit: true, onToggleMenu: "toolbarToggleMenuHandler",  onToggleSecondaryMenu: "toolbarToggleSecondaryMenuHandler", classes: "toolbar" },
            {name: "sensr", classes: "content", kind: "TryComplexSensr", fit: true, complex: false}
        ]}
        ]}
    ],
    unPop: function() {
        this.$.popup.setShowing(false);
    },
    rePop: function() {
        this.$.popup.setShowing(false);
        this.$.popup.setShowing(true);
    },
    openSense: function(inSender, inEvent) {
        var data = inEvent.originator;
        for (var a in data.tasks[0].questions) {
            if(data.tasks[0].questions[a].type.indexOf("complex") != -1) {
                this.log()
                this.$.sensr.complex = true;
                break;
            } else {
                this.$.sensr.complex = false;
            }
        }
        this.$.sensr.setTaskData(data);
        this.$.menupane.selectView('sense');
        return true;
    },
    closeSense: function(inSender, inEvent) {
        this.log();
        this.$.menupane.selectView('campList');
        //this.$.campList.render();
        return true;
    },
    create: function() {
        this.inherited(arguments);
        this.log(LocalStorage.get("user"));
        if(LocalStorage.get("user") === undefined) {
            this.$.popup.show();
        }
        document.addEventListener("backKeyDown", enyo.bind(this, "backKey"), true);
    },
    backKey: function() {
        if (this.curView != "campList") {
            this.$.menupane.selectView('campList');
        }
    },
    viewChangedHandler: function(inSender, inEvent) {
        this.curView = inEvent.originator;
        if(this.curView === "sense") { //We're going to the Sense page
            this.$.sensr.openNext();
        }
        if(this.curView === "lboard") {// We're going to leaderboard
            this.$.lboard.render();
        }
        if(this.curView === "campList") {
            //this.$.campList.render();
        }
    },
    menuOpenedHandler: function(inSender, inEvent) {
        this.log()
    },
    menuClosedHandler: function(inSender, inEvent) {
        this.log();
    },
    toolbarToggleMenuHandler: function(inSender, inEvent) {
        this.log();
        this.$.menupane.toggleMenu();
    }
});
