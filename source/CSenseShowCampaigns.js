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

		onAPIResponse: "",
	},
	handlers: {
		onNewTapped: "closeDrawers",
		onShowTapped: "toggleDrawer",
		onEnd: "drawerAnimationEndHandler",
		onListResized: "setListHeights",
		onCSenseTaskDetailResized: "setTaskDetailContentHeight",
		onTaskMarkerClicked: "showTaskDetail",
		onViewportChanged: "updateTaskDetail",
		onClusterSelection: "updateTaskDetail",
		onReceiveNewSubmissions: "integrateNewSubmissions",
	},
	components:[
		{name: "campaignDrawer",
			kind: onyx.Drawer,
			layoutKind: enyo.FittableRowsLayout,
			style: "z-index: 15; position: relative; background-color: orange;",
			orient: "h",
			open: false,
			components: [
				{name: "campDrawerHeader", content: "Campaigns:"},
				{name: "campList", kind: "CSenseShowCampaignsList", onSetupItem: "setupCampList", /*fit: true, */style: "width: 200px;", touch: true, count: 0, components: [
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
				{name: "taskDrawerHeader", content: "Tasks:"},
				{name: "taskList", kind: "CSenseShowCampaignsList", onSetupItem: "setupTaskList", style: "width: 200px;", touch: true, count: 0, components: [
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
			style: "z-index: 15; position: relative; background-color: LightGoldenRodYellow ;",
			orient: "h",
			open: false,
			published: {
				currentTaskId: null,
			},
			components: [
				{name: "taskDetailDrawerContent", kind: "CSenseTaskDetail", style: "width: 200px"},
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

	integrateNewSubmissions: function(inSender, inEvent){
		//If the campaign and task associated with the new submission(s) does not exist,
		//nothing will happen.

		//There is likely a better way to find the proper campaign than to linearly search for it. However, the number
		//of campaigns probably will not be terribly great, so this method may be sufficient.
		
		for (var i=0; i< inEvent.submissions.length; i++){
			var sub = inEvent.submissions[i];
			var j=0;
			var notDone = true;
			while(j<this.campData.length && notDone){ 
				var camp = this.campData[j];
				var k=0;
				while(k<camp.tasks.length && notDone){
					if (camp.tasks[k].id === sub.task_id){
						notDone = false;
						this.campData[j].tasks[k].submissions.push(sub);
					}
					k++;
				}
				j++;
			}
		}
	},


	updateTaskDetail: function(inSender, inEvent){
		if(this.$.taskDetailDrawer.getOpen()){ //Is this a bad way of checking if we are showing anything in the detail pane?
			this.$.taskDetailDrawerContent.setCont(inEvent.submissions);
		}
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
		this.doAPIResponse({time: inSender.startTime}); //It is unclear if startTime is the timestamp from the server or not.
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
		this.showTaskDetail(null, {task: this.taskData[index]}); //I am calling an event handler directly, is this bad?
	},

	/*
		Builds the contents of the tasks pane
	*/
	showTasks: function(taskData) {
		this.doClearTaskSelection();

		this.taskData = taskData;
		this.$.taskList.taskIdToIndex = {};
		this.$.taskList.setCount(this.taskData.length);
		this.$.taskDrawer.setOpen(true);
		this.$.taskList.reset();
		this.$.taskDetailDrawer.setOpen(false);

		return true;
	},

	/*
		Builds the contents of the taskDetail pane (Called when a task is tapped)
	*/
	showTaskDetail: function(inSedner, inEvent){
		var task = inEvent.task;
		this.$.taskList.select(this.getTaskListIndex(task.id));

		//this.$.taskDetailDrawerContent.setTask(task);
		this.$.taskDetailDrawerContent.setCont(task.submissions);
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
		Set the height of the campaign and task lists
	*/
	setListHeights: function(inSender, inEvent){
		this.$.taskList.addStyles("height:" + this.$.taskDrawer.getBounds().height + "px;");
		this.$.campList.addStyles("height:" + this.$.campaignDrawer.getBounds().height + "px;");
	},

	/*
		Set the height of the taskDetailDrawerContent
	*/
	setTaskDetailContentHeight: function(inSender, inEvent){
		this.$.taskDetailDrawerContent.addStyles("height:" + (this.$.taskDetailDrawer.getBounds().height) + "px;");
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

enyo.kind({
	name: "CSenseShowCampaignsList",
	kind: enyo.List,
	events: {
		onListResized: "",
	},
	resizeHandler: function(){
		this.inherited(arguments);
		this.doListResized();
	},
});
