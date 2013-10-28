enyo.kind({
	name: "QuestionDrawer",
	kind: enyo.FittableRows,
	open: false,
	orient: "h", 
	style: "height: 100%;",
	//layoutKind: enyo.FittableColumnsLayout,
	events: {
		onResizeMap: "",
		onNewQuestion: ""
	},
	handlers: {
		onShowTapped: "closeDrawer",
		onDestroyedQuestion: "checkQTitles",
	},
	components: [
		{kind: enyo.Signals, onNewStep: "createNewStep", onEditTask: "reconstituteQuestions", onQuestionsSaved: "removeAllQuestions"/*, onNewTask: "saveData"*/},
		{name: "spinUp", kind: onyx.Popup, centered: true, floating: true, autoDismiss: false, classes: "dark-background-flat", components: [
			{name: "spin", kind: onyx.Spinner, classes: "onyx-dark dark-background"}
		]},
		{name: "phonePreview", kind: onyx.Popup, modal: true, centered: true, floating: true, autoDismiss: false, components: [
			{kind: enyo.FittableRows, components: [
				{kind: onyx.Button, content: "Close", classes: "button-cancel-style", style: "float: right;", ontap: "closePopup"},
				{content: "test"}
			]}
		]},
		{kind: enyo.FittableRows, fit: true, components: [
			/*{name: "titleContainer", kind: enyo.FittableColumns, classes: "nice-padding", style: "width: 100%;", components: [
				{name: "questionTitle", kind: "Title", title: "Add Questions and Sensors", instructions: "Add survey questions or sensors that you want to collect data with. Preview on the phone with the button to the right.", fit: true},
				{kind: onyx.Button, classes: "button-style", style: "height: 100%;", components: [
					{tag: "i", classes: "icon-mobile-phone icon-large"}
				]}
			]},*/
			{kind: enyo.FittableColumns, fit: true, components: [
				{kind: enyo.FittableRows, style: "height: 100%;", components: [
					{style: "height: 33%;", components: [
						{name: "questionButton", kind: onyx.Button, ontap: "addQuestion", style: "width: 100%; height: 100%;", classes: "button-style dark-background", components: [
							{kind: enyo.FittableRows, components: [
								{content: "Add "},
								{tag: "i", classes: "icon-question icon-large", fit: true}
							]}
						]},
					]},
					{style: "height: 33%;", components: [
						{name: "sensorButton", kind: onyx.Button, ontap: "addSensor", style: "width: 100%; height: 100%;", classes: "button-style dark-background", components: [
							{kind: enyo.FittableRows, components: [
								{content: "Add "},
								{tag: "i", classes: "icon-eye-open icon-large", fit: true}
							]}
						]},
					]},
					{style: "height: 33%;", components: [
						{kind: onyx.Button, classes: "button-style", style: "width: 100%; height: 100%;", fit: true, components: [
							{tag: "i", classes: "icon-mobile-phone icon-2x"}
						]}
					]},
				]},
				{name: "questionContainer", kind: enyo.Scroller, classes: "dark-background nice-padding", vertical: "scroll", horizontal: "hidden", layoutKind: enyo.FittableRowsLayout, fit: true, components: [
					{name: "realQuestionContainer", kind: enyo.FittableRows, fit: true}
				]},
			]},
		]}
	],
	create: function(inSender, inEvent) {
		this.inherited(arguments);
		this.numSensors = 0;
		this.numQuestions = 0;
	},
	addQuestion: function(inSender, inEvent) {
		//this.saveData();
		this.waterfallDown("onNewStep");

		var len = this.$.realQuestionContainer.getComponents().length + 1;
		this.numQuestions++;
		this.$.realQuestionContainer.createComponent({kind: "QuestionBuilder", stepIndex: len, questionIndex: this.numQuestions, classes: "nice-padding bordering light-background", style: "z-index: -1;"});
		this.$.questionContainer.resized();
		this.$.questionContainer.render();
		this.$.realQuestionContainer.resized();
		this.$.realQuestionContainer.render();
		this.doNewQuestion();
		this.scrollDown();

		return true;
	},
	addSensor: function(inSender, inEvent) {
		//this.saveData();
		this.waterfallDown("onNewStep");

		var len = this.$.realQuestionContainer.getComponents().length + 1;
		this.numSensors++;
		this.$.realQuestionContainer.createComponent({kind: "SensorChooser", stepIndex: len, sensorIndex: this.numSensors, classes: "nice-padding bordering light-background"});
		this.$.realQuestionContainer.resized();
		this.$.realQuestionContainer.render();
		this.$.questionContainer.resized();
		this.$.questionContainer.render();
		this.scrollDown();

		return true;
	},
	buildPreview: function(inSender, inEvent) {
		//preview stuff goes here
		this.$.phonePreview.show();
	},
	checkQTitles: function(inSender, inEvent) {
		this.log();
		this.waterfallDown("onDestroyedQuestion", {step: inEvent.step, question: inEvent.question});
	},
	createNewStep: function(inSender, inEvent) {
		/*if(!this.getOpen())
			this.toggleDrawer();*/
	},
	closeDrawer: function(inSender, inEvent) {
		/*var truth = this.getOpen();
		if(truth)
			this.setOpen(!truth);*/
	},
	closePopup: function(inSender, inEvent) {
		this.$.phonePreview.hide();
	},
	reconstituteQuestions: function(inSender, inEvent) {
		this.$.spinUp.show();
		this.numQuestions = 0;
		this.numSensors = 0;
		var questions = inEvent.questions;
		var len = 0;
		for(var x in questions) {
			switch(questions[x].type.toLowerCase()) {
				case "camera":
				case "microphone":
				case "video":
				case "compass":
				case "accelerometer":
					len = this.$.realQuestionContainer.getComponents().length + 1;
					this.numSensors++;
					this.$.realQuestionContainer.createComponent({kind: "SensorChooser", stepIndex: len, sensorIndex: this.numSensors, questionData: questions[x], classes: "bordering hanging-child active-card"});
				break;
				case "text":
				case "multiple_choice":
				case "exclusive_multiple_choice":
				case "complex_counter":
					len = this.$.realQuestionContainer.getComponents().length + 1;
					this.numQuestions++;
					this.$.realQuestionContainer.createComponent({kind: "QuestionBuilder", stepIndex: len, questionIndex: this.numQuestions, questionData: questions[x], classes: "bordering hanging-child active-card"});
				break;
				default:
					this.warn("Incorrect question type");
				break;
			}
		}

		this.$.questionContainer.resized();
		this.$.questionContainer.render();
		this.scrollDown();
		this.$.spinUp.hide();
	},
	saveData: function(inSender, inEvent) {
		var questions = [];
		enyo.forEach(this.$.realQuestionContainer.getComponents(), function(inSender, inEvent) {
			if(inSender.kind === "QuestionBuilder" || inSender.kind === "SensorChooser") {
				questions.push(inSender.getData());
			}
		}, this);
		enyo.Signals.send("onQuestionsIncoming", {questions: questions});
	},
	removeAllQuestions: function(inSender, inEvent) {
		this.log(inSender);
		this.log(inEvent);
		this.$.realQuestionContainer.destroyComponents();
		
		//THIS IS SUPER HACKY
		if(inSender !== "clean")
			enyo.Signals.send("onQuestionsRemoved");
	},
	scrollDown: function(inSender, inEvent) {
		this.$.questionContainer.scrollToBottom();
	},
	toggleDrawer: function(inSender, inEvent) {
		var truth = this.getOpen();
		this.setOpen(!truth);
		var offset = truth ? -150 : 150;
		this.log(offset);
		this.doResizeMap({offset: offset});
		return true;
	}
});
