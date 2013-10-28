enyo.kind({
	name: "TaskBuilder",
	kind: enyo.FittableRows,
	classes: "task-builder",
	handlers: {
		onCreateQuestion: "addQuestion",
		onCreateSensor: "addSensor",
		onDeactivateTaskLocationEditingUI: "deactivateLocationEditingUI",
		onNewTask: "saveData",
		onNewQuestion: "resizeQuestions",
		onLocationsIncoming: "saveLocations",
		onTitleCollapsing: "toggleTaskDrawer",
		onQuestionsIncoming: "saveQuestions",
		onDestroyedTask: "checkTitles",
		onDestroy: "remove",
	},
	published: {
		index: 1
	},
	events: {
		onAddShapefile: "",
		onDeactivateAllEditing: "",
		onCheckLocation: "",
		onGetLocations: "",
		onFinishedSavingTask: "",
		onShowAddFeaturesToolbar: "",
		onShowEditFeaturesToolbar: "",
		onDestroyedTask: ""
	},
	//classes: "active-card",
	components: [
		{kind: enyo.Signals, onQuestionsIncoming: "saveQuestions", onQuestionsRemoved: "closeDrawer"},
		{name: "titleHolder", kind: enyo.FittableColumns, style: "padding-top: 5px;", components: [
			{name: "saved", tag: "i", classes: "icon-ok-sign", showing: false},
			{name: "taskTitle", kind: "Title", title: "#", big: true, save: true, fit: true},
		]},
		{name: "taskBuilderDrawer", kind: enyo.FittableColumns, fit: true, components: [
			{kind: enyo.FittableRows, classes: "nice-padding", style: "width: 116px; border-right: 1px white solid;", components: [
				{name: "locationTitle", kind: "Title", title: "Places"},
				{name: "modificationRadioGroup", kind: onyx.RadioGroup, onActivate: "radioActivated", classes: "niceish-padding", style: "width: 100%;", components: [
					{name: "addFeaturesButton", kind: onyx.Button, classes: "button-style", components: [
						{tag: "i", classes: "icon-plus"},
					]},
					{name: "editFeaturesButton", kind: onyx.Button, classes: "button-style", components: [
						{tag: "i", classes: "icon-pencil"},
					]},
					//{name: "shapefileButton", kind: onyx.Button, classes: "button-style", content: "Shapefile"},
					]},
				{name: "finishEditingDrawer", kind: onyx.Drawer, orient: "v", open: false, components: [
					{name: "finishEditingButton", kind: onyx.Button, content: "Done", classes: "button-style-affirmative", ontap: "finishEditing"},
				]},
				{name: "locationList", kind: enyo.Scroller, layoutKind: enyo.FittableColumnsLayout, fit: true, horizontal: "hidden", vertical: "scroll", components: [
					{name: "realLocationList", kind: enyo.FittableRows, style: "width: 100%;", fit: true},
				]},
			]},
			{kind: enyo.FittableRows, fit: true, components: [
				{name: "taskInstructions", kind: "TitledInput", placeholder: "General instructions about the task", instructions: "Enter general instructions about the task below", title: "Task Instructions"}, 
				{kind: "QuestionDrawer", classes: "nice-padding", fit: true}
			]},
		]}
	],
	buildTaskObj: function() {
		this.taskData.instructions = this.$.instructions.getValue();
	},

	checkTitles: function(inSender, inEvent) {
		var inTask = inEvent.task;
		var regex = /\d+/;
		var inTaskNum = Number(inTask.match(regex)[0]);

		var task = this.$.taskTitle.getTitle();
		var taskNum = Number(task.match(regex)[0]);

		this.log(inTaskNum);
		this.log(taskNum);
		if(inTaskNum < taskNum) {
			var newRegex = /\(\d+ \w+\)/;
			var holder = this.$.taskTitle.getTitle().match(newRegex);
			this.log(holder);
			if(holder !== null)
				this.$.taskTitle.setTitle("#" + (taskNum - 1) + " " + holder[0]);
			else
				this.$.taskTitle.setTitle("#" + (taskNum - 1));
		}

	},

	finishEditing: function(inSender, inEvent) {
		//deactivate current mode
		this.doDeactivateAllEditing();
		this.deactivateLocationEditingUI();
	},

	deactivateLocationEditingUI: function(inSender, inEvent) {
		//deselect radio
		this.$.modificationRadioGroup.setActive(null);
		//hide button
		this.toggleEditingDrawer();
	},
	
	clickToAddShapeFile: function(inSender, inEvent) {
		if(inSender.hasClass("active")) {
			inSender.addRemoveClass("active", false);
		} else {
			inSender.addRemoveClass("active", true);
		}
		this.doAddShapefile({id: name, start: true});
		this.doAddShapefile({id: this.name, start: true});
	},

    create: function(inSender, inEvent) {
		this.inherited(arguments);
		this.$.taskTitle.setTitle(this.$.taskTitle.getTitle() + this.index);
		this.taskData = {};
		var tmp = {};
		tmp.points = [];
		tmp.polygons = [];
		LocalStorage.set(this.name, tmp);
		this.numSensors = 0;
		this.numQuestions = 0;
		this.toggleTaskDrawer();
		enyo.dispatcher.listen(document, "transitionend", this.removeActually);
		enyo.dispatcher.listen(document, "webkittransitionend", this.removeActually);
		enyo.dispatcher.listen(document, "otransitionend", this.removeActually);
    },
	closeDrawer: function(inSender, inEvent) {
		if (this.$.taskBuilderDrawer.getOpen()) {
			this.$.taskTitle.sendSave();
			this.doFinishedSavingTask();
		}
	},
	handleExpand: function(inSender, inEvent) {
		this.log(inSender.expanded);
		if(!inSender.expanded) {
			this.finishEditing();
		}
	},
	newLocation: function(inLocation) {
		if(inLocation.layerType === "marker") {
			this.$.realLocationList.createComponent({tag: "i", classes: "icon-map-marker icon-3x nice-padding", style: "width: 100%; display: block; text-align: center;", data: inLocation, ontap: "readLocationData"}, {owner: this});
			this.$.realLocationList.render();
		}
		if(inLocation.layerType === "polygon") {
			this.$.realLocationList.createComponent({tag: "i", classes: "icon-globe icon-3x nice-padding", style: "width: 100%; display: block; text-align: center;", data: inLocation, ontap: "readLocationData"}, {owner: this});
			this.$.realLocationList.render();
		}
	},
	radioActivated: function(inSender, inEvent){
		if (inEvent.originator.getActive()){
			//Deactivate any editing mode that may be active and remove any controls from the map
			this.doDeactivateAllEditing();
			//Open the appropriate drawer
			if (inEvent.originator.name === "addFeaturesButton" || inEvent.originator.parent.name === "addFeaturesButton"){
				this.log("active add");
				this.doShowAddFeaturesToolbar();
			} else if (inEvent.originator.name === "editFeaturesButton" || inEvent.originator.parent.name === "editFeaturesButton"){
				this.log("active edit");
				this.doShowEditFeaturesToolbar();
			}
			//Show finish button
			this.toggleEditingDrawer();
		}
	},
	readLocationData: function(inSender, inEvent) {
		this.log(inSender.data);
		this.log(this.$.realLocationList.getControls());
		enyo.forEach(this.$.realLocationList.getControls(), function(inSender, inEvent) {
			this.log(inSender);
			this.log(inEvent);
			var truth = inSender.hasClass("hilight-location");
			inSender.addRemoveClass("hilight-location", false);
			this.doCheckLocation({data: inSender.data, selected: false});
		}, this);

		var truth = inSender.hasClass("hilight-location");
		inSender.addRemoveClass("hilight-location", !truth);
		this.doCheckLocation({data: inSender.data, selected: !truth});
	},	
	remove: function(inSender, inEvent) {
		//this is sorta weird, but it's a visual cue of destruction
		this.addRemoveClass("task-builder-destroy", true);
	},
	removeActually: function(inSender, inEvent) {
		var us = inSender.originator;
		if(us.kind === "TaskBuilder") {
			us.doDestroyedTask({task: us.$.taskTitle.getTitle()});
			us.destroy();
		}
	},
	resizeQuestions: function(inSender, inEvent) {
		this.resized();
		this.render();
		/*this.$.questionDrawer.resized();
		this.$.questionDrawer.render();*/
	},
	saveData: function(inSender, inEvent) {
		//save data goes here
	},
	saveLocations: function(inSender, inEvent) {
		/*if(this.$.taskBuilderDrawer.getOpen()) {
			var tmp = inEvent.locations._layers;
			var wkt = new Wkt.Wkt();
			var store = [];
			for(var x in tmp) {
				wkt.fromObject(tmp[x]);
				store.push(wkt.write());
			}
			this.locations = store;
		}*/
	},
	saveQuestions: function(inSender, inEvent) {
		this.log(inEvent.questions);
		if(this.$.taskBuilderDrawer.getOpen()) {
			this.questions = inEvent.questions;
			this.log(this.$.taskTitle.getTitle());
			this.log(this.questions);
			enyo.Signals.send("onQuestionsSaved");
			this.$.taskTitle.setTitle(this.$.taskTitle.getTitle() + " (" + this.questions.length + " steps)");
			this.$.saved.setShowing(true);
			/*this.$.titleHolder.resized();
			this.$.titleHolder.render();*/
		}
		return true;
	},
	toggleEditingDrawer: function(inSender, inEvent) {
		var truthy = this.$.finishEditingDrawer.getOpen();
		this.log(truthy);
		this.$.finishEditingDrawer.setOpen(!truthy);
	},
	toggleTaskDrawer: function(inSender, inEvent) {
		/*var truthy = this.$.taskBuilderDrawer.getOpen();
		this.$.taskBuilderDrawer.setOpen(!truthy);
		this.addRemoveClass("active-card", !truthy);
		this.$.saved.setShowing(truthy);
		if(!truthy)
			enyo.Signals.send("onEditTask", {questions: this.questions});*/
	},
        
});
