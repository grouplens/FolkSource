enyo.kind({
	name: "StepBuilder",
	events: {
		onCreateQuestion: "",
		onCreateSensor: "",
		onShowQuestion: ""
	},
	components:[
		{name: "stepButton", kind: enyo.Button, style: "width: 98%;", content: "New Step", ontap: "showOptions", classes: "hanging-child button-style"}
	],
	create: function(inSender, inEvent) {
		this.inherited(arguments);
	},
	showOptions: function(inSender, inEvent) {
		enyo.Signals.send("onNewStep");
	},
});
