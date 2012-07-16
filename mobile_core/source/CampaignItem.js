enyo.kind({
    name: "CampaignItem",
    watching: false,
    index: '',
    classes: "campItem",
    published: {
        title: "",
        description: ""
    },
    components: [
        {name: "button", kind: "onyx.Button", content: "Watch", ontap: "buttonToggled"},
        {name: "title", content:"title", fit: true, classes: "campTitle"},
        //{name: "Loc", content:"loc", classes: "itemLoc"},
        {name: "description", tag: "p", content: "desc", fit: true, classes: "campDesc", style: "white-space: normal; word-wrap: break-word;"}
    ],
    events: {
        onStartWatching: "",
        onStopWatching: ""
    },
    create: function(inSender, inEvent)
    {
        this.inherited(arguments);
        this.$.title.setContent(this.title);
        this.$.description.setContent(this.description);
    },
    buttonToggled: function(inSender, inEvent) {
        var index = inEvent.index;
        this.watching = !this.watching;
        this.$.button.addRemoveClass("active", this.watching);
        if(this.watching) {
            this.$.button.applyStyle("background-color", "green");
            this.$.button.applyStyle("color", "white");
            this.doStartWatching();
        } else {
            this.$.button.applyStyle("background-color", null);
            this.$.button.applyStyle("color", null);
            this.doStopWatching();
        }
    },
    setIndex: function(index) {
        this.log("setting index " + index);
        this.index = index;
    }
});
