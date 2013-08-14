enyo.kind({
	name: "SaveTitle", 
	kind: enyo.FittableRows,
	published: {
		title: "Title Goes Here",
		big: false
	},
	events: {
		onTitleCollapsing: ""
	},
	handlers: {
		ontap: "sendSave"
	},
	components: [
		{name: "container", kind: enyo.FittableColumns, components: [
			{name: "titleText", style: "padding: 7px 0px; border: 0px;"},
			//{name: "titleText", kind: "Title"},
			{fit: true},
			{name: "saveDrawer", kind: onyx.Drawer, orient: "h", open: true, components: [
				{name: "saveButton", kind: onyx.Button, content: "Save", ontap: "sendSave", classes: "onyx-affirmative"}
			]}
		]}
	],
	create: function(inSender, inEvent) {
		this.inherited(arguments);
		this.$.titleText.setContent(this.title);
		this.$.container.addRemoveClass("text-title-small", !this.big);
		this.$.container.addRemoveClass("text-title-big", this.big);
	},
	bigChanged: function(inSender, inEvent) {
		this.$.container.addRemoveClass("text-title-small", !this.big);
		this.$.container.addRemoveClass("text-title-big", this.big);
	},
	sendSave: function(inSender, inEvent) {
		this.toggleDrawer();
		this.doTitleCollapsing();
	},
	titleChanged: function(inSender, inEvent) {
		this.$.titleText.setContent(this.title);
	},
	toggleDrawer: function(inSender, inEvent) {
		var truthy = this.$.saveDrawer.getOpen();
		this.$.saveDrawer.setOpen(!truthy);
	}
});
