enyo.kind({
	name: "Title", 
	kind: enyo.FittableRows,
	published: {
		title: "Title Goes Here",
		big: false,
		save: false,
		instructions: ""
	},
	events: {
		onTitleCollapsing: "",
		onDestroy: ""
	},
	components: [
		{name: "cont", kind: enyo.FittableColumns, components: [
			{name: "savedIndicator", tag: "i", classes: "icon-ok-sign icon-large", attributes: {title: "Saved"}, showing: false},
			{name: "titleText", style: "font-size: 12pt;", fit: true},
			{name: "cancelButton", tag: "i", classes: "icon-remove icon-large hilight-icons-negative", attributes: {title: "Delete"}, ontap: "remove"},
			{name: "okButton", tag: "i", classes: "icon-ok icon-large hilight-icons-affirmative", attributes: {title: "Save"}, ontap: "sendSave"},
			{name: "editButton", tag: "i", classes: "icon-pencil hilight-icons-affirmative", attributes: {title: "Edit"}, showing: false, ontap: "sendSave"}

		]},
		{name: "instructions", content: "", showing: false, style: "font-size: 10pt; padding-top: 7px;"},
	],
	create: function(inSender, inEvent) {
		this.inherited(arguments);
		this.$.titleText.setContent(this.title);
		this.$.cont.addRemoveClass("text-title-small", !this.big);
		this.$.cont.addRemoveClass("text-title-big", this.big);
		this.$.okButton.setShowing(this.save);
		this.$.cancelButton.setShowing(this.save);
		if(this.instructions.length > 0) {
			this.$.instructions.setContent(this.instructions);
			this.$.instructions.setShowing(true);
		}
	},
	bigChanged: function(inSender, inEvent) {
		this.$.cont.addRemoveClass("text-title-small", !this.big);
		this.$.cont.addRemoveClass("text-title-big", this.big);
	},
	titleChanged: function(inSender, inEvent) {
		this.$.titleText.setContent(this.title);
	},
	remove: function(inSender, inEvent) {
		this.doDestroy();
	},
	saveChanged: function(inSender, inEvent) {
		this.$.okButton.setShowing(this.save);
		this.$.cancelButton.setShowing(this.save);
	},
	instructionsChanged: function(inSender, inEvent) {
		if(this.instructions.length > 0) {
			this.$.instructions.setContent(this.instructions);
			this.$.instructions.setShowing(true);
		} else {
			this.$.instructions.setShowing(false);
		}
	},
	sendSave: function(inSender, inEvent) {
		this.doTitleCollapsing();
		if(this.save) {
			this.$.savedIndicator.setShowing(!this.$.savedIndicator.showing);
			this.$.cancelButton.setShowing(!this.$.cancelButton.showing);
			this.$.okButton.setShowing(!this.$.okButton.showing);
		}
		this.$.editButton.setShowing(!this.$.editButton.showing);
		this.$.cont.render();
		return true;
	}
});
