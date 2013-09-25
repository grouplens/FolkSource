enyo.kind({
	name: "SensorChooser",
	kind: enyo.FittableRows,
	published: {
		sensorIndex: 1,
		stepIndex: 1,
		questionData: null
	},
	handlers: {
		onTitleCollapsing: "toggleSensorDrawer",
		onNewStep: "saveData"
	},
	components: [
		{name: "stepTitle", kind: "SaveTitle", big: true, circled: true, title: "#"},
		{name: "sensorTitle", kind: "Title", title: "Sensor #", classes: "hanging-child"},
		{name: "sensorDrawer", kind: onyx.Drawer, orient: "v", open: true, classes: "hanging-child", components: [
			{title: "Choose a Sensor:", kind: "Title", classes: "hanging-child"},
			{tag: "select", classes: "hanging-child", onchange: "pickSensor", components: [
				{tag: "option", content: "Accelerometer"},
				{tag: "option", content: "Audio"},
				{tag: "option", content: "Compass"},
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

	},
	getData: function(inSender, inEvent) {
		var question = {};
		question.id = 0;
		question.task_id = 0;
		if(this.curType === "Photo") 
			question.question = "Take ";
		else
			question.question = "Record ";
		question.question += this.curType;
		//question.question = this.$.questionText.getData();
		question.type = this.curType;
		
		this.log(question);
		return question;
	},
	toggleSensorDrawer: function(inSender, inEvent) {
		var truthy = this.$.sensorDrawer.getOpen();
		this.$.sensorDrawer.setOpen(!truthy);
	},
	pickSensor: function(inSender, inEvent) {
		var index = inEvent.originator.index;
		this.curType = this.indexToSensorDict[index];

		return true;
	},
	saveData: function(inSender, inEvent) {
		//save logic goes here
		this.log();
		if(this.$.sensorDrawer.getOpen())
			this.$.stepTitle.sendSave();
	},
});
