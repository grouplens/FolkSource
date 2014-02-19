enyo.kind({
	name: "EditableListItem",
	kind: enyo.ToolDecorator,
	style: "width: 100%;",
	published: {
		type: "checkbox",
		fill: "Add new item, hit 'enter' to save",
		builder: false
	},
	events: {
		onDoneEditing: "",
		onMakeNew: ""
	},
	handlers: {
		ontap: "flip"
	},
	components:[
		{name: "input", kind: onyx.Input, type: "checkbox"},
		{name: "cont"},
		{name: "item2", kind: onyx.Input, placeholder: "Hit 'enter' to add an option", style: "width: 90%;", onchange: "save"}
	],
	create: function(inSender, inEvent) {
		this.inherited(arguments);
		this.$.cont.setContent(this.fill);
		this.$.input.setType(this.type);
		this.$.cont.setContent(this.fill);
		this.$.item2.hide();
	},
	flip: function(inSender, inEvent) {
		this.$.cont.hide();
		this.$.item2.show();
		this.$.item2.focus();
	},
	save: function(inSender, inEvent) {
		var value = this.$.item2.getValue();
		this.log(value);
		if(this.builder) {
			this.doMakeNew({content: value});
			this.log(true);
		} else {
			this.setFill(value);
			this.$.item2.hide();
			this.$.cont.show();
			this.doDoneEditing({content: this.fill});
			this.log(false);
		}
		return true;
	},
	builderChanged: function(oldInput) {
		if(this.builder)
			this.flip();
		else {
			this.$.item2.hide();
			this.$.cont.show();
		}
	},
	typeChanged: function(oldInput) {
		this.$.input.setType(this.type);
	},
	fillChanged: function(oldInput) {
		this.$.cont.setContent(this.fill);
	}
});
