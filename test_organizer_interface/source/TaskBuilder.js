enyo.kind({
	name: "TaskBuilder",
	handlers: {
	    onCreateQuestion: "addQuestion",
		onCreateSensor: "addSensor",
		onDeactivateTaskLocationEditingUI: "deactivateLocationEditingUI"
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
		{name: "taskTitle", kind: "SaveTitle", title: "Task #", big: true, onTitleCollapsing: "toggleTaskDrawer", classes: "hanging-child"},
		{name: "taskDrawer", kind: onyx.Drawer, open: true, orient: "v", classes: "hanging-child", components: [
			{name: "taskInstructions", kind: "TitledInput", placeholder: "Please enter your instructions here...", classes: "hanging-child", title: "Task Instructions"}, 
			{kind: enyo.FittableColumns, classes: "hanging-child", components: [
				{name: "modificationRadioGroup", kind: onyx.RadioGroup, onActivate: "radioActivated", classes: "hanging-child", fit: true, components: [
					{name: "addFeaturesButton", content: "Add locations or Regions"},
					{name: "editFeaturesButton", content: "Edit locations and Regions"},
					{name: "shapefileButton", content: "Upload Shapefile"},
				]},
				{name: "finishEditingDrawer", kind: onyx.Drawer, orient: "h", open: false, components: [
					{name: "finishEditingButton", kind: onyx.Button, content: "Finish Editing", classes: "onyx-negative", ontap: "finishEditing"},
				]}
			]},
			{name: "stepTitle", kind: "Title", title: "Add new step(s) to this task", classes: "hanging-child"},
			{name: "questionCont", classes: "hanging-child", kind: enyo.FittableRows},
			{kind: "StepBuilder", classes: "hanging-child"}
		]}
	],
	addQuestion: function(inSender, inEvent) {
		this.waterfallDown("onNewStep");
	    /*enyo.forEach(this.$.questionCont.getComponents(), function (inSender, inEvent) {
			if(inSender.kind.toString() === "QuestionBuilder" && inSender.$.questions.getExpanded()){
	    		inSender.$.questions.toggleExpanded();
			}
		});*/

		var len = this.$.questionCont.getComponents().length;
		len = len + 1; // account for Sensor not being a Question
		this.numQuestions++;
		this.$.questionCont.createComponent({kind: "QuestionBuilder", stepIndex: len, questionIndex: this.numQuestions, classes: "bordering hanging-child"});
		this.$.questionCont.render();

		//return true;
	},
	addSensor: function(inSender, inEvent) {
		this.waterfallDown("onNewStep");
		var len = this.$.questionCont.getComponents().length;
		len = len + 1; // account for Sensor not being a Question
		this.numSensors++;
		this.$.questionCont.createComponent({kind: "SensorChooser", stepIndex: len, sensorIndex: this.numSensors, classes: "bordering hanging-child"});
		this.$.questionCont.render();

		//return true;
	},
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
	toggleEditingDrawer: function(inSender, inEvent) {
		var truthy = this.$.finishEditingDrawer.getOpen();
		this.log(truthy);
		this.$.finishEditingDrawer.setOpen(!truthy);
	},
	toggleTaskDrawer: function(inSender, inEvent) {
		var truthy = this.$.taskDrawer.getOpen();
		this.$.taskDrawer.setOpen(!truthy);
	},
        
});
