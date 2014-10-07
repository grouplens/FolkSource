enyo.kind({
	name: "TaskBuilder",
	kind: "Destroyable",
	layoutKind: enyo.FittableRowsLayout,
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
		onDestroyed: "checkTitles",
		onRemoveLocation: "removeLocation",
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
		/*{name: "titleHolder", kind: enyo.FittableColumns, style: "padding-top: 5px;", components: [
			{name: "saved", tag: "i", classes: "icon-ok-sign", showing: false},*/
			//{name: "taskTitle", kind: "Title", title: "#", big: true, save: true/*, fit: true*/},
		//]},
		{name: "taskBuilderDrawer", kind: enyo.FittableColumns, fit: true, components: [
			{kind: enyo.FittableRows, classes: "nice-padding", style: "width: 117px; border-right: 1px #2E426F solid;", components: [
				{name: "locationTitle", kind: "Title", title: "3a. Add Places"},
				{name: "modificationRadioGroup", kind: onyx.RadioGroup, onActivate: "radioActivated", classes: "niceish-padding", style: "width: 100%;", components: [
					{name: "addFeaturesButton", kind: onyx.Button, attributes: {title: "Add new locations or regions to this task."}, classes: "button-style", components: [
						{tag: "i", classes: "icon-plus"},
					]},
					{name: "editFeaturesButton", kind: onyx.Button, attributes: {title: "Edit the locations or regions in this task."}, classes: "button-style", components: [
						{tag: "i", classes: "icon-pencil"},
					]},
				]},
				/*{name: "finishEditingDrawer", kind: onyx.Drawer, orient: "v", open: false, components: [
					{name: "finishEditingButton", kind: onyx.Button, content: "Done", classes: "button-style-affirmative", ontap: "finishEditing"},
				]},*/
				{name: "locationList", kind: enyo.Scroller, layoutKind: enyo.FittableColumnsLayout, fit: true, horizontal: "hidden", vertical: "scroll", components: [
					{name: "realLocationList", kind: enyo.FittableRows, style: "width: 100%;", fit: true},
				]},
			]},
			{name: "questionSection", kind: enyo.FittableRows, fit: true, showing: false, components: [
				{name: "taskInstructions", kind: "TitledInput", placeholder: "General instructions about the task", instructions: "Enter general instructions about the task below", title: "3b. Build the task"}, 
				{kind: "QuestionDrawer", classes: "nice-padding", fit: true}
			]},
		]}
	],
	buildTaskObj: function() {
		this.taskData.instructions = this.$.instructions.getValue();
	},

	checkTitles: function(inSender, inEvent) {
		this.log(inEvent);
		if(inEvent.us.kind === "TaskBuilder") {
			this.log(inEvent);
			this.log(inEvent.us);
			this.log(inEvent.us.$);
			var inTask = inEvent.us.$.taskTitle.getTitle();
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
		}
		return true;
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
		//this.toggleEditingDrawer();
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
		//this.$.taskTitle.setTitle(this.$.taskTitle.getTitle() + this.index);
		this.taskData = {};
		var tmp = {};
		tmp.points = [];
		tmp.polygons = [];
		LocalStorage.set(this.name, tmp);
		this.numSensors = 0;
		this.numQuestions = 0;
		this.toggleTaskDrawer();
		/*enyo.dispatcher.listen(document, "transitionend", this.removeActually);
		enyo.dispatcher.listen(document, "webkittransitionend", this.removeActually);
		enyo.dispatcher.listen(document, "otransitionend", this.removeActually);*/
    },
	closeDrawer: function(inSender, inEvent) {
		if (this.$.taskBuilderDrawer.getOpen()) {
			this.$.taskTitle.sendSave();
			this.doFinishedSavingTask();
		}
	},
	getData: function(inSender, inEvent) {
		this.taskData.id = 0;
		this.taskData.instructions = this.$.taskInstructions.getData();
		this.taskData.locations = this.getLocations();
		this.taskData.questions = this.$.questionDrawer.getData();
		this.taskData.camp_id = 0;
		this.taskData.incentive = 1;
		this.taskData.required = true;
		return this.taskData;
	},
	getLocations: function(inSender, inEvent) {
		var tmp = [];
		var wkt = new Wkt.Wkt();
		enyo.forEach(this.$.realLocationList.getControls(), function(inSender, inEvent) {
			var obj = {};
			obj.id = 0;
			obj.task_id = 0;
			if(inSender.data.layerType === "marker") {
				var marker = new L.Marker(inSender.data.layer._latlng);
				wkt.fromObject(marker);
				obj.geometryString = wkt.write();
			}
			if(inSender.data.layerType === "polygon") {
				this.log(inSender.data.layer);
				var poly = new L.Polygon(inSender.data.layer._latlngs);
				wkt.fromObject(poly);
				obj.geometryString = wkt.write();
			}
			tmp.push(obj);
		}, this);
		return tmp;
	},
	handleExpand: function(inSender, inEvent) {
		this.log(inSender.expanded);
		if(!inSender.expanded) {
			this.finishEditing();
		}
	},
	newLocation: function(inLocation) {
		if(!this.$.questionSection.showing) {
			this.$.questionSection.show();
			this.resized();
			this.$.questionSection.resized();
		}
		if(inLocation.layerType === "marker") {
			this.$.realLocationList.createComponent({tag: "i", kind: "Destroyable", classes: "icon-map-marker icon-3x location-builder nice-padding", style: "width: 100%; display: block; text-align: center;", data: inLocation, ontap: "readLocationData"}, {owner: this});
			this.$.realLocationList.render();
		}
		if(inLocation.layerType === "polygon") {
			this.$.realLocationList.createComponent({tag: "i", kind: "Destroyable", classes: "icon-globe icon-3x location-builder nice-padding", style: "width: 100%; display: block; text-align: center;", data: inLocation, ontap: "readLocationData"}, {owner: this});
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
			//this.toggleEditingDrawer();
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
	removeLocation: function(inSender, inEvent) {
		var inLayer = inEvent.layer;
		this.log(inLayer);
		enyo.forEach(this.$.realLocationList.getControls(), function(inSender, inEvent) {
			if(inSender.data.layer._leaflet_id === inLayer._leaflet_id) {
				//inSender.destroy();
				inSender.remove(inSender, null);
				return;
			}
		}, this);
		this.$.realLocationList.resized();
		return true;
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
