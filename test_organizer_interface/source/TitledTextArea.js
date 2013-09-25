enyo.kind({
	name: "TitledTextArea",
	kind: enyo.FittableRows,
	published: {
		big: false,
		title: "Title Goes Here",
		placeholder: "This is a placeholder"
	},
	components: [
		{name: "title", kind: "Title"},
		{kind: onyx.InputDecorator, alwaysLooksFocused: true, classes: "hanging-child", components: [
			{name: "input", kind: onyx.TextArea, style: "width: 100%; font-size: 13px;"}
		]}
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
