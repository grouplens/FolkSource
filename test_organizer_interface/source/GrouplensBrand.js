enyo.kind({
	name: "GrouplensBrand",
	kind: enyo.FittableRows,
	style: "width: 100%; font-size: 11pt !important;",
	classes: "dark-background",
	components: [
		{fit: true}, 
		{content: "a ", style: "text-align: center;"},
		{kind: enyo.Image, src: "assets/GL-Logo.png", style: "display: block !important; height: 1em; margin-left: auto; margin-right: auto;"},
		{content: " project", style: "text-align: center;"},
	],
	create: function(inSender, inEvent) {
		this.inherited(arguments);
	}
});
