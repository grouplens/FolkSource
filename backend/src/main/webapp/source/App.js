enyo.kind({
	name: "App",
	kind: enyo.FittableRows,
	classes: "enyo-fit",
	components:[
		{kind: "ShowMap", fit: true}
		//{kind: "SaveTitledInput", fit: true}
	],
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

});
