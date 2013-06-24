enyo.kind({
    	name: "SensorChooser",
    	kind: enyo.FittableRows,
	components: [
		{content: "Choose 1+ Sensors:", kind: enyo.Node, expanded: true, classes: "enyo-button test", onlyIconExpands: true, expandable: true, components: [
			{kind: enyo.ToolDecorator, components: [
		    		{kind: onyx.Button, classes: "button-spacing", ontap: "pickSensor", components: [
			    		{kind: onyx.Icon, src: "assets/cam.png"}
				]},
		    		{kind: onyx.Button, classes: "button-spacing", ontap: "pickSensor", components: [
			    		{kind: onyx.Icon, src: "assets/vid.png"}
				]},
		    		{kind: onyx.Button, classes: "button-spacing", ontap: "pickSensor", components: [
			    		{kind: onyx.Icon, src: "assets/mic.png"}
				]},
		    		{kind: onyx.Button, classes: "button-spacing", ontap: "pickSensor", components: [
			    		{kind: onyx.Icon, src: "assets/compass.png"}
				]},
		    		{kind: onyx.Button, classes: "button-spacing", ontap: "pickSensor", components: [
			    		{kind: onyx.Icon, style: "margin: auto;", src: "assets/accel.png"}
				]},
			]},
		]}
	],
	create: function(inSender, inEvent) {
	    	this.inherited(arguments);
		this.sensorToIndexDict = {"Photo": 0, "Video": 1, "Microphone": 2, "Accelerometer": 3, "Compass": 4};
		this.indexToSensorDict = ["Photo", "Video", "Microphone", "Acclerometer", "Compass"];
		this.sensorBits = [false, false, false, false, false];
	},
	getSensors: function() {
	    	var out = [];
	    	for(x in this.sensorBits) {
		    	if(this.sensorBits[x])
			    	out.push(this.indexToSensorDict[x]);
		}
		return out;
	},
	openChooserDrawer: function(inSender, inEvent) {
	    	var truth = this.$.chooserDrawer.getOpen();
	    	this.$.chooserDrawer.setOpen(!truth);
	},
	pickSensor: function(inSender, inEvent) {
		var index = this.sensorToIndexDict[inSender.getContent()];
		inSender.addRemoveClass("active", !this.sensorBits[index]);
		if(this.sensorBits[index])
			this.sensorBits[index] = false;
		else
			this.sensorBits[index] = true;
		this.log(this.getSensors());
		return true;
	}
});
