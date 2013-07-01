enyo.kind({
    name: "CSenseMenuPane",
    kind: enyo.FittableColumns,
    style: "background-color: purple;",
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
	{name: "menuDrawer", kind: onyx.Drawer, layoutKind: enyo.FittableRowsLayout, orient: "h", style: "position: relative;", open: false, components: [
	    		{content: "Campaign List", ontap: "showCampaignList", classes: "slidein-option"},
	    		{content: "Leaderboard", ontap: "showLeaderboard", classes: "slidein-option"},
	]},
	{kind: enyo.FittableRows, fit: true, components: [
		{kind: onyx.Toolbar, components: [
	    		{kind: onyx.Grabber, ontap: "showMenu"}
		]},
        	{name: "menupane", kind: enyo.Panels, fit: true, draggable: false, animate: true, index: 1, arrangerKind: enyo.CardArranger, components: [
		    	{name: "llist", kind: enyo.FittableRows, components: [
                		{kind: "LeaderboardList", multiselect: false, fit: true},
			]},
		    	{name: "clist", kind: enyo.FittableRows, components: [
                		{kind: "FilledPanels", fit: true},
			]},
		    	{name: "sense", kind: enyo.FittableRows, components: [
				//{kind: "ComplexSensr"}
			]}
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
    create: function () {
        this.inherited(arguments);
        if(LocalStorage.get("user") === undefined) {
            this.$.popup.show();
        }
        //this.$.menupane.createComponent({name: "sensr", kind: "ComplexSensr", fit: true, complex: complex, data: c, classes: "content"});
		this.$.menupane.render();
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
		var truthy = this.$.menuDrawer.getOpen();
		this.log(truthy);
		this.$.menuDrawer.setOpen(!truthy);
    },
    showCampaignList: function(inSender, inEvent) {
		this.$.menuDrawer.setOpen(false);
		this.$.menupane.setIndex(1);
		this.$.menupane.render();
    },
    showLeaderboard: function(inSender, inEvent) {
		this.$.menuDrawer.setOpen(false);
		this.$.menupane.setIndex(0);
		this.$.menupane.render();
    }
});
