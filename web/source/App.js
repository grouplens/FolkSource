enyo.kind({
	name: "App",
	kind: "enyo.Panels",
	draggable: false,
	classes: "enyo-fit",
	handlers: {
		onGoHome: "goHome",
	},
	components:[
		{kind: "enyo.FittableColumns", components: [
			{kind: "enyo.FittableRows", fit: true, components: [
				{kind: "enyo.ToolDecorator", components: [
					{kind: enyo.Image, src: "./assets/a_folksource_logo.png", alt: "FolkSource logo", position: "center", style: "margin-left: auto; margin-right: auto; height: 25%;"},
					{content: "FolkSource", style: "font-size: 24pt; text-align: center;"}
				]},
				{content: "Check out our app in the app store for your device!", style: "text-align: center;"},
				{fit: true, components: [
					{kind: "enyo.FittableRows", style: "height: 50%;", components: [
						{tag: "i", classes: "icon icon-2x icon-apple", style: "display: block; text-align: center;"},
						{kind: "enyo.Image", style: "display: block; margin-left: auto; margin-right: auto; height: 80%; width: 80%; background-color: green;"}
					]},
					{kind: "enyo.FittableRows", style: "height: 50%;", components: [
						{tag: "i", classes: "icon icon-2x icon-android", style: "display: block; text-align: center;"},
						{kind: "enyo.Image", style: "display: block; margin-left: auto; margin-right: auto; height: 80%; width: 80%; background-color: blue;"}
					]},
				]},
				{kind: "onyx.Button", ontap: "showMap", style: "button-style-affirmative", style: "display: block; text-align: center; margin-left: auto; margin-right: auto; width: 80%;", content: "Check it Out!"}
			]},
			{kind: "enyo.FittableRows", style: "width: 70%;", components: [
				{kind: "enyo.FittableColumns", style: "background-color: orange;", fit: true, components: [
				]},
			]},
		]},
		{kind: "enyo.FittableRows", fit: true, components: [
			{kind: "ShowMap", fit: true}
		]}
		//{kind: "SaveTitledInput", fit: true}
	],
	goHome: function(inSender, inEvent) {
		this.setIndex(0);
		return;
	},
  rendered: function(inSender, inEvent) {
		this.inherited(arguments);
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
		this.setIndex(1);
		return;
	}
});
