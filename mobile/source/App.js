enyo.kind({
	name: "App",
	kind: enyo.FittableRows,
	events: {
	},
	components: [
        //{name: "gps", kind: "rok.geolocation", watch: true, enableHighAccuracy: false, timeout: 5000, maximumAge: 3000, onSuccess: "locSuccess", onError: "locError"},
		{name: "bar", style: "height: 20px;", showing: false},
		//{kind: "TapMap", fit: true}
		{kind: "CSenseMenuPane", fit: true}
	],
	create: function(inSender, inEvent) {
		this.inherited(arguments);
		this.log();
		if(enyo.platform.ios === 7) {
			this.$.bar.setShowing(true);
		}
		//LocalStorage.remove("loc");
    window.addEventListener('load', function() {
      localStorage.clear();
    }, false);
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
});
