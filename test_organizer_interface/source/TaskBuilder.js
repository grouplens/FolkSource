enyo.kind({
	name: "TaskBuilder",
	kind: enyo.FittableRows,
	handlers: {
	    onCreateQuestion: "addQuestion",
		onCreateSensor: "addSensor",
		onDeactivateTaskLocationEditingUI: "deactivateLocationEditingUI",
		onNewTask: "saveData",
		onTitleCollapsing: "toggleTaskDrawer",
		onQuestionsIncoming: "saveQuestions",
	},
	published: {
	    index: 1
	},
	events: {
		onAddShapefile: "",
		onDeactivateAllEditing: "",
		onShowAddFeaturesToolbar: "",
		onShowEditFeaturesToolbar: ""
	},
	components: [
		{kind: enyo.Signals, onQuestionsIncoming: "saveQuestions"},
		{name: "taskTitle", kind: "SaveTitle", title: "#", big: true, circled: true, classes: "hanging-child"},
		{name: "taskBuilderDrawer", kind: onyx.Drawer, open: true, orient: "v", classes: "hanging-child", components: [
			{name: "taskInstructions", kind: "TitledInput", placeholder: "Please enter your instructions here...", classes: "hanging-child", title: "Task Instructions"}, 
			{name: "locationTitle", kind: "Title", title: "Locations & Regions:"},
			{kind: enyo.FittableColumns, classes: "hanging-child", components: [
				{name: "modificationRadioGroup", kind: onyx.RadioGroup, onActivate: "radioActivated", classes: "hanging-child", fit: true, components: [
					{name: "addFeaturesButton", kind: enyo.Button, classes: "button-style", content: "Add"},
					{name: "editFeaturesButton", kind: enyo.Button, classes: "button-style", content: "Edit"},
					{name: "shapefileButton", kind: enyo.Button, classes: "button-style", content: "Shapefile"},
				]},
				{name: "finishEditingDrawer", kind: onyx.Drawer, orient: "h", open: false, components: [
					{name: "finishEditingButton", kind: enyo.Button, content: "Finish Editing", classes: "button-style", ontap: "finishEditing"},
				]}
			]},
			{name: "stepTitle", kind: "Title", title: "Add new step(s) to this task", classes: "hanging-child"},
			{name: "questionCont", classes: "hanging-child", kind: enyo.FittableRows},
			{kind: "StepBuilder", classes: "hanging-child"}
		]}
	],
	buildTaskObj: function() {
	    	this.taskData.instructions = this.$.instructions.getValue();
	},

	radioActivated: function(inSender, inEvent){
		if (inEvent.originator.getActive()){
			//Deactivate any editing mode that may be active and remove any controls from the map
			this.doDeactivateAllEditing();
			//Open the appropriate drawer
			if (inEvent.originator.name == "addFeaturesButton"){
				this.doShowAddFeaturesToolbar();
			} else if (inEvent.originator.name == "editFeaturesButton"){
				this.doShowEditFeaturesToolbar();
			}
			//Show finish button
			this.toggleEditingDrawer();
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
		this.log(LocalStorage.get(this.name));
    },

	handleExpand: function(inSender, inEvent) {
    	this.log(inSender.expanded);
		if(!inSender.expanded) {
			this.finishEditing();
		}
	},
	saveData: function(inSender, inEvent) {
		//save data goes here
		if(this.$.taskBuilderDrawer.getOpen())
			this.$.taskTitle.sendSave();
	},
	saveQuestions: function(inSender, inEvent) {
		if(this.$.taskBuilderDrawer.getOpen()) {
			this.questions = inEvent.questions;
			this.log(this.$.taskTitle.getTitle());
			this.log(inEvent.questions);
		}
		enyo.Signals.send("onQuestionsSaved");
		return true;
	},
	toggleEditingDrawer: function(inSender, inEvent) {
		var truthy = this.$.finishEditingDrawer.getOpen();
		this.log(truthy);
		this.$.finishEditingDrawer.setOpen(!truthy);
	},
	toggleTaskDrawer: function(inSender, inEvent) {
		var truthy = this.$.taskBuilderDrawer.getOpen();
		this.log(truthy);
		this.$.taskBuilderDrawer.setOpen(!truthy);
		this.addRemoveClass("active-card", !truthy);
		if(!truthy)
			enyo.Signals.send("onEditTask", {questions: this.questions});
	},
        
});
