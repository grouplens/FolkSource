enyo.kind({
	name: "FolkSource.MainView",
	kind: "enyo.FittableRows",
	classes: "enyo-fit",
	components:[
		{kind: "LandingPage", fit: true}
	],
  rendered: function(inSender, inEvent) {
		this.inherited(arguments);
	},
});
