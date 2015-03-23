enyo.kind({
	name: "CSenseShowCampaigns",
	kind: enyo.FittableRows,
	events: {
		onSelectCampaign: "",
		onSelectTask: "",
		onClearTaskSelection: "",

		onDrawerToggled: "",
		onTaskDrawerOpened: "",
		onTaskDetailDrawerOpened: "",

		onAPIResponse: "",
		onResizeMap: "",
		onClearMarkerHilight: ""
	},
	handlers: {
		onNewTapped: "closeDrawers",
		onShowTapped: "toggleDrawer",
		onStep: "drawerAnimationEndHandler",
		onListResized: "setListHeights",
		onCSenseTaskDetailResized: "setTaskDetailContentHeight",
		onTaskMarkerClicked: "showTaskDetail",
		onViewportChanged: "updateTaskDetail",
		onClusterSelection: "updateTaskDetail",
		onReceiveNewSubmissions: "integrateNewSubmissions",
		onCleanupSelected: "removeSelectionList",
		//onHilightSubmission: "setSubDetails",
	},
	components:[
		//TODO: finish making the user thing work
		/*{kind: enyo.FittableColumns, classes: "dark-background", components: [
			{name: "choices", kind: onyx.Drawer, orient: "v", open: false, classes: "dark-background", components: [
				{name: "choiceSettingsButton", kind: onyx.Button, classes: "button-style light-background", style: "height: 100%;", ontap: "toggleChoiceDrawer", components: [
					{tag: "i", classes: "icon-cog"}
				]},
			]},
			{kind: onyx.Drawer, name: "choiceDrawer", open: false, fit: true, classes: "dark-background", orient: "v", components: [
				{content: "What kinds of details would you like to see?", style: "font-size: 11pt; font-weight: 100; text-align: center;", classes: "dark-background"},
				{name: "switcher", style: "width: 100%; text-align: center;", kind: onyx.RadioGroup, classes: "button-style", components: [
					{content: "Submissions", active: true, classes: "light-backround"},
					{content: "Users", classes: "light-background"}
				]},
			]},
		]},*/
		{kind: enyo.FittableRows, fit: true, components: [
			{kind: enyo.FittableColumns, fit: true, components: [
				{name: "campaignDrawer", kind: onyx.Drawer, layoutKind: enyo.FittableRowsLayout, style: "z-index: 15; position: relative;", orient: "h", open: false, classes: "dark-background", components: [
					{name: "campDrawerHeader", content: "Campaigns:"},
					{name: "campList", kind: "CSenseShowCampaignsList", onSetupItem: "setupCampList", /*fit: true, */style: "width: 150px; padding: 4px; ", touch: true, count: 0, components: [
						{name: "campItem", kind: "onyx.Item", ontap: "campTapped", classes: "bordering standard-card", components: [
							//{name: "campIndex", content: "id"},
							{name: "campTitle", content: "title"}
						]}
					]},
				]},
				{name: "taskDrawer", kind: onyx.Drawer, style: "z-index: 15; position: relative;", orient: "h", open: false, classes: "dark-background", components: [
					{name: "taskDrawerHeader", content: "Tasks:"},
					{name: "taskList", kind: "CSenseShowCampaignsList", onSetupItem: "setupTaskList", style: "width: 150px; padding: 4px;", touch: true, count: 0, components: [
						{name: "taskItem", kind: "onyx.Item", ontap: "taskTapped", classes: "bordering standard-card", components: [
							//{name: "taskIndex", content: "id"},
							{name: "taskTitle", content: "title"}
						]}
					], taskIdToIndex: {}, /*Mapping of task id to index in the taskList*/ },

				]},
				{name: "taskDetailDrawer", kind: onyx.Drawer, style: "z-index: 15; position: relative;", orient: "h", open: false, classes: "dark-background", published: { currentTaskId: null, }, components: [
					{name: "taskDetailDrawerContent", kind: "CSenseTaskDetail", fit: true, style: "width: 200px;padding: 4px;"},
				]},
			]},
			{kind: "DetailsDrawer"},
			/*{name: "detailDrawer", kind: onyx.Drawer, orient: "v", open: false, classes: "light-background", style: "max-width: 524px;", components: [
				{kind: enyo.FittableColumns, classes: "active-card", components: [
					{name: "heading", content: "Submission details", fit: true,},
					{tag: "i", classes: "icon-remove icon-2x hilight-icons-negative", ontap: "closeDetailDrawer"},
				]},
				{kind: onyx.RadioGroup, onActivate: "switchDetails", style: "margin-left: auto; margin-right: auto", components: [
					{content: "Answers"},
					{content: "User"},
				]},
				{name: "detailsPanels", kind: enyo.Panels, arrangerKind: enyo.CarouselArranger, copmonents: [
					{name: "answersPane", kind: enyo.FittableRows, components: [
						{name: "loc", content: "Location:"},
						{name: "answers"},
					]},
					{name: "userPane", kind: enyo.FittableRows, components: [
						{name: "user"},
						{name: "points"},
						{name: "email"},
					]},
				]}
			]}*/
	]}
	],

	create: function(inSender, inEvent) {
		this.inherited(arguments);

		//get CampaignData
		this.campData = [];

		this.selectedCampIndex = null;
	},
	rendered: function(inSender, inEvent) {
		this.inherited(arguments);
	},

  fetchCampaigns: function() {
    var token = LocalStorage.get("authtoken");
		var ajax = new enyo.Ajax({url: Data.getURL() + "campaign.json", method: "GET", handleAs: "json", cacheBust: false, headers: {AuthToken: token}});
		ajax.response(this, "handleResponse");
		ajax.go();
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
		this.$.campList.render();
		this.showTasks(this.campData[index].tasks);
		this.doSelectCampaign({"campaign": this.campData[index], offset: 150});
	},

	/*
		Called when a task in the task pane is tapped. This opens the taskDetail pane and shows submissions on the map.
	*/
	taskTapped: function(inSender, inEvent) {
		var index = inEvent.index;
		this.showTaskDetail(null, {task: this.taskData[index]/*, offset: 200*/}); //I am calling an event handler directly, is this bad?
	},

	switchDetails: function(inSender, inEvent) {
		var string = inEvent.originator.getContent();
		/*if(string === "Answers")
			this.$.detailsPanels.setIndex(0);
		else if(string === "User")
			this.$.detailsPanels.setIndex(1);*/
	},
	/*setSubDetails: function(inSender, inEvent) {
		var data = inEvent.sub;
		this.log(data);
		this.$.answers.destroyComponents();
		for(var x in data.answers) {
			this.log(data.answers[x]);
			this.$.answers.createComponent({name: "q"+x, content: data.answers[x].question.question, style: "font-weight: bold;", classes: "hanging-child"}, {owner: this});
			switch(data.answers[x].answer_type) {
				case "text":
					this.$.answers.createComponent({name: "ans"+x, content: data.answers[x].answer, classes: "hanging-child"}, {owner: this});
				break;
				case "multiple_choice":
				case "exclusive_multiple_choice":
					this.$.answers.createComponent({name: "ans"+x, content: data.answers[x].choices, classes: "hanging-child"}, {owner: this});
				break;
				case "complex_counter":
					this.$.answers.createComponent({name: "ans"+x, content: data.answers[x].counts, classes: "hanging-child"}, {owner: this});
				break;
			}
		}
		this.$.answers.render();
		this.getGeocode(data);
		this.resized();
		this.$.detailDrawer.setOpen(true);
		return true;
	},
	closeDetailDrawer: function(inSender, inEvent) {
		this.$.detailDrawer.setOpen(false);
		this.doClearMarkerHilight();
		return true;
	},	
	getGeocode: function(sub) {
		var loc = sub.gps_location.split("|");
		var ajax = new enyo.Ajax({handleAs: "json", url: "FIND NEW URL FOR GEOCODING" + loc[0] + "+" + loc[1]});
		ajax.response(this, "reverseGeocode");
		ajax.go();
	},	
    reverseGeocode: function(inSender, inEvent){
		this.log(inSender);
		this.log(inEvent);
        //Insert reverse geocoding functionality here!
		this.$.loc.setContent("Location: " + inEvent[0].display_name);
        return "123 Fake St SE, Minneapolis, MN";
    },*/
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
		this.$.taskDetailDrawerContent.startSpinner();
		this.$.taskDetailDrawer.setOpen(true);
		this.$.taskList.select(this.getTaskListIndex(task.id));
		this.$.taskDetailDrawerContent.stopSpinner();

		//this.$.taskDetailDrawerContent.setTask(task);
		//this.$.taskDetailDrawerContent.setCont(task.submissions,"Task "+task.id,task.instructions);
		//this.$.taskDetailDrawer.currentTaskId = task.id;
		//this.$.choices.resized();
		//this.$.choices.setOpen(true);

	},

	/*
		Given a task id, returns that tasks index in the task list.
	*/
	getTaskListIndex: function(taskId){
		return this.$.taskList.taskIdToIndex[taskId];
	},

	/*
	 * Reset the selection state from the lists.
	 */
	removeSelectionList: function(inSender, inEvent) {
		this.$.campList.reset();
		this.$.taskList.reset();
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

		return true;
		//this.$.campList.reset();
	},
	toggleChoiceDrawer: function(inSender, inEvent) {
		var truth = this.$.choiceDrawer.getOpen();
		this.$.choiceDrawer.setOpen(!truth);
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
		var index = inEvent.index;
		var camp = this.campData[index];
		//this.$.campIndex.setContent(Number(index+1));
		this.$.campTitle.setContent(camp.title);
		this.$.campItem.addRemoveClass("active-card", inSender.isSelected(index));
		return true;
	},

	/*
		taskList setup function
	*/
	setupTaskList: function(inSender, inEvent) {
		var index = inEvent.index;
		var task = this.taskData[index];

		this.$.taskList.taskIdToIndex[task.id] = index;

		//this.$.taskIndex.setContent(task.id);
		this.$.taskTitle.setContent(task.instructions);
		this.$.taskItem.addRemoveClass("active-card", inSender.isSelected(index));
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
		//Pan
		/*if (drawer.name === "campaignDrawer" && drawer.open === true){
			//var campId = this.campData[this.selectedCampIndex].id;
			this.doTaskDrawerOpened({campId: campId, offset: 0});
		}
		if (drawer.name === "taskDrawer" && drawer.open === true){
			var campId = this.campData[this.selectedCampIndex].id;
			this.doTaskDrawerOpened({campId: campId, offset: 150});
		}*/
		if (drawer.name === "taskDetailDrawer" && drawer.open === true){
			/*var taskId = inEvent.originator.owner.currentTaskId;
			this.doTaskDetailDrawerOpened({taskId: taskId, offset: 0});*/
			this.doSelectTask({task: task, taskDetail: this.$.taskDetailDrawerContent/*, offset: inEvent.offset*/});
			this.$.taskDetailDrawerContent.startSpinner();
			this.$.taskDetailDrawerContent.setCont(task.submissions,"Task "+task.id,task.instructions);
			this.$.taskDetailDrawer.currentTaskId = task.id;
			//this.$.taskDetailDrawerContent.stopSpinner();
		}
		if(drawer.name !== "detailsPanels")
			this.doResizeMap();
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
