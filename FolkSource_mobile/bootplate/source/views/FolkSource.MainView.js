enyo.kind({
	name: "FolkSource.MainView",
	kind: "enyo.FittableRows",
	components: [
		{name: "bar", style: "height: 20px; display: none;"},
		{kind: "CSenseMenuPane", fit: true}
	],
	create: function(inSender, inEvent) {
		this.inherited(arguments);
		document.addEventListener("deviceready", enyo.bind(this, "startup"), false);
		this.startup();
	},
	rendered: function(inSender, inEvent) {
		this.inherited(arguments);
	},
	locSuccess: function (locData) {
		this.coords = locData.coords;
		enyo.Signals.send("onLocationFound", {coords: locData.coords});//doLocationFound();
  },
  locError: function (a, b) {
		enyo.Signals.send("onNoLocationFound");//doLocationFound();
	},
	startup: function(inSender, inEvent) {
		this.log("device ready");
		this.log(inSender);
		this.log(inEvent);
		/*if(enyo.platform.ios === 7 || enyo.platform.ios === 8) {
			this.$.bar.setShowing(true);
      this.$.bar.applyStyle("display", null);
		}*/
		this.gps_watch = navigator.geolocation.watchPosition(enyo.bind(this, "locSuccess"), enyo.bind(this, "locError"));
	},
});
