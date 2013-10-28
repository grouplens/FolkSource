enyo.kind({
	name: "GrouplensBrand",
	kind: enyo.FittableRows,
	style: "width: 100%; font-size: 11pt !important;",
	components: [
		{fit: true},
		{content: "a ", style: "text-align: center; height: 1em;", classes: "dark-background"},
		{style: "width: 100%;", classes: "dark-background", components: [
			{kind: enyo.Image, src: "assets/GL-Logo.png", style: "display: block !important; height: 1em; margin-left: auto; margin-right: auto;", classes: "dark-background"},
		]},
		{content: " project", style: "text-align: center; bottom: 0px;", classes: "dark-background"},
	],
	create: function(inSender, inEvent) {
		this.inherited(arguments);
	}
});
