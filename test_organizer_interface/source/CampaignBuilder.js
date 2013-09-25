enyo.kind({
	name: "CampaignBuilder",
	kind: onyx.Drawer, 
	open: false,
	orient: "h",
	style: "height: 100%; width: 100%;",
	layoutKind: enyo.FittableColumnsLayout,
	events: {
		onDrawerToggled: "",
		onResizeMap: ""
	},
	handlers: {
	    onNewTapped: "toggleDrawer",
		onShowTapped: "closeDrawer",
		onShowQuestion: "openQuestionDrawer"
	},
	components: [
		{kind: enyo.FittableRows, fit: true, style: "height: 100%;", components: [
			{classes: "bordering-top", components: [
				{name: "campaignTitle", kind: "SaveTitledInput", big: true, title: "Campaign Title", placeholder: "Campaign Title"},
				{name: "campaignDesc", kind: "TitledTextArea", big: true, title: "Campaign Description", placeholder: "Please Describe your Campaign goals..."},
			]},
			{name: "nodeContainer", kind: enyo.Scroller, horizontal: "hidden", vertical: "scroll", layoutKind: enyo.FittableRowsLayout, fit: true, style: "width: 300px;", components: [
				{name: "realContainer", kind: enyo.FittableRows, fit: true},
				{classes: "bordering-bottom", components: [
					{name: "taskButton", kind: enyo.Button, content: "Add New Task", style: "width: 99%;", classes: "button-style", ontap: "createTask"}
				]}
			]},
		]}
	],
	closeDrawer: function(inSender, inEvent) {
		var truthy = this.getOpen();
		if(truthy){
			this.setOpen(!truthy);
		}
	},
	create: function(inSender, inEvent) {
		this.inherited(arguments);
		this.createTask();
	},
	rendered: function(inSender, inEvent) {
		this.inherited(arguments);
	},
	createTask: function(inSender, inEvent) {
	   	this.waterfallDown("onNewTask");
		var len = this.$.realContainer.getComponents().length + 1;
		this.$.realContainer.createComponent({kind: "TaskBuilder", index: len, classes: "bordering active-card"});
		this.$.nodeContainer.resized();
		this.$.realContainer.render();
		this.scrollDown();

		enyo.Signals.send("onNewTask");
	},
	openQuestionDrawer: function(inSender, inEvent) {
		this.log();
		this.$.questionDrawer.setOpen(true);
	},	
	scrollDown: function(inSender, inEvent) {
		this.log(this.$.taskButton);
		this.$.nodeContainer.scrollToBottom();
	},
	toggleDrawer: function(inSender, inEvent) {
		this.log();
		var truthy = this.getOpen();
		this.setOpen(!truthy);
		var size = truthy ? -150 : 150;
		this.doResizeMap({offset: size});
	},
	drawerAnimationEndHandler: function(inSender, inEvent) {
		this.log();
	}
});
