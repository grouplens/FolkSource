enyo.kind({
	name: "GrouplensBrand",
	style: "width: 100%; height: 10em; font-size: 13pt !important;",
	components: [
    {kind: enyo.Image, src: "assets/folk_source_logo.png", style: "height: 6em; display: block; margin-left: auto; margin-right: auto;"},
		{content: "a ", style: "text-align: center; height: 1em; display: block;", classes: "dark-background"},
		{style: "width: 100%; display: block;", classes: "dark-background", components: [
			{kind: enyo.Image, src: "assets/GL-Logo.png", style: "height: 1em; margin-left: auto; margin-right: auto; display: block;", classes: "dark-background"},
		]},
		{content: "project", style: "text-align: center; height: 1em;", classes: "dark-background"},
	],
	create: function(inSender, inEvent) {
		this.inherited(arguments);
	}
});
