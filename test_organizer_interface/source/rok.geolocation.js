enyo.kind({
    name: "rok.geolocation",
    kind: enyo.Component,
    events: {
        onSuccess: "",
        onError: ""
    },
    published: {
        maximumAge: 3e3,
        timeout: 1e4,
        enableHighAccuracy: !0,
        watch: !1
    },
    create: function () {
        this.inherited(arguments), this.watch ? this.watchPosition() : this.getPosition();
    },
    destroy: function () {
        this.watchId && this.stopWatchPosition(), this.inherited(arguments);
    },
    watchPosition: function () {
        var a = {
            maximumAge: this.maximumAge,
            timeout: this.timeout,
            enableHighAccuracy: this.enableHighAccuracy
        };
        this.watchId = navigator.geolocation.watchPosition(enyo.bind(this, "onPosition"), enyo.bind(this, "onFailure"), a);
    },
    stopWatchPosition: function () {
        navigator.geolocation.clearWatch(this.watchId), delete this.watchId, this.watch = !1;
    },
    getPosition: function () {
        var a = {
            maximumAge: this.maximumAge,
            timeout: this.timeout,
            enableHighAccuracy: this.enableHighAccuracy
        };
        navigator.geolocation.getCurrentPosition(enyo.bind(this, "onPosition"), enyo.bind(this, "onFailure"), a);
    },
    onPosition: function (a) {
        var b = {};
        b.timestamp = new Date(a.timestamp), b.coords = a.coords, this.doSuccess(b);
    },
    onFailure: function (a) {
        this.doError(a);
    },
    watchChanged: function () {
        this.watch ? this.watchPosition() : this.stopWatchPosition();
    }
});
