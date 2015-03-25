enyo.kind({
	name: "App",
	kind: enyo.FittableRows,
	components: [
<<<<<<< HEAD
        //{name: "gps", kind: "rok.geolocation", watch: true, enableHighAccuracy: false, timeout: 5000, maximumAge: 3000, onSuccess: "locSuccess", onError: "locError"},
		{name: "bar", style: "height: 20px;", showing: false},
=======
		{name: "bar", style: "height: 20px; display: none;"},
>>>>>>> refs/remotes/grouplens/master
		{kind: "CSenseMenuPane", fit: true}
	],
	create: function(inSender, inEvent) {
		this.inherited(arguments);
		this.log();
		if(enyo.platform.ios === 7) {
			this.$.bar.setShowing(true);
      this.$.bar.applyStyle("display", null);
		}
	},
	rendered: function(inSender, inEvent) {
		this.inherited(arguments);
<<<<<<< HEAD
		//navigator.geolocation.getCurrentPosition(enyo.bind(this, "locSuccess"), enyo.bind(this, "locError"), {timeout: 10000, enableHighAccuracy: false, maximumAge: 60000});
		this.gps_watch = navigator.geolocation.watchPosition(enyo.bind(this, "locSuccess"), enyo.bind(this, "locError"), {timeout: 5000, enableHighAccuracy: false});
	},	
=======
		this.gps_watch = navigator.geolocation.watchPosition(enyo.bind(this, "locSuccess"), enyo.bind(this, "locError"), {enableHighAccuracy: false, timeout: 5000, maximumAge: 30000});
    navigator.geolocation.getCurrentPosition(enyo.bind(this, "locSuccess"), enyo.bind(this, "locError"), {enableHighAccuracy: true, timeout: 5000, maximumAge: 30000});
	},
>>>>>>> refs/remotes/grouplens/master
	locSuccess: function (locData) {
		this.coords = locData.coords;
		this.log();
		enyo.Signals.send("onLocationFound", {coords: locData.coords});//doLocationFound();
<<<<<<< HEAD
		Data.setLocationData(this.coords);
    },
    locError: function (a, b) {
		this.log();
=======
  },
  locError: function (a, b) {
>>>>>>> refs/remotes/grouplens/master
		enyo.Signals.send("onNoLocationFound");//doLocationFound();
	},
});
