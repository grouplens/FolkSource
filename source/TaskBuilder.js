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
		{name: "tasks", content: "Task", kind: enyo.Node, expanded: true, icon: "assets/task.png", classes: "enyo-button test", onlyIconExpands: true, onExpand: "handleExpand", expandable: true, components: [
	    		{kind: enyo.ToolDecorator, components: [
	    			{name: "modificationRadioGroup", kind: "onyx.RadioGroup", onActivate: "radioActivated", components: [
	    				{name: "addFeaturesButton", kind: onyx.RadioButton, content: "Add locations or Regions"},
	    				{name: "editFeaturesButton", kind: onyx.RadioButton, content: "Edit locations and Regions"}
	    			]},
					{name: "finishEditingButton", kind: onyx.Button, content: "Finish Editing", ontap: "finishEditing", showing: false},
					{name: "shapefileButton", kind: onyx.Button, content: "Upload Shapefile", ontap: "clickToAddShapeFile"}
			]},
			{name: "instructions", kind: onyx.Input, style: "width: 100%;", placeholder: "Task Instructions/Description"},
			{name: "sensorCont", kind: enyo.FittableRows},
			{name: "questionCont", kind: enyo.FittableRows},
			{kind: "StepBuilder"}
		]}
	],
	addQuestion: function(inSender, inEvent) {
	    enyo.forEach(this.$.questionCont.getComponents(), function (inSender, inEvent) {
		this.log(inSender);
		if(inSender.kind.toString() === "QuestionBuilder" && inSender.$.questions.getExpanded()){
	    	inSender.$.questions.toggleExpanded();
		}
	});

	var len = this.$.questionCont.getComponents().length;
	len = len + 1; // account for Sensor not being a Question
    	this.$.questionCont.createComponent({kind: "QuestionBuilder", index: len, classes: "bordering"});
	this.$.questionCont.render();
	return true;

	},
	addSensor: function(inSender, inEvent) {
	      	if(!this.sensor) {
	    		this.$.sensorCont.createComponent({kind: "SensorChooser", classes: "bordering"});
			this.$.sensorCont.render();
		}
		return true;
	},
	buildTaskObj: function() {
	    	this.taskData.instructions = this.$.instructions.getValue();
	},

	radioActivated: function(inSender, inEvent){
		//this.log("in radioActivated function");

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
			this.$.finishEditingButton.show();
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
		this.$.finishEditingButton.hide();
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
		this.name = "Task " + this.index;
		this.$.tasks.setContent(this.name);
		this.taskData = {};
		var tmp = {};
		tmp.points = [];
		tmp.polygons = [];
		LocalStorage.set(this.name, tmp);
		this.log(LocalStorage.get(this.name));
    },

	handleExpand: function(inSender, inEvent) {
    	this.log(inSender.expanded);
		if(!inSender.expanded) {
			this.finishEditing();
		}
	}
        
});
