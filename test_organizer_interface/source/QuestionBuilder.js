enyo.kind({
	name: "QuestionBuilder",
	events: {
		onDestroyedQuestion: "",
	},
	handlers: {
		onDoneEditing: "lockList",
		onMakeNew: "newOption",
		onTitleCollapsing: "toggleQuestionDrawer",
		onNewStep: "saveData",
		onDestroyedQuestion: "checkTitles",
		onDestroy: "remove",
	},
	published: {
		stepIndex: 1,
		questionIndex: 1,
		questionData: null
	},
	components:[
		//{kind: enyo.Signals, onDestroyedQuestion: "checkTitles"},
		{name: "stepTitle", kind: "Title", title: "#", /*circled: true,*/ big: true, save: false, fit: true, style: "height: 100%;"},
		{name: "questionTitle", kind: "Title", title: "Question #", classes: "nice-padding", save: false},
		{name: "questionDrawer", kind: onyx.Drawer, open: true, orient: "v", classes: "nice-padding", components: [
			{name: "questionText", kind: "TitledInput", title: "What's the question?", placeholder: "Enter your question text here...", classes: "nice-padding", save: false},
			{kind: "Title", title: "Type of Question:", classes: "nice-padding", save: false},
			{name: "questionChoices", tag: "select", classes: "nice-padding", onchange: "questionPicked", components: [
				{content: "Text", tag: "option"}, // index 0
				{content: "Mult. Choice", tag: "option"}, // index 1
				{content: "Excl. Mult. Choice", tag: "option"}, // index 2
				{content: "Counter", tag: "option"}, // index 3
			]}, 
			{name: "optionList", kind: enyo.List, style: "height: 100px;", count: 1, showing: false, ontap: "editOption", onSetupItem: "makeOption", components: [
				{kind: "EditableListItem", name: "oItem"}
			]}
		]}
	],
	create: function(inSender, inEvent) {
		this.inherited(arguments);
		this.options = ["Add new option, hit 'enter' to save"];
		this.$.stepTitle.setTitle(this.$.stepTitle.getTitle() + this.stepIndex);
		this.$.questionTitle.setTitle(this.$.questionTitle.getTitle() + this.questionIndex);
		this.curType = "text";
	},
	rendered: function(inSender, inEvent) {
		this.inherited(arguments);
		if(this.questionData) {
			this.recreate();
		}
	},
	checkTitles: function(inSender, inEvent) {
		var inStep = inEvent.step;
		var inQ = inEvent.question;
		var regex = /\d+/;
		var inStepNum = Number(inStep.match(regex)[0]);
		var inQNum = Number(inQ.match(regex)[0]);

		var step = this.$.stepTitle.getTitle();
		var question = this.$.questionTitle.getTitle();
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
	decodeType: function(inType) {
		var outType = "";
		switch(inType) {
			case "Mult. Choice":
				outType = "multiple_choice";
			break;
			case "Excl. Mult. Choice":
				outType = "exclusive_multiple_choice";
			break;
			case "Text":
				outType = "text";
			break;
			case "Counter":
				outType = "complex_counter";
			break;
		}
		
		return outType;
	},
	recodeType: function(inType) {
		var outDex = -1;
		switch(inType) {
			case "multiple_choice":
				outDex = 1;
			break;
			case "exclusive_multiple_choice":
				outDex = 2;
			break;
			case "text":
				outDex = 0;
			break;
			case "complex_counter":
				outDex = 3;
			break;
		}
		return outDex;
	},
	editOption: function(inSender, inEvent) {
		var index = inEvent.index;
		this.$.optionList.prepareRow(index);
		this.$.oItem.flip();
		return true;
	},
	getData: function(inSender, inEvent) {
		var question = {};
		question.id = 0;
		question.task_id = 0;
		question.question = this.$.questionText.getText();
		question.type = this.curType;
		if(question.type === "multiple_choice" || question.type === "exclusive_multiple_choice") {
			var tmp = this.options.pop();
			question.options = this.options.join("|");
			this.options.push(tmp);
			this.log(question.options);
		}
		return question;
	},
	makeOption: function(inSender, inEvent) {
		var index = inEvent.index;
		var item = inEvent.item;
		this.$.oItem.setBuilder(false);
		this.$.oItem.setFill(this.options[index]);
		if(index == this.options.length - 1)
			this.$.oItem.setBuilder(true);
		return true;
	},
	newOption: function(inSender, inEvent) {
		this.log();
	    	if(this.options.indexOf(inEvent.content) < 0) {
		    	var tmp = this.options.pop();
			this.options.push(inEvent.content);
			this.options.push(tmp);
			this.$.optionList.setCount(this.options.length);
			this.$.optionList.reset();
			//this.buildFakeQuestion();
		}
		//this.$.optionList.scrollToRow(this.options.length-2);
		//this.$.optionList.scrollToRow(this.options.length-1);
		return true;
	},
	lockList: function(inSender, inEvent) {
		this.$.optionList.lockRow();
		this.options[inEvent.index] = inEvent.content;
		//this.buildFakeQuestion();
	},
	questionPicked: function (inSender, inEvent) {
		//if (inEvent.originator.getActive()) {
		var e = inSender.eventNode;
		var type = e.options[e.selectedIndex].value;
		this.curType = this.decodeType(type);
		switch (this.curType) {
			case "multiple_choice":
				this.$.oItem.setType("checkbox");
				this.$.optionList.show();
				this.$.optionList.reset();
			break;
			case "exclusive_multiple_choice":
				this.$.oItem.setType("radio");
				this.$.optionList.show();
				this.$.optionList.reset();
			break;
			default:
				this.$.optionList.hide();
			break;
		}
	},
	recreate: function(inSender, inEvent) {
		this.log(this.questionData);
		this.$.questionText.setText(this.questionData.question);
		if(this.questionData.question.type === "multiple_choice" || this.questionData.question.type === "exclusive_multiple_choice") {
			this.options = this.questionData.options.split("|");
			this.$.optionList.setCount(this.options.length);
			this.$.optionList.show();
			this.$.optionList.reset();
		}
		this.$.questionChoices.hasNode().selectedIndex = this.recodeType(this.questionData.type);
	},
	remove: function(inSender, inEvent) {
		this.addRemoveClass("task-builder-destroy", true);
		return true;
	},
	removeActually: function(inSender, inEvent) {
		this.doDestroyedQuestion({step: this.$.stepTitle.getTitle(), question: this.$.questionTitle.getTitle()});
		this.destroy();
	},	
	saveData: function(inSender, inEvent) {
		//save logic goes here
		if(this.$.questionDrawer.getOpen())
			this.$.stepTitle.sendSave();
	},
	toggleQuestionDrawer: function(inSender, inEvent) {
		var truthy = this.$.questionDrawer.getOpen();
		this.$.questionDrawer.setOpen(!truthy);
		this.$.questionTitle.setTitle(this.$.questionTitle.getTitle() + " (saved)");
		return true;
	}
});
