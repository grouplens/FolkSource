enyo.kind({
    name: "CampaignItem",
    watching: !1,
    index: "",
    classes: "campItem light-background",
	style: "padding: 5px;",
    published: {
        title: "",
        description: ""
    },
    components: [
		//{name: "button", kind: onyx.Button, content: "Watch", classes: "button-style", ontap: "buttonToggled"},
		{name: "title", content: "title", style: "font-weight: 400;", classes: "campTitle"},
		{name: "description", tag: "p", content: "desc", classes: "campDesc", /*style: "white-space: normal; word-wrap: break-word;"*/}
	],
    events: {
        onStartWatching: "",
        onStopWatching: ""
    },
    create: function (a, b) {
        this.inherited(arguments);
		this.$.title.setContent(this.title);
		this.$.description.setContent(this.description);
		this.render();
    },
    buttonToggled: function (a, b) {
        var c = b.index;
        this.watching = !this.watching; this.$.button.addRemoveClass("active", this.watching);
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
    setIndex: function (a) {
        this.log("setting index " + a);
		this.index = a;
    }
});
