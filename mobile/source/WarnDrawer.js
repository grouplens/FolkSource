enyo.kind({
	name: "WarnDrawer",
	kind: onyx.Drawer,
	orient: "v",
	open: false,
	classes: "button-style-negative",
	published: {
		warning: ""
	},
	components: [
		{kind: enyo.Signals, onNoLocationFound: "noLocFound", onLocationFound: "closeDrawer"},
		{kind: enyo.ToolDecorator, components: [
			//{content: "Warning: "},
			{name: "message", content:"filler"}
		]}
	],
	create: function(inSender, inEvent) {
		this.inherited(arguments);
		this.$.message.setContent(this.warning);
		this.keepClosed = false;
	},
	rendered: function(inSender, inEvent) {
		this.inherited(arguments);
	},
	openDrawer: function(inSender, inEvent) {
		this.setOpen(true);
	},
	closeDrawer: function(inSender, inEvent) {
		this.setOpen(false);
	},
	warningChanged: function(inSender, inEvent) {
		this.$.message.setContent(this.warning);
		this.render();
	},
	locFound: function(inSender, inEvent) {
		this.keepClosed = true;
		this.closeDrawer();
	},	
	noLocFound: function(inSender, inEvent) {
		this.setWarning("Searching for GPS lock...");
		if(this.keepClosed)
			this.openDrawer();
	},
});
