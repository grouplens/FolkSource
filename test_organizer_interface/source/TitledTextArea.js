enyo.kind({
	name: "TitledTextArea",
	kind: enyo.FittableRows,
	published: {
		big: false,
		title: "Title Goes Here",
		placeholder: "This is a placeholder"
	},
	components: [
		{name: "title", kind: "Title", classes: "nice-padding"},
		//{kind: onyx.InputDecorator, alwaysLooksFocused: true, classes: "hanging-child", components: [
			{name: "input", kind: onyx.TextArea, classes: "hanging-child", style: "font-size: 11pt;"}
		//]}
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
