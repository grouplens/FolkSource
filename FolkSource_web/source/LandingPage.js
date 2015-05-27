enyo.kind({
	name: "LandingPage",
	kind: "enyo.FittableRows",
	draggable: false,
	classes: "enyo-fit",
	components:[
		{name: "landingPanels", kind: "enyo.Panels", arrangerKind: "enyo.CollapsingArranger", fit: true, onTransitionFinish: "handleEndTransition", components: [
			{name: "landingPage", style: "width: 100%;", kind: "enyo.FittableRows", components: [
				{name: "landingToolbar", kind: onyx.Toolbar, layoutKind: enyo.FittableColumnsLayout, classes: "dark-background-flat", components: [
					{fit: true},
					{kind: "enyo.ToolDecorator", ontap: "showMap", components: [
						{content: "FolkSource"},
						{kind: enyo.Image, src: "./assets/a_folksource_logo.png", alt: "FolkSource logo", position: "center", style: "height: 60px;"},
						{tag: "i", classes: "fa fa-3x fa-chevron-right"},
					]},
				]},
				{kind: "enyo.FittableRows", fit: true, components: [
					{kind: "enyo.FittableColumns", style: "height: 70%;", components: [
						{kind: "enyo.FittableRows", style: "background-color: orange;", fit: true, components: [
							{fit: true}
						]},
					]},
					{kind: "enyo.ToolDecorator", layoutKind: "enyo.FittableColumnsLayout", fit: true, style: "width: 100%;", components: [
						{content: "Check out our app in the app store for your device!", style: "text-align: center; padding-top: 8%; width: 33%;"},
						{/*kind: "enyo.ToolDecorator", */style: "width: 33%;", components: [
							{tag: "i", classes: "icon icon-2x icon-apple"},
							{kind: "enyo.Image", style: "display: block; padding-top: 5%; margin: auto; height: 80%; width: 80%; background-color: green;"}
						]},
						{/*kind: "enyo.ToolDecorator", */style: "width: 33%;", components: [
							{tag: "i", classes: "icon icon-2x icon-android", style: "display: block; text-align: center;"},
							{kind: "enyo.Image", style: "display: block; padding-top: 5%; margin: auto; height: 80%; width: 80%; background-color: blue;"}
						]},
					]},
				]},
			]},
			{name: "mapPage", kind: "enyo.FittableRows", components: [
				{name: "mapToolbar", kind: onyx.Toolbar, layoutKind: enyo.FittableColumnsLayout, classes: "dark-background-flat", components: [
					{kind: "enyo.ToolDecorator", ontap: "goHome", components: [
						{tag: "i", classes: "fa fa-3x fa-chevron-left"},
						{kind: enyo.Image, src: "./assets/a_folksource_logo.png", alt: "FolkSource logo", position: "center", style: "height: 60px;"},
						{name: "showButton", kind: onyx.Button, showing: false, classes: "button-style light-background", disabled: true, ontap: "showCampaigns", attributes: {title: "Click here to see campaigns and their submissions."}, components: [
							{name: "spin", showing: true, tag: "i", classes: "fa fa-refresh fa-spin"},
							{name: "menuIcon", tag: "i", classes: "fa fa-list-ul fa-large"}
						]},
					]},
					{name: "brand", kind: "GrouplensBrand", fit: true},
					/*{content: "Logged in as: "},
					{name: "username", content: "anonymous"},
					{name: "newButton", kind: onyx.Button, classes: "button-style light-background", showing: true, ontap: "showNewMap", attributes: {title: "Click here to create a new campaign"}, components: [
						{tag: "i", classes: "fa fa-plus fa-large"}
					]},
					{kind: enyo.FittableColumns, components: [
						{name: "cancelButton", kind: onyx.Button, classes: "light-background button-style-negative", attributes: {title: "Cancel the campaign you were making."}, style: "width: 50%;", showing: false, ontap: "doubleCheckCancel", components: [
							{tag: "i", classes: "fa fa-ban-circle fa-large"},
						]},
						{name: "saveButton", kind: onyx.Button, classes: "light-background button-style-affirmative", attributes: {title: "Finish the campaign you were making."}, style: "width: 50%;", showing: false, ontap: "doubleCheckSend", components: [
							{tag: "i", classes: "fa fa-ok fa-large"},
						]}
					]}*/
				]},
				{kind: "ShowMap", fit: true}
			]}
		]},
		//{kind: "SaveTitledInput", fit: true}
	],
	goHome: function(inSender, inEvent) {
		this.log("HOME");
		this.$.landingPanels.setIndex(0);
		return;
	},
	handleEndTransition: function(inSender, inEvent) {
		if(inEvent.toIndex === 1) {
			this.$.showMap.map.invalidateSize();
		}
	},
  rendered: function(inSender, inEvent) {
		this.inherited(arguments);
		this.resize();
		//navigator.geolocation.getCurrentPosition(enyo.bind(this, "locSuccess"), enyo.bind(this, "locError"), {timeout: 10000, enableHighAccuracy: false, maximumAge: 60000});
		this.gps_watch = navigator.geolocation.watchPosition(enyo.bind(this, "locSuccess"), enyo.bind(this, "locError"), {timeout: 5000, enableHighAccuracy: false});
	},
	locSuccess: function (locData) {
		//Data.setLocationData(b.coords);
		this.coords = locData.coords;
		this.log();
		enyo.Signals.send("onLocationFound", {coords: locData.coords});//doLocationFound();
		Data.setLocationData(this.coords);
  },
  locError: function (a, b) {
		this.log();
		enyo.Signals.send("onNoLocationFound");//doLocationFound();
	},
	showMap: function(inSender, inEvent) {
		this.$.landingPanels.setIndex(1);
		return;
	}
});
