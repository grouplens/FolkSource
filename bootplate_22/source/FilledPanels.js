enyo.kind({
    name: "FilledPanels",
    //style: "z-index: -14;",
    kind: enyo.FittableRows,
	classes: "light-background",
    events: {
        onSnapped: "",
        onPlaceChosen: ""
    },
    handlers: {
        onLoaded: "drawMap",
        onDoObservation: "hidePopup"
    },
    components: [
		{kind: "Signals", onPinClicked: "popupTriggered"},
		{name: "mapUp", kind: "onyx.Popup", style: "width: 80%; position: fixed; z-index: 2;", classes: "light-background onyx-popup", centered: true, floating: true, modal: true, scrim: true, scrimWhenMobal: false, components: [
			{name: "pview", kind: "PinView", classes: "mapHide"}
		]},
		//{kind: enyo.FittableColumns, fit: true, components: [
			{name: "body", kind: enyo.FittableRows, fit: true, components: [
				{kind: "WarnDrawer", warning: "filler"},
				{name: "cols", style: "height: 30%;", kind: enyo.FittableColumns, components: [
					{name: "leftButton", kind: onyx.Button, slide: "prev", ontap: "buttonTapHandler", classes: "button-style filledButtons", disabled: !0, components: [
						{tag: "i", classes: "icon-chevron-left icon-2x color-icon"}
					]},
					{kind: enyo.FittableRows, fit: true, components: [
						{name: "panels", kind: "Panels", arrangerKind: "CarouselArranger", onTransitionFinish: "transitionFinishHandler", onTransitionStart: "transitionStartHandler", classes: "filledPanels light-background", layoutKind: enyo.FittableColumnsLayout, fit: true},
						//{content: "Tap the pin/region on the map to help!", style: "font-size: 11pt; font-weight: 100; text-align: center;", classes: "light-background"},
					]},
					{name: "rightButton", kind: onyx.Button, slide: "next", ontap: "buttonTapHandler", classes: "button-style filledButtons", components: [
						{tag: "i", classes: "icon-chevron-right icon-2x color-icon"}
					]}, 
				]}
				//{kind: "NewMap", fit: true}
			]},
		//]},
    ],
    create: function (a, b) {
		this.inherited(arguments);
		//this.$.spinnerUp.show();
		//this.$.mapUp.show();
		var c = Data.getURL() + "campaign.json";
		var d = new enyo.Ajax({method: "GET", cacheBust: false, url: c, handleAs: "json"});
		d.go().response(this, "renderResponse");
		this.$.panels.$.animator.setDuration(150);
	},
	renderResponse: function (a, b) {
		this.campaignArray = b.campaigns;
		this.log(this.campaignArray);
		var remove = [];
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
			/*var st = currentCampaign.start_date_string.split(/[- :]/);
			var en = currentCampaign.end_date_string.split(/[- :]/);
			var startDate = Date.parse(new Date(st[0], st[1]-1, st[2], st[3], st[4], st[5]));
			var endDate = Date.parse(new Date(en[0], en[1]-1, en[2], en[3], en[4], en[5]));*/

			//if(endDate >= date) { // "closed" campaigns shouldn't show up
			//if(currentCampaign.title !== undefined) {
				this.$.panels.createComponent(
					{name: e, classes: "panelItem", fit: true, kind: enyo.FittableRows, components: [
						{name: f, kind: "CampaignItem", title: "" + currentCampaign.title, description: "" + currentCampaign.description},
					]}
				);
			/*} else 
				remove.push(c);*/
			this.$.panels.resized();

		}
		/*for (var x in remove) {
			this.campaignArray.splice(remove[x], 1);
		}*/
		this.$.body.createComponent({name: "map", kind: "NewMap", fit: true}, {owner: this});
		this.$.body.resized();
		this.$.body.render();
		this.$.cols.resized();
		this.$.cols.render();
		this.checkSides(); // make sure the arrow buttons work
		this.drawMap();
		//navigator.splashscreen.hide();
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
		this.log();
        this.waterfallDown("onSnapped", undefined, c);
		this.drawMap();
		this.checkSides();
    },
    transitionStartHandler: function (a, b) {
        var c = this.$.panels.getIndex();
		this.log();
        this.waterfall("onSnapping", undefined, c);
    },
    checkSides: function () {
        var index = this.$.panels.getIndex();
        var size = this.$.panels.getPanels().length;
		var adjSize = size - 1; //adjust for counting at 0 vs. 1
		this.$.rightButton.setDisabled(false);
		this.$.leftButton.setDisabled(false);
		if (this.campaignArray !== undefined) {
			if (index === 0) {
				this.$.rightButton.setDisabled(false);
				this.$.leftButton.setDisabled(true);
			} else if (Number(index) === adjSize) {
				this.$.rightButton.setDisabled(true);
				this.$.leftButton.setDisabled(false);
			}
		}
	},
    drawMap: function (inSender, inEvent) { //inSender = a, inEvent = b;
		this.log();
        var panels = this.$.panels.getPanels();
        var d = 0;
        var e;
		//var name = inEvent.originator.name.split("_")[1];
		//var tmp = [];
        for (var x in panels) {
			this.sendTasks();
			/*var curName = panels[x].name.split("_")[1];
			if(curName === name) {
				var tasks = this.campaignArray[x].tasks;
				for(y in tasks) {
					tmp.push(tasks[y].locations);
				}
				var tmp2 = [];
				tmp2 = tmp2.concat.apply(tmp2, tmp);
				this.$.map.checkMap(tmp2);
			}*/
        }
        return !0;
    },
	sendTasks: function(inSender, inEvent) {
		var tasks = this.campaignArray[this.$.panels.getIndex()].tasks;
		var tmp = [];
		for(var y in tasks) {
			tmp.push(tasks[y].locations);
		}
		var tmp2 = [];
		tmp2 = tmp2.concat.apply(tmp2, tmp);
		this.$.map.checkMap(tmp2);
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
