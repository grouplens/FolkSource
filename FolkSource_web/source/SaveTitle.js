enyo.kind({
	name: "SaveTitle",
	kind: "enyo.FittableRows",
	published: {
		title: "Title Goes Here",
		big: false,
		circled: false
	},
	events: {
		onTitleCollapsing: ""
	},
	handlers: {
		ontap: "sendSave"
	},
	components: [
		{name: "container", kind: "enyo.FittableColumns", classes: "click-hover", components: [
			{name: "titleText"},
			{fit: true},
			{name: "saveDrawer", kind: "onyx.Drawer", orient: "h", open: true, components: [
				{name: "saveButton", kind: "onyx.Button", content: "Save", ontap: "sendSave", classes: "button-style"}
			]}
		]}
	],
	create: function(inSender, inEvent) {
		this.inherited(arguments);
		this.$.titleText.setContent(this.title);
		this.$.titleText.addRemoveClass("number-style", this.circled);
		if(!this.circled) {
			this.$.container.addRemoveClass("text-title-small", !this.big);
			this.$.container.addRemoveClass("text-title-big", this.big);
		}
	},
	bigChanged: function(inSender, inEvent) {
		if(!this.circled) {
			this.$.container.addRemoveClass("text-title-small", !this.big);
			this.$.container.addRemoveClass("text-title-big", this.big);
		}
	},
	circledChanged: function(inSender, inEvent) {
		this.$.titleText.addRemoveClass("number-style", this.circled);
	},
	sendSave: function(inSender, inEvent) {
		this.toggleDrawer();
		this.doTitleCollapsing();

		return true;
	},
	titleChanged: function(inSender, inEvent) {
		this.$.titleText.setContent(this.title);
	},
	toggleDrawer: function(inSender, inEvent) {
		var truthy = this.$.saveDrawer.getOpen();
		this.$.saveDrawer.setOpen(!truthy);
	}
});
