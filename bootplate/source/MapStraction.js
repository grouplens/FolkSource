enyo.kind({
    name: "MapStraction",
    classes: "mapItem hideMap",
    //style: "overflow: hidden; z-index: 5;",
    published: {
        provider: "googlev3",
        gpsTimeout: "10000"
    },
    components: [
        {name: "gps", kind: "rok.geolocation", watch: !0, enableHighAccuracy: !0,timeout: this.gpsTimeout, maximumAge: "3000", onSuccess: "locSuccess", onError: "locError"},
    ],
    events: {
        onLoaded: "",
        onPinClicked: "",
        onGPSSet: ""
    },
    eventStarted: !1,
    handlers: {
        onSnapping: "toggleVisible",
        onSnapped: "toggleVisible"
    },
    create: function (a) {
        this.inherited(arguments);
        this.$.gps.setTimeout(this.gpsTimeout);
        userMoved = false;
        loaded = false;
        this.panZoomed = false;
        this.firstTime = true;
        this.notShowing = true;
    },
    rendered: function () {
        this.straction = new mxn.Mapstraction(this.id, this.provider);
        this.straction.addControls({zoom: "mobile"});
        this.straction.load.addHandler(enyo.bind(this, "makeBubbleLoad"));
		this.straction.changeZoom.addHandler(enyo.bind(this, "makeFilter"));
		this.straction.endPan.addHandler(enyo.bind(this, "makeFilter"));
		this.inherited(arguments);
		this.$.gps.getPosition();
    },
    locSuccess: function (a, b) {
		Data.setLocationData(b.coords);
        /*this.myLocation = b.coords;
		this.log(this.myLocation);
        enyo.Signals.send("onGPSSet", {prop: this.myLocation});*/
        if(!this.panZoomed) {
            this.centerMap();
        }
        return true;
    },
    locError: function (a, b) {
		this.log();
	},
    checkMap: function (a) {
        this.straction.markers.length !== a.split("|").length && (this.locPlot(a), this.makeFilter());
    },
    locPlot: function (a) {
        this.locations = a.split("|"), !(this.locations instanceof Array && this.locations.length > 2), this.makeFilter();
    },
    inside: function (a) {
        var b = this.straction.getBounds().getNorthEast(),
            c = this.straction.getBounds().getSouthWest();
        return a[1] <= b.lat && a[1] >= c.lat && a[0] <= b.lon && a[0] >= c.lon ? !0 : !1;
    },
    toggleVisible: function (a, b) {
        var c = this.parent.parent.getIndex(),
            d = this.id.split("_"),
            e = d[d.length - 1],
            f = this.parent.parent.getPanels()[c].id.split("_"),
            g = f[f.length - 1];
        return this.addRemoveClass("hideMap", e !== g), !0;
    },
    makeFilter: function () {
        this.panZoomed = true;
        var a = this.straction.getBounds().getNorthEast(),
            b = this.straction.getBounds().getSouthWest();
        return this.straction.removeAllFilters(), this.straction.addFilter("lat", "ge", b.lat), this.straction.addFilter("lat", "le", a.lat), this.straction.addFilter("lon", "ge", b.lon), this.straction.addFilter("lon", "le", a.lon), this.addMarkers(), !0;
    },
    addMarkers: function () {
        if (this.locations instanceof Array && this.locations.length != this.straction.markers.length) {
            for (x in this.locations) {
                var a = this.locations[x].split(",");
                var b = new mxn.Marker(new mxn.LatLonPoint(a[1], a[0]));
                b.addData({hover: false});
                b.setAttribute("lat", a[1]);
                b.setAttribute("lon", a[0]);
                b.click.addHandler(function (a, b) {enyo.Signals.send("onPinClicked", b.location);});
                b.click.addHandler(enyo.bind(this, "makeBubbleClick")), this.straction.addMarker(b);
            }
        }
    },
    centerMap: function () {
		var myLocation = Data.getLocationData();
		var a = new mxn.LatLonPoint(myLocation.latitude, myLocation.longitude);
		this.straction.setCenterAndZoom(a, 15);
    },
    makeBubbleClick: function (a, b) {
        enyo.Signals.send("onPinClicked", b.location);
    },
    makeBubbleLoad: function () {
        loaded = !0;
		this.doLoaded();
    }
});
