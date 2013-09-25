enyo.kind({
	name: "QuestionBuilder",
	events: {
	},
	handlers: {
		onDoneEditing: "lockList",
		onMakeNew: "newOption",
		onTitleCollapsing: "toggleQuestionDrawer",
		onNewStep: "saveData"
	},
	published: {
		stepIndex: 1,
		questionIndex: 1,
		questionData: null
	},
	components:[
		{name: "stepTitle", kind: "SaveTitle", title: "#", circled: true, big: true},
		{name: "questionTitle", kind: "Title", title: "Question #", classes: "hanging-child"},
		{name: "questionDrawer", kind: onyx.Drawer, open: true, orient: "v", classes: "hanging-child", components: [
			{name: "questionText", kind: "TitledInput", title: "What's the question?", placeholder: "Enter your question text here..."/*, ontap: "toggleQuestionDrawer"*/},
			{kind: "Title", title: "Type of Question:" },
			{name: "questionChoices", tag: "select", classes: "hanging-child", onchange: "questionPicked", components: [
				{content: "Text", tag: "option" },
				{content: "Mult. Choice", tag: "option" },
				{content: "Excl. Mult. Choice", tag: "option" },
				{content: "Counter", tag: "option" },
			]}, 
	    		{name: "optionList", kind: enyo.List, style: "height: 100px;", count: 1, showing: false, ontap: "editOption", onSetupItem: "makeOption", components: [
				{kind: "EditableListItem", name: "oItem" }
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
	decodeType: function(inType) {
		var outType = ""
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
		question.question = this.$.questionText.getData();
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
				this.$.optionList.hide();;
			break;
		}
	},
	saveData: function(inSender, inEvent) {
		//save logic goes here
		if(this.$.questionDrawer.getOpen())
			this.$.stepTitle.sendSave();
	},
	toggleQuestionDrawer: function(inSender, inEvent) {
		var truthy = this.$.questionDrawer.getOpen();
		this.$.questionDrawer.setOpen(!truthy);
		return true;
	}
});
