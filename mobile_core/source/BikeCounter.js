enyo.kind({
    name: "BikeCounter",
    kind: "enyo.Control",
    published: {
        type: "bikes",
    },
    components: [
        {kind: "enyo.Signals", onButtonGroupChosen: "fixIt"},
        {name: "bikes", style: "clear: both; display: inline;", components: [
            {name: "mbikes", kind: "Counter", title: "M - Bikes", style: "width:  50%; float: left;"},
            {name: "fbikes", kind: "Counter", title: "F - Bikes", style: "width:  50%; float: left;"}
        ]},
        {tag: "hr"},
        {name: "peds", style: "clear: both;", components: [
            {name: "mpeds", kind: "Counter", title: "M - Peds", style: "width:  50%; float: left;"},
            {name: "fpeds", kind: "Counter", title: "F - Peds", style: "width:  50%; float: left;"}
        ]}
    ],
    events: {
    },
    create: function(inSender, inEvent)
    {
        this.inherited(arguments);
        bikesGone = false;
        pedsGone = false;
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
        var string;
        if(!bikesGone) {
            string += "m" + this.$.mbikes.getCount();
            string += "f" + this.$.mpeds.getCount();
        } 
        string += "|";
        if (!pedsGone) {
            string += "m" + this.$.mpeds.getCount();
            string += "f" + this.$.mpeds.getCount();
        }
        return string;
    }
});
