enyo.kind({
	name: "StepBuilder",
	events: {
		onCreateQuestion: "",
		onCreateSensor: "",
		onShowQuestion: ""
	},
	components:[
		{name: "stepDrawer", kind: onyx.Drawer, orient: "v", open: false, components: [
			{name: "questionButton", kind: onyx.RadioButton, content: "Add Question", ontap: "bubbleCreateQuestion", style: "width: 50%;"},
			{name: "sensorButton", kind: onyx.RadioButton, content: "Add Sensor", ontap: "bubbleCreateSensor", style: "width: 50%;"}
		]},
		{name: "stepButton", kind: onyx.Button, style: "width: 100%;", content: "New Step", ontap: "showOptions"}
	],
	bubbleCreateQuestion: function(inSender, inEvent) {
		this.$.stepDrawer.setOpen(false);
		this.doCreateQuestion();
	},
	bubbleCreateSensor: function(inSender, inEvent) {
		this.$.stepDrawer.setOpen(false);
		this.doCreateSensor();
		/*this.$.sensorButton.setDisabled(true);
		this.$.sensorButton.setContent("1 at a time");*/
	},
	create: function(inSender, inEvent) {
		this.inherited(arguments);
	},
	showOptions: function(inSender, inEvent) {
		this.doShowQuestion();
		//this.$.stepDrawer.setOpen(true);
	},
});
