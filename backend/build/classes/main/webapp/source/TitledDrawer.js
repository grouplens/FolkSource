enyo.kind({
	name: "TitledDrawer",
	kind: enyo.FittableRows,
	components: [
		{tag: "p", components: [
			{name: "icon", tag: "i", classes: "icon-expand", styles: "height: 100px; width: 100px;"},
			{content: "tmp", ontap: "toggleDrawer"}
		]},
		{name: "drawer", kind: onyx.Drawer, open: false, orient: "v", components: [
			{content: "test"}
		]}
	],
	create: function(inSender, inEvent) {
		this.inherited(arguments);
	},
	toggleDrawer: function(inSender, inEvent) {
		var truthy = this.$.drawer.getOpen();
		this.$.icon.addRemoveClass("icon-expand", !truthy);
		this.$.icon.addRemoveClass("icon-collapse", truthy);
		this.$.drawer.setOpen(!truthy);
	}

});
