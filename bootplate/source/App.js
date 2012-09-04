enyo.kind({
    name: "App",
    kind: "enyo.FittableRows",
    components: [
        {kind: "enyo.Signals", ondeviceready: "deviceReady"}, 
        {kind: "CSenseMenuPane", fit: true}
        //{kind: "BikeCounter"}
    ]
});
