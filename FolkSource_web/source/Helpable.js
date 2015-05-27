enyo.kind({
	name: "Helpable",
	kind: "onyx.MenuDecorator",
	//layoutKind: "enyo.FittableColumnsLayout",
	published: {
		wrappedComponents: [],
		helpText: "Your Help Text Goes Here",
	},
	events: {
	},
	handlers: {
		onmouseover: "showPopup",
		onmouseout: "hidePopup",
	},
	components: [
		//{name: "holder", kind: "enyo.Control"},
		{name: "popup", kind: "onyx.ContextualPopup", classes: "light-background", title: "Help",	components: [
			{name: "text", content: ""}
		]},

	],
	create: function(inSender, inEvent) {
		this.inherited(arguments);
		//this.build();
	},
	rendered: function(inSender, inEvent) {
		this.inherited(arguments);
	},
	build: function(inSender, inEvent) {
		this.$.holder.createComponents(this.wrappedComponents);
		this.$.text.setContent(this.helpText);
		this.resized();
	},
	showPopup: function(inSender, inEvent) {
		this.$.popup.show();
	},
	hidePopup: function(inSender, inEvent) {
		this.$.popup.hide();
	},
});
