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
        {name: "mapUp", kind: "onyx.Popup", style: "width: 80%; position: fixed; z-index: 2;", classes: "onyx-popup", centered: !0, floating: !0, modal: !0,components: [
            {name: "pview", kind: "PinView"}]
    	},
		{name: "leftButton", kind: "onyx.Button", content: "<", slide: "prev", ontap: "buttonTapHandler", classes: "filledButtons", disabled: !0},
    	{name: "panels", kind: "Panels", arrangerKind: "CarouselArranger", onTransitionFinish: "transitionFinishHandler", onTransitionStart: "transitionStartHandler",classes: "filledPanels", layoutKind: "enyo.FittableColumnsLayout", components: []},
    	{name: "rightButton", kind: "onyx.Button", content: ">", slide: "next", ontap: "buttonTapHandler", classes: "filledButtons"}, 
    	{kind: "Signals", onPinClicked: "popupTriggered"}
    ],
    create: function (a, b) {
        var c = Data.getURL() + "campaign.json";
        var d = new enyo.Ajax({method: "GET", cacheBust: false, url: c, handleAs: "json"});
        d.response(this, "renderResponse");
		d.go(); this.inherited(arguments);
		this.$.panels.$.animator.setDuration(350);
    },
    renderResponse: function (a, b) {
        this.campaignArray = b.campaigns;
        for (var c in this.campaignArray) {
            var d = this.campaignArray[c];
            var e = "panel_" + d.id;
            var f = "item_" + d.id;
            var g = "map_" + d.id;
            this.$.panels.createComponent({name: e, classes: "panelItem", fit: true, kind: "enyo.FittableRows", components: [{name: f, kind: "CampaignItem", title: "" + d.title, description: "" + d.description},{name: g, fit: true, kind: "MapStraction", layoutKind: "enyo.FittableRowsLayout", provider: "openlayers", style: "height: 100%;" /*overflow: hidden;"*/}]});
            this.render();
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
        this.waterfall("onSnapped", undefined, c), this.checkSides();
    },
    transitionStartHandler: function (a, b) {
        var c = this.$.panels.getIndex();
        this.waterfall("onSnapping", undefined, c);
    },
    checkSides: function () {
        var a = this.$.panels.getIndex();
        var size = this.$.panels.getPanels().length;
        if(size == 1) {
            this.$.rightButton.setDisabled(true);
            this.$.leftButton.setDisabled(true);
        } else {
            if (this.campaignArray != undefined) {
                var b = this.campaignArray.length - 1;
                if (a == 0) {
                    this.$.rightButton.setDisabled(false);
                    this.$.leftButton.setDisabled(true);
                } else if (a == b) {
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
        var c = b.lat + " : " + b.lon,
            d = this.$.panels.getIndex(),
            e;
        this.campaignArray[d].tasks.length === 1 && (e = this.campaignArray[d].tasks[0].instructions);
        var f = "50";
        return this.$.pview.setContent(e, f), this.$.mapUp.resized(), this.$.mapUp.show(), !0;
    },
    hidePopup: function () {
        this.$.mapUp.hide();
        var a = this.campaignArray[this.$.panels.getIndex()];
        return this.bubble("onPlaceChosen", undefined, a), !0;
    }
});
