enyo.kind({
    name: "App",
    kind: "enyo.FittableRows",
    components: [
        {kind: "enyo.Signals", ondeviceready: "deviceReady"}, 
        {kind: "CSenseMenuPane", fit: true}
		//{kind: "PullOut", fit: true}
        //{kind: "NavBar", fit: true, ios: true, android: false}
		/*{kind: "onyx.Button", style: "display: block; padding: 0 0; height: 49pt;", components: [
			{kind: "onyx.Icon", src: "assets/not_small.png", style: "clear: both;"},
			{tag: "br"},
			{content: "C", style: "clear: both;"}
		]}*/
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
