enyo.kind({
	name: "CSenseNewCampaign",
	kind: onyx.Drawer,
	layoutKind: enyo.FittableColumnsLayout,
	style: "z-index: 15; position: relative;",
	orient: "h",
	open: false,
	events: {
	},
	handlers: {
	    onNewTapped: "toggleDrawer",
		onShowTapped: "closeDrawer"
	},
	components: [
		//{name: "newDrawer", kind: onyx.Drawer, layoutKind: enyo.FittableColumnsLayout, style: "z-index: 15; position: relative; background-color: lightblue;", orient: "h", open: false, components: [
			{kind: enyo.FittableRows, fit: true, style: "height: 100%; width: 450px;", components: [
				{name: "campaignTitle", kind: onyx.Input, style: "width: 100%;", defaultFocus: true, placeholder: "Campaign Title"},
				{name: "campaignDesc", kind: onyx.TextArea, style: "width: 100%;", placeholder: "Campaign Description - Please Describe your Campaign goals..."},
				{name: "nodeContainer", kind: enyo.Scroller, horizontal: "hidden", vertical: "scroll", layoutKind: enyo.FittableRowsLayout, fit: true, components: [
					{name: "realContainer", kind: enyo.FittableRows, fit: true, style: "background-color: orange;"},
					{name: "taskButton", kind: onyx.Button, content: "Add New Task", style: "width: 100%;", ontap: "createTask"},
				]},
				{kind: onyx.Button, content: "Save Campaign", classes: "onyx-affirmative", style: "bottom: 0px; width: 100%;"}
			]}
		//]},
	],
	closeDrawer: function(inSender, inEvent) {
		//this.log("closeDrawer Called!")
		var truthy = this.getOpen();
		if(truthy){
			this.setOpen(!truthy);
		}
	},
	create: function(inSender, inEvent) {
			this.inherited(arguments);
	},
	createTask: function(inSender, inEvent) {
			enyo.forEach(this.$.realContainer.getComponents(), function (inSender, inEvent) {
			this.log(inSender);
			if(inSender.kind.toString() === "TaskBuilder" && inSender.$.tasks.getExpanded()){
			    	inSender.$.tasks.toggleExpanded();
			}
		});
		var len = this.$.realContainer.getComponents().length + 1;
	    	this.$.realContainer.createComponent({kind: "TaskBuilder", index: len, classes: "bordering"});
		this.$.realContainer.render();
		this.$.nodeContainer.resized();
		//this.$.mapDrawer.resized();
	},
	toggleDrawer: function(inSender, inEvent) {
	    this.log("toggle Drawer called!");
	    var truthy = this.getOpen();
		this.setOpen(!truthy);
	},
});
