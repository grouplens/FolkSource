enyo.kind({
    name: "FilledPanels",
    //fit: true,
    //kind: "FittableRows",
    style: "height: 100%; z-index: -14; width: 100%;", //set to -14 to be sure
    events: {
        onSnapped: "",
        onPlaceChosen: ""
    },
    handlers: {
        onLoaded: "drawMap",
        //onPinClicked: "popupTriggered",
        onDoObservation: "hidePopup"
    },
    components: [
        {name: "mapUp", kind: "onyx.Popup", style: "width: 80%; position: fixed; z-index: 2;", classes: "onyx-popup", centered: true, floating: true, modal: true, components: [
            {name: "pview", kind: "PinView"}
        ]}, 
            {name: "leftButton", kind: "onyx.Button", content: "<", slide: "prev", ontap: "buttonTapHandler", classes: "filledButtons", disabled: true },
            {name: "panels", kind: "Panels", arrangerKind: "CarouselArranger", onTransitionFinish: "transitionFinishHandler", classes: "filledPanels", components: []},
            {name: "rightButton", kind: "onyx.Button", content: ">", slide: "next", ontap: "buttonTapHandler", classes: "filledButtons"},
            {kind: "Signals", onPinClicked: "popupTriggered"}
    ],

    create: function(inSender, inEvent) {
        var url = Data.getURL() + "campaign.json";
        var request = new enyo.Ajax({contentType: "application/json", cacheBust: false, url: url});
        request.response(this, "renderResponse");
        request.go();
        this.inherited(arguments);
        this.$.panels.$.animator.setDuration(50); //speed up the animation, defaults to 350ms
    },
    renderResponse: function(inSender, inResponse) {
        this.campaignArray = inResponse.campaigns;
        for (var camp in this.campaignArray) {
            var obj = this.campaignArray[camp];
            var panel = "panel_"+obj.id;
            var item = "item_"+obj.id;
            var map = "map_"+obj.id;

            this.$.panels.createComponent(
                {name: panel, kind: "enyo.FittableRows",  classes: "panelItem", components: [
                    {name: item, kind: "CampaignItem", fit: true, title: ""+obj.title, description: ""+obj.description},
                    {name: map, kind: "MapStraction", fit: true}
                ]}
            );
        }
        this.render();
    },
    buttonTapHandler: function(inSender, inEvent) {
        if (inSender.slide === "prev") {
            this.$.panels.previous();
        } else if (inSender.slide === "next") {
            this.$.panels.next();
        } else {
            this.$.panels.snapTo(inSender.slide);
        }
    },

    transitionFinishHandler: function(inSender, inEvent) {
        this.doSnapped(undefined, this.$.panels.getIndex());
        this.checkSides()
    },

    checkSides: function() {
        var index = this.$.panels.getIndex();
        if(this.campaignArray != undefined)
        var end = this.campaignArray.length - 1;
        if(index == 0) {
            this.$.rightButton.setDisabled(false);
            this.$.leftButton.setDisabled(true);
        } else if(index == end) {
            this.$.leftButton.setDisabled(false);
            this.$.rightButton.setDisabled(true);
        } else {
            this.$.leftButton.setDisabled(false);
            this.$.rightButton.setDisabled(false);
        }
    },
    drawMap: function(inSender, inEvent) {
        var p = this.$.panels.getPanels();
        var id = 0;
        var locations;
        var inID = inEvent.originator.name.split("_")[1];
        for (x in p) {
            var curID = p[x].name.split("_")[1];
            if (curID === inID) {
                locations = this.campaignArray[x].location;
                this.$.panels.$["map_"+curID].checkMap(locations);
            }
        }
        return true;
    },
    popupTriggered: function(inSender, inEvent) {
        var thing = inEvent.lat + " : " + inEvent.lon;
        var id = this.$.panels.getIndex();
        var inst;
        if(this.campaignArray[id].tasks.length === 1) {
            inst = this.campaignArray[id].tasks[0].instructions;
        } else {
            //WE'D LIKE TO FIGURE OUT WHICH POINT WAS TAPPED, THIS
            //DOESN'T HAPPEN YET
        }
        var val = "50"; //THIS IS HARD-CODED, FIGURE IT OUT
        this.$.pview.setContent(inst, val);
        this.$.mapUp.resized();
        this.$.mapUp.show();
        return true;
    },
    hidePopup: function() {
        this.$.mapUp.hide();
        var t = this.campaignArray[this.$.panels.getIndex()];//.tasks[0];
        this.bubble("onPlaceChosen", undefined, t);
        return true;
    }
});
