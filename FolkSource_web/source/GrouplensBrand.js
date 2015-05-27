enyo.kind({
	name: "GrouplensBrand",
	//style: "font-size: 13pt !important;",
	components: [
		{content: "a ", style: "text-align: center; height: 1em; display: block;", classes: "dark-background"},
		{style: "width: 100%; display: block;", classes: "dark-background", components: [
			{kind: "enyo.Image", src: "assets/GL-Logo.png", style: "height: 1em; margin-left: auto; margin-right: auto; display: block;", classes: "dark-background"},
		]},
		{content: "project", style: "text-align: center; height: 1em;", classes: "dark-background"},
	],
	create: function(inSender, inEvent) {
		this.inherited(arguments);
	}
});
