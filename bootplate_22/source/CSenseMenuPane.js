enyo.kind({
    name: "CSenseMenuPane",
	fit: true,
    kind: enyo.FittableColumns,
	classes: "dark-background",
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
        {kind: onyx.Popup, autoDismiss: false, centered: true, floating: true, modal: true, scrimWhenModal: false, scrim: true, classes: "light-background", components: [
            {kind: "CSenseLoginRegister"}
        ]},
		{kind: enyo.FittableRows, fit: true, components: [
			{name: "menuDrawer", kind: enyo.Panels, fit: true, narrowFit: false, index: 1, draggable: false, margin: 0, arrangerKind: enyo.CollapsingArranger, layoutKind: enyo.FittableColumnsLayout, components: [
				{kind: enyo.FittableRows, classes: "dark-background", components: [ //index 0
					{ontap: "showCampaignList", kind: enyo.FittableColumns, classes: "slidein-option button-style light-background", style: "width: 100%;", onup: "toggleHilight", ondown: "toggleHilight", components: [
						{tag: "i", classes: "icon-map-marker icon-large", style: "padding: 0 5px;", ontap: "showMenu"},
						{content: "Campaign List", fit: true}
					]},
					{ontap: "showLeaderboard", kind: enyo.FittableColumns, classes: "slidein-option button-style light-background", style: "width: 100%;", onup: "toggleHilight", ondown: "toggleHilight", components: [
						{tag: "i", classes: "icon-trophy icon-large", style: "padding: 0 5px;", ontap: "showMenu"},
						{content: "Leaderboard", fit: true}
					]},
					{kind: "GrouplensBrand", fit: true}
				]},
				{kind: enyo.FittableRows, fit: true, style: "min-width: 100%;", components: [ //index 1
					{kind: onyx.Toolbar, classes: "dark-background-flat", components: [
						{name: "menuButton", tag: "i", classes: "icon-align-justify icon-large", style: "color: #6DB961; vertical-align: middle;", ontap: "showMenu"},
						{content: "CitizenSense", style: "text-align: center;"}
					]},
					{name: "menupane", kind: enyo.Panels, fit: true, draggable: false, animate: false, index: 1, arrangerKind: enyo.CardSlideInArranger, components: [
						{name: "llist", kind: enyo.FittableRows, style: "border: 1px black solid;", components: [
							{kind: "LeaderboardList", multiselect: false, fit: true},
						]},
						{name: "clist", kind: enyo.FittableRows, style: "border: 1px black solid;", components: [
							{kind: "FilledPanels", fit: true},
						]},
						{name: "sense", kind: enyo.FittableRows, style: "border: 1px black solid;", components: [
							//{kind: "ComplexSensr"}
						]}
					]}
				]}
			]},
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

        this.$.sense.createComponent({name: "sensr", kind: "ComplexSensr", fit: true, data: c, classes: "content"});
		this.$.sense.render();
		this.$.menupane.setIndex(2);
        return true;
    },
    closeSense: function (a, b) {
		this.$.menupane.previous();
		this.$.sense.destroyComponents();
		return true;
    },
    create: function (inSender, inEvent) {
        this.inherited(arguments);
        //this.$.menupane.createComponent({name: "sensr", kind: "ComplexSensr", fit: true, complex: complex, data: c, classes: "content"});
		this.$.menupane.render();
    },
	rendered: function(inSender, inEvent) {
		this.inherited(arguments);
        if(LocalStorage.get("user") === undefined) {
			this.log(this.$.popup);
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
    showMenu: function(inSender, inEvent) {
		var index = this.$.menuDrawer.getIndex();
		if(index == 1) {
			this.$.menuDrawer.setIndex(0);
			//this.$.menuButton.addRemoveClass("active", true);
		} else {
			this.$.menuDrawer.setIndex(1);
			//this.$.menuButton.addRemoveClass("active", false);
			//this.$.menuButton.setValue(false);
		}
    },
    showCampaignList: function(inSender, inEvent) {
		this.$.menupane.setIndex(1);
		this.showMenu();
		//this.$.menuDrawer.setIndex(1);
		//this.$.menupane.render();
    },
    showLeaderboard: function(inSender, inEvent) {
		this.$.menupane.setIndex(0);
		this.showMenu();
		//this.$.menuDrawer.setIndex(1);
		//this.$.menupane.render();
    },
	toggleHilight: function(inSender, inEvent) {
		//TODO: WORK IN PROGRESS, NOT FUNCTIONING
		var truthy = inSender.hasClass("hilight");
		inSender.addRemoveClass("hilight", !truthy);
		this.log(inSender.hasClass("higlight"));
	}
});
