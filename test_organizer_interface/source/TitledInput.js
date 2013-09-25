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
		{kind: onyx.InputDecorator, alwaysLooksFocused: true, classes: "hanging-child", components: [
			{name: "input", kind: onyx.Input, oninput: "reset", style: "width: 100%; font-size: 13px;"}
		]}
	],
	create: function(inSender, inEvent) {
		this.inherited(arguments);
		this.$.title.setTitle(this.title);
		this.$.title.setBig(this.big);
		this.$.input.setPlaceholder(this.placeholder);
		this.text = "";
	},
	bigChanged: function(inSender, inEvent) {
		this.$.title.setBig(this.big);
	},
	getData: function(inSender, inEvent) {
		return this.text;
	},
	placeholderChanged: function(inSender, inEvent) {
		this.$.input.setPlaceholder(this.placeholder);
	},
	reset: function(inSender, inEvent) {
		this.text = this.$.input.getValue();
	},
	titleChanged: function(inSender, inEvent) {
		this.$.title.setTitle(this.title);
	},
});
