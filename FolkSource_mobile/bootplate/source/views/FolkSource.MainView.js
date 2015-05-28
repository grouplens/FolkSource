enyo.kind({
	name: "FolkSource.MainView",
	kind: "enyo.FittableRows",
	components: [
		{name: "bar", style: "height: 20px; display: none;"},
		{kind: "CSenseMenuPane", fit: true}
	],
	create: function(inSender, inEvent) {
		this.inherited(arguments);
		if(enyo.platform.ios === 7 || enyo.platform.ios === 8) {
			this.$.bar.setShowing(true);
      this.$.bar.applyStyle("display", null);
		}
	},
	rendered: function(inSender, inEvent) {
		this.inherited(arguments);
		this.gps_watch = navigator.geolocation.watchPosition(enyo.bind(this, "locSuccess"), enyo.bind(this, "locError"));
		navigator.geolocation.getCurrentPosition(enyo.bind(this, "locSuccess"), enyo.bind(this, "locError"));
	},
	locSuccess: function (locData) {
		this.coords = locData.coords;
		enyo.Signals.send("onLocationFound", {coords: locData.coords});//doLocationFound();
  },
  locError: function (a, b) {
		enyo.Signals.send("onNoLocationFound");//doLocationFound();
	},
});
