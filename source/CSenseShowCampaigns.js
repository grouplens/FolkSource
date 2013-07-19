enyo.kind({
	name: "CSenseShowCampaigns",
	kind: enyo.FittableColumns,
	events: {
		onSelectCampaign: "",
		onSelectTask: "",
		onClearTaskSelection: "",

		onDrawerToggled: "",
		onTaskDrawerOpened: "",
		onTaskDetailDrawerOpened: "",
	},
	handlers: {
		onNewTapped: "closeDrawers",
		onShowTapped: "toggleDrawer",
		onEnd: "drawerAnimationEndHandler",
		onTaskMarkerClicked: "showTaskDetail",
	},
	components:[
		{name: "campaignDrawer",
			kind: onyx.Drawer,
			layoutKind: enyo.FittableRowsLayout,
			style: "z-index: 15; position: relative; background-color: orange;",
			orient: "h",
			open: false,
			components: [
				{name: "campList", kind: enyo.List, onSetupItem: "setupCampList", /*fit: true, */style: "min-width: 200px;", touch: true, count: 0, components: [
					{name: "campItem", kind: "onyx.Item", ontap: "campTapped", components: [
						{name: "campIndex", content: "id"},
						{name: "campTitle", content: "title"}
					]}
				]},
			],
		},
		{name: "taskDrawer",
			kind: onyx.Drawer,
			style: "z-index: 15; position: relative; background-color: pink;",
			orient: "h",
			open: false,
			components: [
				{name: "taskList", kind: enyo.List, onSetupItem: "setupTaskList", style: "min-width: 200px;", touch: true, count: 0, components: [
					{name: "taskItem", kind: "onyx.Item", ontap: "taskTapped", components: [
							{name: "taskIndex", content: "id"},
							{name: "taskTitle", content: "title"}
						]}
					],
					taskIdToIndex: {}, //Mapping of task id to index in the taskList
				},

			],
		},
		{name: "taskDetailDrawer",
			kind: onyx.Drawer,
			style: "z-index: 15; position: relative; background-color: bisque;",
			orient: "h",
			open: false,
			published: {
				currentTaskId: null,
			},
			components: [
				{name: "taskDetailDrawerContent", kind: "CSenseTaskPopup", style: "width: 200px"},
			],
		},
	],

	create: function(inSender, inEvent) {
	    this.inherited(arguments);	    

		//get CampaignData
		this.campData = [];
		var ajax = new enyo.Ajax({url: Data.getURL() + "campaign.json", method: "GET", handleAs: "json"});
		ajax.response(this, "handleResponse");
		ajax.go();

		this.selectedCampIndex = null;
	},

	/*
		Called when the ajax response arrives. Initializes the campaign pane contents.
	*/
	handleResponse: function(inSender, inEvent) {
		this.campData = inEvent.campaigns;

		/*For testing purposes*/
		/*
		var aTask = this.campData[0].tasks[0]
		this.campData[0].tasks = [aTask, aTask, aTask, aTask, aTask, aTask, aTask, aTask, aTask, aTask, aTask];
		*/

		this.$.campList.setCount(this.campData.length);
		this.$.campList.reset();
	},

	/*
		Called when a campaign in the campaign pane is tapped. This opens a task pane and shows task locations of the map.
	*/
	campTapped: function(inSender, inEvent) {
		var index = inEvent.index;

		if (this.selectCampIndex !== index){ //A new campaign has been selected
			this.selectedCampIndex = index;
			//Clear submission markers from the map that may or may not be present
		}
		this.showTasks(this.campData[index].tasks);
		this.doSelectCampaign({"campaign": this.campData[index]});
	},

	/*
		Called when a task in the task pane is tapped. This opens the taskDetail pane and shows submissions on the map.
	*/
	taskTapped: function(inSender, inEvent) {
		var index = inEvent.index;
		this.showTaskDetail(null, {task: this.taskData[index]}); //Here I am calling an event handler directly, is this bad?
	},

	/*
		Builds the contents of the tasks pane
	*/
	showTasks: function(taskData) {
		this.doClearTaskSelection();
		//this.doShowSubmissionsOnMap({task: null, taskDetail: null});

		this.taskData = taskData;
		this.$.taskList.taskIdToIndex = {};
		this.$.taskList.setCount(this.taskData.length);
		this.$.taskDrawer.setOpen(true);
		this.$.taskList.reset();
		this.$.taskDetailDrawer.setOpen(false);

		return true;
	},

	/*
		Builds the contents of the taskDetail pane
	*/
	showTaskDetail: function(inSedner, inEvent){
		var task = inEvent.task;
		this.$.taskList.select(this.getTaskListIndex(task.id));

		this.$.taskDetailDrawerContent.setTask(task);
		this.$.taskDetailDrawer.currentTaskId = task.id;
		var detailDrawerOpen = this.$.taskDetailDrawer.getOpen();
		this.$.taskDetailDrawer.setOpen(true);

		this.doSelectTask({task: task, taskDetail: this.$.taskDetailDrawerContent, detailDrawerOpen: detailDrawerOpen});
	},

	/*
		Given a task id, returns that tasks index in the task list.
	*/
	getTaskListIndex: function(taskId){
		return this.$.taskList.taskIdToIndex[taskId];
	},


	/*
		Called when user clicks the grabber in the top bar. Either closes all of the drawers or opens the campaign list drawer.
	*/
	toggleDrawer: function(inSender, inEvent) {
		if (this.$.campaignDrawer.getOpen()) {
			this.closeDrawers();
		} else{
			this.$.campaignDrawer.setOpen(true);
		}
		this.$.campList.reset();
	},

	/*
		Closes the campaign, task, and taskDetail drawers.
	*/
	closeDrawers: function(inSender, inEvent) {
		this.$.campaignDrawer.setOpen(false);
		this.$.taskDrawer.setOpen(false);
		this.$.taskDetailDrawer.setOpen(false);

		this.doClearTaskSelection();
	},

	/*
		CampList setup function
	*/
	setupCampList: function(inSender, inEvent) {
		var index = inEvent.index
		var camp = this.campData[index];
		this.$.campIndex.setContent(Number(index+1));
		this.$.campTitle.setContent(camp.title);
		this.$.campItem.addRemoveClass("list-selection", inSender.isSelected(index));
		return true;
	},

	/*
		taskList setup function
	*/
	setupTaskList: function(inSender, inEvent) {
		var index = inEvent.index;
		var task = this.taskData[index];

		this.$.taskList.taskIdToIndex[task.id] = index;

		this.$.taskIndex.setContent(task.id);
		this.$.taskTitle.setContent(task.instructions);
		this.$.taskItem.addRemoveClass("list-selection", inSender.isSelected(index));
		return true;
	},

	/*
		Called on end of the drawers' animations. Tells the map it needs to adjust itself due to its new container size.
		Also should result in the map panning to the appropriate taskmarkergroup or submissiongroup if a corresponding
		drawer was opened.
	*/
	drawerAnimationEndHandler: function(inSender, inEvent) {
		var drawer = inEvent.originator.owner;
		//Fix map size
		if ((drawer.name === "campaignDrawer") || (drawer.name === "taskDrawer") || (drawer.name === "taskDetailDrawer")) {
			var offset = drawer.open ? -100 : 100;
			this.doDrawerToggled({offset: offset});
			//this.doAdjustMapSize({offset: offset});
		}
		//Pan
		if (drawer.name === "taskDrawer" && drawer.open === true){
			var campId = this.campData[this.selectedCampIndex].id;
			this.doTaskDrawerOpened({campId: campId});
		}
		if (drawer.name === "taskDetailDrawer" && drawer.open === true){
			var taskId = inEvent.originator.owner.currentTaskId;
			this.doTaskDetailDrawerOpened({taskId: taskId});
		}
	},
});

