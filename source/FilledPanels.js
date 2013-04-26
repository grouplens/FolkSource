enyo.kind({
    name: "FilledPanels",
    style: "z-index: -14;",
    events: {
        onSnapped: "",
        onPlaceChosen: ""
    },
    handlers: {
        onLoaded: "drawMap",
        onDoObservation: "hidePopup"
    },
    components: [
        {name: "mapUp", kind: "onyx.Popup", style: "width: 80%; position: fixed; z-index: 2;", classes: "onyx-popup", centered: true, floating: true, modal: true, components: [
			//{name: "spin", kind: "onyx.Spinner"},
            {name: "pview", kind: "PinView", classes: "mapHide"}
		]},
		{name: "leftButton", kind: "onyx.Button", content: "<", slide: "prev", ontap: "buttonTapHandler", classes: "filledButtons", disabled: !0},
    	{name: "panels", kind: "Panels", arrangerKind: "CarouselArranger", onTransitionFinish: "transitionFinishHandler", onTransitionStart: "transitionStartHandler",classes: "filledPanels", layoutKind: "enyo.FittableColumnsLayout", components: []},
    	{name: "rightButton", kind: "onyx.Button", content: ">", slide: "next", ontap: "buttonTapHandler", classes: "filledButtons"}, 
    	{kind: "Signals", onPinClicked: "popupTriggered"}
    ],
    create: function (a, b) {
	this.inherited(arguments);
	//this.$.spinnerUp.show();
	//this.$.mapUp.show();
	var c = Data.getURL() + "campaign.json";
	var d = new enyo.Ajax({method: "GET", cacheBust: false, url: c, handleAs: "json"});
	d.go().response(this, "renderResponse");; 
	this.$.panels.$.animator.setDuration(350);
    },
    renderResponse: function (a, b) {
        this.campaignArray = b.campaigns;
        for (var c in this.campaignArray) {
            var currentCampaign = this.campaignArray[c];
            var e = "panel_" + currentCampaign.id;
            var f = "item_" + currentCampaign.id;
            var g = "map_" + currentCampaign.id;
	    /*
	     * This block below is needed because not all browsers parse dates
	     * the same way. This should be mostly browser compatible.
	     */
	    var date = Date.parse(new Date());
	    var st = currentCampaign.start_date_string.split(/[- :]/);
	    var en = currentCampaign.end_date_string.split(/[- :]/);
	    var startDate = Date.parse(new Date(st[0], st[1]-1, st[2], st[3], st[4], st[5]));
	    var endDate = Date.parse(new Date(en[0], en[1]-1, en[2], en[3], en[4], en[5]));

	    if(endDate >= date) { // "closed" campaigns shouldn't show up
		this.$.panels.createComponent(
		    {name: e, classes: "panelItem", fit: true, kind: "enyo.FittableRows", components: [
			{name: f, kind: "CampaignItem", title: "" + currentCampaign.title, description: "" + currentCampaign.description},
			{name: g, fit: true, kind: "NewMap", /*layoutKind: "enyo.FittableColumnsLayout", */provider: "openlayers", style: "height: 100%; width: 100%;" /*overflow: hidden;"*/}
			//{name: g, fit: true, kind: "MapStraction", /*layoutKind: "enyo.FittableColumnsLayout", */provider: "openlayers", style: "height: 100%; width: 100%;" /*overflow: hidden;"*/}
		]});
		if(date < startDate) { // setup structure for disallowing campaigns to show up/be used before they're "open"
		    this.log(this.$.panels.$[e]);
		    this.$.panels.$[e].running = false;
		}
	    }
	    this.render();
	    this.checkSides(); // make sure the arrow buttons work
        }
    },
    buttonTapHandler: function (a, b) {
        if(a.slide === "prev")
	    this.$.panels.previous();
	else if(a.slide === "next")
	    this.$.panels.next();
	else 
	    this.$.panels.snapTo(a.slide);
    },
    transitionFinishHandler: function (a, b) {
        var c = this.$.panels.getIndex();
        this.waterfall("onSnapped", undefined, c);
       	this.checkSides();
    },
    transitionStartHandler: function (a, b) {
        var c = this.$.panels.getIndex();
        this.waterfall("onSnapping", undefined, c);
    },
    checkSides: function () {
        var index = this.$.panels.getIndex();
        var size = this.$.panels.getPanels().length;
	var adjSize = size - 1; //adjust for counting at 0 vs. 1
        if(size == 1) {
            this.$.rightButton.setDisabled(true);
            this.$.leftButton.setDisabled(true);
        } else {
            if (this.campaignArray != undefined) {
                if (index == 0) {
                    this.$.rightButton.setDisabled(false);
                    this.$.leftButton.setDisabled(true);
                } else if (index == adjSize) {
                    this.$.rightButton.setDisabled(true);
                    this.$.leftButton.setDisabled(false);
                }
            }
        }
    },
    drawMap: function (a, b) {
        var c = this.$.panels.getPanels();
        var d = 0;
        var e;
		var f = b.originator.name.split("_")[1];
        for (x in c) {
            var g = c[x].name.split("_")[1];
            g === f && (e = this.campaignArray[x].location, this.$.panels.$["map_" + g].checkMap(e));
        }
        return !0;
    },
    popupTriggered: function (a, b) {
		this.log();
        var c = b.lat + " : " + b.lon;
        var d = this.$.panels.getIndex();
        var e;
		if(this.campaignArray[d].tasks.length === 1)
			(e = this.campaignArray[d].tasks[0].instructions);
        var f = "1";
		this.$.pview.setContent(e, f); 
		this.$.mapUp.resized(); 
		this.$.mapUp.show(); 
        return true;
    },
    hidePopup: function () {
        this.$.mapUp.hide();
        var a = this.campaignArray[this.$.panels.getIndex()];
        return this.bubble("onPlaceChosen", undefined, a), !0;
    }
});
