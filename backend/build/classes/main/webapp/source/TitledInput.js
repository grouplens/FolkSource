enyo.kind({
	name: "TitledInput",
	kind: enyo.FittableRows,
	published: {
		big: false,
		title: "Title Goes Here",
		text: "",
		placeholder: "This is a placeholder",
		instructions: "",
		save: false
	},
	components: [
		{name: "title", kind: "Title", classes: "nice-padding"},
		//{kind: onyx.InputDecorator, alwaysLooksFocused: true, classes: "hanging-child ", components: [
			{name: "input", kind: enyo.Input, oninput: "reset", classes: "hanging-child", style: "font-size: 11pt;"}
		//]}
	],
	create: function(inSender, inEvent) {
		this.inherited(arguments);
		this.$.title.setTitle(this.title);
		this.$.title.setBig(this.big);
		this.$.input.setPlaceholder(this.placeholder);
		if(this.instructions.length > 0) {
			this.$.title.setInstructions(this.instructions);
		}
	},
	bigChanged: function(inSender, inEvent) {
		this.$.title.setBig(this.big);
	},
	getData: function(inSender, inEvent) {
		return this.$.input.getValue();
	},	
	instructionsChanged: function(inSender, inEvent) {
		if(this.instructions.length > 0)
			this.$.title.setInstructions(this.instructions);
	},
	placeholderChanged: function(inSender, inEvent) {
		this.$.input.setPlaceholder(this.placeholder);
	},
	reset: function(inSender, inEvent) {
		this.text = this.$.input.getValue();
	},
	saveChanged: function(inSender, inEvent) {
		this.$.title.setSave(this.save);
	},
	titleChanged: function(inSender, inEvent) {
		this.$.title.setTitle(this.title);
	},
	textChanged: function(inSender, inEvent) {
		this.$.input.setValue(this.text);
	}
});
