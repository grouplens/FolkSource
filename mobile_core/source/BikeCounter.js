enyo.kind({
    name: "BikeCounter",
    kind: "enyo.Control",
    published: {
        type: "bikes",
    },
    components: [
        {kind: "enyo.Signals", onButtonGroupChosen: "fixIt"},
        {kind: "enyo.FittableRows", components: [
        {kind: "onyx.Button", content: "Start Counting!", style: "width: 100%;", ontap: "startTimer"},
        {name: "bikes", fit: true, style: "display: inline;", components: [
            {name: "mbikes", kind: "Counter", title: "M - Bikes", style: "width:  50%; float: left;"},
            {name: "fbikes", kind: "Counter", title: "F - Bikes", style: "width:  50%; float: left;"}
        ]},
        //{tag: "hr"},
        {name: "peds", fit: true, style: "display: inline;", components: [
            {name: "mpeds", kind: "Counter", title: "M - Peds", style: "width:  50%; float: left;"},
            {name: "fpeds", kind: "Counter", title: "F - Peds", style: "width:  50%; float: left;"}
        ]}
        ]}
    ],
    events: {
        onTimer: "",
        onStartTimer: ""
    },
    create: function(inSender, inEvent)
    {
        this.inherited(arguments);
        bikesGone = false;
        pedsGone = false;
        this.timerCounter = 0;
    },
    startTimer: function(inSender, inEvent) {
        //1000 ms * 60 = 1 minute
        //1 min * 15 = 15 minute intervals
        this.waterfall("onStartTimer");
        enyo.job("sendTimerEvent", enyo.bind(this, "sendTimerEvent"), (15*(60*1000)));
        this.$.button.setDisabled(true);
    },
    sendTimerEvent: function() {
        //15 minutes intervals * 8 = 2 hours
        if(this.timerCounter < 8)
            this.timerCounter++;
        else
            enyo.job.stop("sendTimerEvent");
        this.waterfall("onTimer");
    },
    fixIt: function(inSender, inStuff) {
        if (inStuff === "Pedestrians") {
            this.removeBikes();
        }
        if (inStuff === "Bicycles") {
            this.removePeds();
        }
        if (inStuff === "Both") {
            this.recreate();
        }
        this.render();
    },
    removeBikes: function() {
        this.$.bikes.destroy();
        bikesGone = true;
    },
    removePeds: function() {
        this.$.peds.destroy();
        pedsGone = true;
    },
    recreate: function() {
        if(!bikesGone)
            this.removeBikes();
        if(!pedsGone)
            this.removePeds();
        bikesGone = false;
        bikesGone = true;
        this.createComponents([{name: "bikes", style: "clear: both;", components: [{name: "mbikes", kind: "Counter", title: "M - Bikes", style: "width:  50%; float: left;"},{name: "fbikes", kind: "Counter", title: "F - Bikes", style: "width:  50%; float: left;"}]},{tag: "hr"},{name: "peds", style: "clear: both;", components: [{name: "mpeds", kind: "Counter", title: "M - Peds", style: "width:  50%; float: left;"},{name: "fpeds", kind: "Counter", title: "F - Peds", style: "width:  50%; float: left;"}]}], {owner: this});
        this.render();
    },
    getData: function() {
        var data = {};
        if(!bikesGone) {
            bikes = {};
            bikes.m = this.$.mbikes.getCount();
            bikes.f = this.$.mpeds.getCount();
            data.bikes = bikes;
        } 
        if (!pedsGone) {
            peds = {};
            peds.m = this.$.mpeds.getCount();
            peds.f = this.$.mpeds.getCount();
            data.peds = peds;
        }
        return data;
    }
});
