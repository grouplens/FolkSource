enyo.kind({
	name: "App",
	kind: enyo.FittableRows,
	components: [
        	{kind: "enyo.Signals", ondeviceready: "deviceReady"}, 
			{kind: "CSenseMenuPane", fit: true}
	],
	create: function(inSender, inEvent) {
		this.inherited(arguments);
		this.log(LocalStorage.get("user"));
		this.log(LocalStorage.get("points"));
		LocalStorage.remove("loc");
	},
	deviceReady: function(inSender, inEvent) {
		Data.setIsReady(true);
		this.log(Data.getIsReady());
	}
});
