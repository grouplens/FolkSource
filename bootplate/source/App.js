enyo.kind({
    name: "App",
    //style: "",
    //classes: "enyo-fit"
    kind: "enyo.FittableRows",
    components: [
        {kind: "enyo.Signals", ondeviceready: "deviceReady"}, 
        {kind: "CSenseMenuPane", fit: true}
        //{kind: "BikeCounter"}
    ]
});
