enyo.kind({
	name: "GrouplensBrand",
	style: "width: 100%; height: 10em; font-size: 13pt !important;",
	components: [
    {kind: "enyo.Image", src: "assets/logos/folk_source_logo.png", style: "height: 3em; display: block; margin-left: auto; margin-right: auto;"},
		{content: "a ", style: "text-align: center; height: 1em; display: block;", classes: "dark-background"},
		{style: "width: 100%; display: block;", classes: "dark-background", components: [
			{kind: "enyo.Image", src: "assets/logos/GL-Logo.png", style: "height: 1em; margin-left: auto; margin-right: auto; display: block;", classes: "dark-background"},
		]},
		{content: "project", style: "text-align: center; height: 1em;", classes: "dark-background"},
    {kind: "enyo.FittableColumns", style: " width: 100%; display: block; margin-left: auto; margin-right: auto; font-size: 9pt; color: #DB701E;", components: [
    {content: "Map tiles by "},
    {tag: "a", content: "CartoDB ", style: "color: #FFF;", attributes: {href: "http://cartodb.com/attributions#basemaps", target: "_blank"}},
    {content: "under "},
    {tag: "a", content: "CC BY 3.0.", style: "color: #FFF;", attributes: {href: "https://creativecommons.org/licenses/by/3.0/"}},
    ]},
    {kind: "enyo.ToolDecorator", style: "margin-left: auto; margin-right: auto; font-size: 9pt; color: #DB701E;", components: [
    {content: "Data by "},
    {tag: "a", content: "OpenStreetMap", style: "color: #FFF;", attributes: {href: "http://www.openstreetmap.org/"}},
    {content: ", under ODbL."}
    ]},
	],
	create: function(inSender, inEvent) {
		this.inherited(arguments);
	}
});
