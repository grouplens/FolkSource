enyo.kind({
	name: "Title", 
	kind: enyo.FittableRows,
	published: {
		title: "Title Goes Here",
		big: false
	},
	components: [
		{name: "titleText"}
	],
	create: function(inSender, inEvent) {
		this.inherited(arguments);
		this.$.titleText.setContent(this.title);
		this.$.titleText.addRemoveClass("text-title-small", !this.big);
		this.$.titleText.addRemoveClass("text-title-big", this.big);
	},
	bigChanged: function(inSender, inEvent) {
		this.$.titleText.addRemoveClass("text-title-small", !this.big);
		this.$.titleText.addRemoveClass("text-title-big", this.big);
	},
	titleChanged: function(inSender, inEvent) {
		this.$.titleText.setContent(this.title);
	},
});
