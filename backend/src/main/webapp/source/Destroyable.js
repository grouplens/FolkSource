enyo.kind({
	name: "Destroyable",
	kind: enyo.Control,
	published: {
		type: ""
	},
	events: {
		onDestroyed: ""
	},
	handlers: {
		onDestroy: "remove",
	},
	components: [
	],
	create: function(inSender, inEvent) {
		this.inherited(arguments);
		enyo.dispatcher.listen(document, "transitionend", enyo.bind(this, "removeActually"));
		enyo.dispatcher.listen(document, "webkittransitionend", enyo.bind(this, "removeActually"));
	},
	remove: function(inSender, inEvent) {
		//this is sorta weird, but it's a visual cue of destruction
		this.log(inSender);
		if(inSender.name === "stepTitle") {
			this.log("question");
			this.addRemoveClass("question-builder-destroy", true);
		}
		else if(inSender.name.indexOf("destroyable") > -1) {
			this.log("location");
			this.addRemoveClass("location-builder-destroy", true);
		}
		else if(inSender.name === "taskTitle") {
			this.log("task");
			this.addRemoveClass("task-builder-destroy", true);
		}
		return true;
	},
	removeActually: function(inSender, inEvent) {
		if(inSender.originator.name !== "mapCont") {
			inSender.originator.destroy();
			this.doDestroyed({us: inSender.originator});
		}
		return true;
	},
});
