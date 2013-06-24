enyo.kind({
	name: "CSenseShowCampaigns",
	kind: enyo.FittableColumns,
	events: {
		onCampPicked: "",
		onPins: ""
	},
	handlers: {
		onNewTapped: "closeDrawer",
		onShowTapped: "toggleDrawer",
		onCampPicked: "makeTasks"
	},
	components:[
		{name: "campaignDrawer", kind: onyx.Drawer, layoutKind: enyo.FittableRowsLayout, style: "z-index: 15; position: relative; background-color: orange;", orient: "h", open: false, components: [
			{name: "campList", kind: enyo.List, onSetupItem: "setupCampList", /*fit: true, */style: "min-width: 200px;", touch: true, count: 0, components: [
				{name: "campItem", kind: "onyx.Item", ontap: "campTapped", components: [
					{name: "campIndex", content: "id"},
					{name: "campTitle", content: "title"}
				]}
			]},
		]},
		{name: "taskDrawer", kind: onyx.Drawer, layoutKind: enyo.FittableRowsLayout, style: "z-index: 15; position: relative; background-color: pink;", orient: "h", open: false, components: [
			{name: "taskList", kind: enyo.List, onSetupItem: "setupTaskList", style: "min-width: 200px;", touch: true, count: 0, components: [
				{name: "taskItem", kind: "onyx.Item", ontap: "taskTapped", components: [
					{name: "taskIndex", content: "id"},
					{name: "taskTitle", content: "title"}
				]}
			]},
		]},
	],
	campTapped: function(inSender, inEvent) {
		var index = inEvent.index;
		var tmp = this.campData[index];
		this.makeTasks({campIndex: index, taskData: tmp.tasks, location: tmp.location});
	},
	closeDrawer: function(inSender, inEvent) {
		this.$.campaignDrawer.setOpen(false);
		this.$.taskDrawer.setOpen(false);
	},
	create: function(inSender, inEvent) {
	    this.inherited(arguments);

		//get CampaignData
		this.campData = [];
		var ajax = new enyo.Ajax({url: Data.getURL() + "campaign.json", method: "GET", handleAs: "json"});
		ajax.response(this, "handleResponse");
		ajax.go();
	},
	handleResponse: function(inSender, inEvent) {
		this.log("test");
		this.campData = inEvent.campaigns;
		this.log(this.campData);
		this.$.campList.setCount(this.campData.length);
		this.$.campList.reset();
		//this.$.container.resized();
	},
	makeTasks: function(input) {
		this.taskData = input.taskData;
		this.$.taskList.setCount(this.taskData.length);
		if(this.taskData.length == 1) {
			this.$.taskList.select(0);
		}
		this.$.taskList.reset();
		this.$.taskDrawer.setOpen(true);
		return true;
	},
	toggleDrawer: function(inSender, inEvent) {
		var truthy = this.$.campaignDrawer.getOpen();
		var taskTruthy = this.$.taskDrawer.getOpen();

		if(truthy && taskTruthy)
		    	this.$.taskDrawer.setOpen(false);

		this.$.campaignDrawer.setOpen(!truthy);

		this.$.campList.reset();
		this.$.taskList.reset();
	},
	setupCampList: function(inSender, inEvent) {
		var index = inEvent.index
		var camp = this.campData[index];
		this.$.campIndex.setContent(Number(index+1));
		this.$.campTitle.setContent(camp.title);
		this.$.campItem.addRemoveClass("list-selection", inSender.isSelected(index));
		return true;
	},
	setupTaskList: function(inSender, inEvent) {
    	var index = inEvent.index
    	var task = this.taskData[index];
    	this.$.taskIndex.setContent(task.id);
    	this.$.taskTitle.setContent(task.instructions);
    	this.$.taskItem.addRemoveClass("list-selection", inSender.isSelected(index));
    	return true;
	},
});

