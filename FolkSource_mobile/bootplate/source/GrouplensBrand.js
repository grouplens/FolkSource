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
		{style: "width: 100%; text-align: center; font-size: 8pt; color: #DB701E; padding-top: 10px; display: inline-block;", components: [
			{kind: "enyo.ToolDecorator", components: [
				{content: "Mappping provided by"},
				{kind: "enyo.Anchor", style: "color: #FFF; padding-left: 2px;", href: "http://leafletjs.com", title: "A JS library for interactive maps", attributes: {target: "_blank"}, components: [
					{content: "Leaflet"}
				]},
				{content: "."}
			]},
			{kind: "enyo.ToolDecorator", components: [
				{content: "Map tiles by"},
				{kind: "enyo.Anchor", title: "CartoDB", href: "http://cartodb.com/attributions#basemaps", style: "color: #FFF; padding-left: 2px; padding-right: 2px;", attributes: {target: "_blank"}, components: [
					{content: "CartoDB"}
				]},
				{content: "under"},
				{kind: "enyo.Anchor", title: "CC BY 3.0.", href: "https://creativecommons.org/licenses/by/3.0/", style: "color: #FFF;padding-left: 2px; padding-right: 2px;", attributes: {target: "_blank"}, components: [
					{content: "CC BY 3.0"}
				]},
				{content: "."}
			]},
			{kind: "enyo.ToolDecorator", components: [
				{content: "Data by"},
				{kind: "enyo.Anchor", title: "OpenStreetMap", href: "http://www.openstreetmap.org/", style: "color: #FFF; padding-left: 2px;", attributes: {target: "_blank"}, components: [
					{content: "OpenStreetMap"}
				]},
				{content: ", under ODbL."}
			]},
		]}
	],
	create: function(inSender, inEvent) {
		this.inherited(arguments);
	}
});
