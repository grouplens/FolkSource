enyo.kind({
	name: "TitledInput",
	kind: enyo.FittableRows,
	published: {
		big: false,
		title: "Title Goes Here",
		placeholder: "This is a placeholder"
	},
	components: [
		{name: "title", kind: "Title"},
		{name: "input", kind: enyo.Input, classes: "hanging-child"}
	],
	create: function(inSender, inEvent) {
		this.inherited(arguments);
		this.$.title.setTitle(this.title);
		this.$.title.setBig(this.big);
		this.$.input.setPlaceholder(this.placeholder);
	},
	bigChanged: function(inSender, inEvent) {
		this.$.title.setBig(this.big);
	},
	placeholderChanged: function(inSender, inEvent) {
		this.$.input.setPlaceholder(this.placeholder);
	},
	titleChanged: function(inSender, inEvent) {
		this.$.title.setTitle(this.title);
	},
});
