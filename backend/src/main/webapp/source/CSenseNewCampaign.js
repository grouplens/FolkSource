enyo.kind({
	name: "CampaignBuilder",
	kind: enyo.FittableColumns,
	classes: "enyo-fit",
	style: "z-index: 15; position: relative; background-color: pink;",
	handlers: {
		onCreateQuestion: "scrollDown",
		onCreateSensor: "scrollDown",
	    onNewTapped: "toggleDrawer",
		onShowTapped: "closeDrawer",
		onShowQuestion: "openQuestionDrawer"
	},
	components: [
		{name: "questionDrawer", kind: onyx.Drawer, layoutKind: enyo.FittableRowsLayout, orient: "h", open: false, style: "background-color: green; height: 100%;", components: [
			{/*kind: enyo.FittableRows, fit: true,*/ style: "height: 100%; background-color: blue; width: 300px;", components: [
				{kind: enyo.FittableColumns, components: [
					{name: "questionButton", kind: onyx.Button, content: "Add Question", ontap: "addQuestion", style: "width: 50%;"},
					{name: "sensorButton", kind: onyx.Button, content: "Add Sensor", ontap: "addSensor", style: "width: 50%;"}
				]},
				{name: "questionContainer", kind: enyo.Scroller, horizontal: "hidden", vertical: "scroll", /*layoutKind: enyo.FittableRowsLayout,*/ style: "height: 100%; background-color: pink;", /*fit: true,*/ components: [
					{name: "realQuestionContainer", kind: enyo.FittableRows, /*fit: true,*/ style: "height: 100%; background-color: orange;"}
				]}
			]}
		]},
		{name: "campaignDrawer", kind: onyx.Drawer, layoutKind: enyo.FittableRowsLayout, orient: "h", open: false, /*fit: true,*/ style: "height: 100%;", components: [
			{/*kind: enyo.FittableRows,*/ fit: true, style: "width: 350px; height: 100%; background-color: blue;", components: [
				{name: "campaignTitle", kind: "SaveTitledInput", big: true, title: "Campaign Title", placeholder: "Campaign Title"},
				{name: "campaignDesc", kind: "TitledTextArea", big: true, title: "Campaign Description", placeholder: "Please Describe your Campaign goals..."},
				{name: "nodeContainer", kind: enyo.Scroller, horizontal: "hidden", vertical: "scroll", layoutKind: enyo.FittableRowsLayout, fit: true, style: "background-color(255, 255, 255, 0.0);", components: [
					{name: "realContainer", kind: enyo.FittableRows, fit: true, style: "background-color: orange;"},
					{name: "taskButton", kind: onyx.Button, content: "Add New Task", style: "width: 100%;", ontap: "createTask"}
				]}
			]}
		]}
	],
	addQuestion: function(inSender, inEvent) {
		this.waterfallDown("onNewStep");
	    /*enyo.forEach(this.$.questionCont.getComponents(), function (inSender, inEvent) {
			if(inSender.kind.toString() === "QuestionBuilder" && inSender.$.questions.getExpanded()){
	    		inSender.$.questions.toggleExpanded();
			}
		});*/

		var len = this.$.realQuestionContainer.getComponents().length;
		len = len + 1; // account for Sensor not being a Question
		this.numQuestions++;
		this.$.realQuestionContainer.createComponent({kind: "QuestionBuilder", stepIndex: len, questionIndex: this.numQuestions, classes: "bordering hanging-child"});
		this.$.realQuestionContainer.render();
		this.$.questionContainer.resized();

		//return true;
	},
	addSensor: function(inSender, inEvent) {
		this.waterfallDown("onNewStep");
		var len = this.$.realQuestionContainer.getComponents().length;
		len = len + 1; // account for Sensor not being a Question
		this.numSensors++;
		this.$.realQuestionContainer.createComponent({kind: "SensorChooser", stepIndex: len, sensorIndex: this.numSensors, classes: "bordering hanging-child"});
		this.$.realQuestionContainer.render();
		this.$.questionContainer.resized();

		//return true;
	},
	closeDrawer: function(inSender, inEvent) {
		//this.log("closeDrawer Called!")
		var truthy = this.$.campaignDrawer.getOpen();
		if(truthy){
			this.$.campaignDrawer.setOpen(!truthy);
		}
	},
	create: function(inSender, inEvent) {
		this.inherited(arguments);
		this.numSensors = 0;
		this.numQuestions = 0;
	},
	createTask: function(inSender, inEvent) {
		enyo.forEach(this.$.realContainer.getComponents(), function (inSender, inEvent) {
			this.log(inSender);
			if(inSender.kind.toString() === "TaskBuilder" && inSender.$.tasks.getExpanded()){
				inSender.$.tasks.toggleExpanded();
			}
		});
		var len = this.$.realContainer.getComponents().length + 1;
		this.$.realContainer.createComponent({kind: "TaskBuilder", index: len, classes: "bordering"});
		this.$.realContainer.render();
		this.$.nodeContainer.resized();
		//this.$.mapDrawer.resized();
	},
	openQuestionDrawer: function(inSender, inEvent) {
		this.log();
		this.$.questionDrawer.setOpen(true);
	},	
	scrollDown: function(inSender, inEvent) {
		this.$.nodeContainer.scrollToBottom();
	},
	toggleDrawer: function(inSender, inEvent) {
		this.log("toggle Drawer called!");
		var truthy = this.$.campaignDrawer.getOpen();
		this.$.campaignDrawer.setOpen(!truthy);
	},
});
