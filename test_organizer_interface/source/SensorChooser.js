enyo.kind({
	name: "SensorChooser",
	kind: enyo.FittableRows,
	published: {
		sensorIndex: 1,
		stepIndex: 1,
		questionData: null
	},
	events: {
		onDestroyedQuestion: "",
	},
	handlers: {
		onTitleCollapsing: "toggleSensorDrawer",
		onNewStep: "saveData",
		onDestroyedQuestion: "checkTitles",
	},
	components: [
		{kind: enyo.FittableColumns, components: [
			{name: "stepTitle", kind: "SaveTitle", big: true, circled: true, title: "#"},
			{name: "cancelButton", ontap: "remove", tag: "i", classes: "icon-remove"}
		]},
		{name: "sensorTitle", kind: "Title", title: "Sensor #", classes: "hanging-child"},
		{name: "sensorDrawer", kind: onyx.Drawer, orient: "v", open: true, classes: "hanging-child", components: [
			{title: "Choose a Sensor:", kind: "Title", classes: "hanging-child"},
			{tag: "select", classes: "hanging-child", onchange: "pickSensor", components: [
				/*{tag: "option", content: "Accelerometer"},*/
				{tag: "option", content: "Audio"},
				/*{tag: "option", content: "Compass"},*/
				{tag: "option", content: "Photo"},
				{tag: "option", content: "Video"},
			]},
			/*{kind: onyx.RadioGroup, onActivate: "pickSensor", classes: "hanging-child", components: [
				{kind: onyx.Button, index: 0, components: [
					{kind: enyo.Image, src: "assets/cam.png"},
				]},
				{kind: onyx.Button, index: 1, components: [
					{kind: enyo.Image, src: "assets/vid.png"},
				]},
				{kind: onyx.Button, index: 2, components: [
					{kind: enyo.Image, src: "assets/mic.png"},
				]},
				{kind: onyx.Button, index: 3, components: [
					{kind: enyo.Image, src: "assets/compass.png"},
				]},
				{kind: onyx.Button, index: 4, components: [
					{kind: enyo.Image, src: "assets/accel.png"}
				]},
			]}*/
		]}
	],
	create: function(inSender, inEvent) {
		this.inherited(arguments);
		this.sensorToIndexDict = {"Photo": 0, "Video": 1, "Audio": 2, "Accelerometer": 3, "Compass": 4};
		this.indexToSensorDict = ["Photo", "Video", "Audio", "Acclerometer", "Compass"];
		this.sensorBits = [false, false, false, false, false];
		this.$.stepTitle.setTitle(this.$.stepTitle.getTitle() + this.stepIndex);
		this.$.sensorTitle.setTitle(this.$.sensorTitle.getTitle() + this.sensorIndex);
		this.curType = "Accelerometer";
		this.question = {};

	},
	buildQuestion: function(inSender, inEvent) {
		this.question.id = 0;
		this.question.task_id = 0;
		if(this.curType === "Photo") 
			this.question.question = "Take ";
		else
			this.question.question = "Record ";
		this.question.question += this.curType;
		this.question.type = this.curType;
		
		this.log(this.question);
	},
	checkTitles: function(inSender, inEvent) {
		var inStep = inEvent.step;
		var inQ = inEvent.question;
		var regex = /\d+/;
		var inStepNum = Number(inStep.match(regex)[0]);
		var inQNum = Number(inQ.match(regex)[0]);

		var step = this.$.stepTitle.getTitle();
		var question = this.$.sensorTitle.getTitle();
		var stepNum = Number(step.match(regex)[0]);
		var questionNum = Number(question.match(regex)[0]);

		this.log(inStepNum);
		this.log(stepNum);
		this.log(inQNum);
		this.log(questionNum);
		if(inStepNum < stepNum && inQNum < questionNum) {
			this.$.stepTitle.setTitle("#" + (stepNum - 1));
			this.$.questionTitle.setTitle("Question #" + (questionNum - 1));
		}
	},
	getData: function(inSender, inEvent) {
		this.buildQuestion();
		return this.question;
	},
	toggleSensorDrawer: function(inSender, inEvent) {
		var truthy = this.$.sensorDrawer.getOpen();
		this.$.sensorDrawer.setOpen(!truthy);
	},
	pickSensor: function(inSender, inEvent) {
		var e = inSender.eventNode;
		this.curType = e.options[e.selectedIndex].value;
		this.buildQuestion();
		this.log(this.question);

		return true;
	},
	remove: function(inSender, inEvent) {
		this.doDestroyedQuestion({step: this.$.stepTitle.getTitle(), question: this.$.sensorTitle.getTitle()});
		this.destroy();
	},
	saveData: function(inSender, inEvent) {
		//save logic goes here
		this.log();
		if(this.$.sensorDrawer.getOpen())
			this.$.stepTitle.sendSave();
	},
});
