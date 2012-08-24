enyo.kind({
    name: "App",
    style: "height: 100%; width: 100%;",
    components: [{
        kind: "Signals",
        ondeviceready: "deviceReady"
    }, {
        kind: "CSenseMenuPane"
    }]
});
