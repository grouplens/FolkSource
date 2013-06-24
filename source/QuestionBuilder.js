enyo.kind({
	name: "QuestionBuilder",
	events: {
	},
	handlers: {
		onDoneEditing: "lockList",
		onMakeNew: "newOption"
	},
	published: {
	    	index: 1
	},
	components:[
	    	{name: "questions", content: "Question", kind: enyo.Node, expanded: true, onlyIconExpands: true, expandable: true, icon: "assets/question.png", components: [
			{name: "questionText", kind: onyx.Input, style: "width: 100%;", placeholder: "Enter your question text here..."},
			{content: "Type of Question:" },
			{name: "questionChoices", kind: onyx.RadioGroup, ontap: "questionPicked", components: [
				{content: "Text" },
				{content: "Mult. Choice" },
				{content: "Excl. Mult. Choice" },
				{content: "Counter" },
			]}, 
	    		{name: "optionList", kind: enyo.List, style: "height: 100px;", count: 1, showing: false, ontap: "editOption", onSetupItem: "makeOption", components: [
				{kind: "EditableListItem", name: "oItem" }
			]}
		]}
	],
	create: function(inSender, inEvent) {
	    	this.inherited(arguments);
		this.options = ["Add new option, hit 'enter' to save"];
		this.$.questions.setContent("Question " + this.index);
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
});
