enyo.kind({
    name: "App",
    kind: "enyo.FittableRows",
    components: [
        {kind: "enyo.Signals", ondeviceready: "deviceReady"}, 
        {kind: "CSenseMenuPane", fit: true}
        //{kind: "Timer", fit: true}
    ],
    create: function(inSender, inEvent) {
        this.inherited(arguments);
        LocalStorage.remove("loc");
    }
});
