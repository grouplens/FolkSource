enyo.kind({
	name: "CampaignHeader", 
	kind: enyo.FittableRows,
	published: {
	},
	events: {
		onTitleCollapsing: "",
		onDestroy: ""
	},
	components: [
		{classes: "standard-card", components: [
			{name: "campaignTitle", kind: "TitledInput", big: true, title: "Campaign Title", placeholder: "Campaign Title"},
			//{name: "campaignDesc", kind: "TitledTextArea", big: true, title: "Campaign Description", placeholder: "Please Describe your Campaign goals..."},
			{name: "campaignDesc", kind: "TitledInput", big: true, title: "Campaign Description", placeholder: "Please Describe your Campaign goals..."},
			{kind: "Title", big: true, title: "Tasks", instructions: "Create a task below (10 maximum). Tasks will be saved automatically.", classes: "nice-padding"},
		]},
	],
	create: function(inSender, inEvent) {
		this.inherited(arguments);
		this.render();
	},
	rendered: function(inSender, inEvent) {
		this.log(this.hasNode().offsetHeight);
	},	
});
