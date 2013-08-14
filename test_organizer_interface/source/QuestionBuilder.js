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
		questionIndex: 1
	},
	components:[
		{name: "stepTitle", kind: "SaveTitle", title: "Step #", big: true},
		{name: "questionTitle", kind: "Title", title: "Question #"},
		{name: "questionDrawer", kind: onyx.Drawer, open: true, orient: "v", classes: "hanging-child", components: [
			{name: "questionText", kind: "TitledInput", title: "What's the question?", placeholder: "Enter your question text here..."/*, ontap: "toggleQuestionDrawer"*/},
			{kind: "Title", title: "Type of Question:" },
			{name: "questionChoices", tag: "select", classes: "hanging-child", components: [
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
	},
	editOption: function(inSender, inEvent) {
		var index = inEvent.index;
		this.$.optionList.prepareRow(index);
		this.$.oItem.flip();
		return true;
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
		if (inEvent.originator.getActive()) {
			this.curType = inEvent.originator.getContent();
		}
		switch (this.curType) {
			case "Mult. Choice":
				this.$.oItem.setType("checkbox");
				this.$.optionList.show();
				this.$.optionList.reset();
			break;
			case "Excl. Mult. Choice":
				this.$.oItem.setType("radio");
				this.$.optionList.show();
				this.$.optionList.reset();
			break;
			default:
				this.$.optionList.applyStyle("visibility", "hidden");
			break;
		}
	},
	saveData: function(inSender, inEvent) {
		//save logic goes here
		this.log();
		if(this.$.questionDrawer.getOpen())
			this.$.stepTitle.sendSave();
	},
	toggleQuestionDrawer: function(inSender, inEvent) {
		var truthy = this.$.questionDrawer.getOpen();
		this.$.questionDrawer.setOpen(!truthy);
		return true;
	}
});
