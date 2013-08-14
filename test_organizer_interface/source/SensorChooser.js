enyo.kind({
	name: "SensorChooser",
	kind: enyo.FittableRows,
	published: {
		sensorIndex: 1,
		stepIndex: 1
	},
	handlers: {
		onTitleCollapsing: "toggleSensorDrawer",
		onNewStep: "saveData"
	},
	components: [
		{name: "stepTitle", kind: "SaveTitle", big: true, title: "Step #"},
		{name: "sensorDrawer", kind: onyx.Drawer, orient: "v", open: true, classes: "hanging-child", components: [
			{name: "sensorTitle", kind: "Title", title: "Sensor #", classes: "hanging-child"},
			{title: "Choose a Sensor:", kind: "Title", classes: "hanging-child"},
			{kind: onyx.RadioGroup, onActivate: "pickSensor", classes: "hanging-child", components: [
				{kind: onyx.Button, components: [
					{kind: onyx.Icon, src: "assets/cam.png"},
				]},
				{kind: onyx.Button, components: [
					{kind: onyx.Icon, src: "assets/vid.png"},
				]},
				{kind: onyx.Button, components: [
					{kind: onyx.Icon, src: "assets/mic.png"},
				]},
				{kind: onyx.Button, components: [
					{kind: onyx.Icon, src: "assets/compass.png"},
				]},
				{kind: onyx.Button, components: [
					{kind: onyx.Icon, src: "assets/accel.png"}
				]},
			]}
		]}
	],
	create: function(inSender, inEvent) {
		this.inherited(arguments);
		this.sensorToIndexDict = {"Photo": 0, "Video": 1, "Microphone": 2, "Accelerometer": 3, "Compass": 4};
		this.indexToSensorDict = ["Photo", "Video", "Microphone", "Acclerometer", "Compass"];
		this.sensorBits = [false, false, false, false, false];
		this.$.stepTitle.setTitle(this.$.stepTitle.getTitle() + this.stepIndex);
		this.$.sensorTitle.setTitle(this.$.sensorTitle.getTitle() + this.sensorIndex);

	},
	getSensors: function() {
		var out = [];
		for(x in this.sensorBits) {
			if(this.sensorBits[x])
				out.push(this.indexToSensorDict[x]);
		}
		return out;
	},
	toggleSensorDrawer: function(inSender, inEvent) {
		var truthy = this.$.sensorDrawer.getOpen();
		this.$.sensorDrawer.setOpen(!truthy);
	},
	pickSensor: function(inSender, inEvent) {
		if(inEvent.originator.getActive()) {
			var index = this.sensorToIndexDict[inEvent.originator.getContent()];

			if(this.sensorBits[index])
				this.sensorBits[index] = false;
			else
				this.sensorBits[index] = true;

			this.log(this.getSensors());

			return true;
		}
	},
	saveData: function(inSender, inEvent) {
		//save logic goes here
		this.log();
		if(this.$.sensorDrawer.getOpen())
			this.$.stepTitle.sendSave();
	},
});
