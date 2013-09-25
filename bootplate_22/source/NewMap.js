enyo.kind({
    name: "NewMap",
	kind: enyo.FittableRows,
	//classes: "bordering-box light-background",
    published: {
        gpsTimeout: "10000"
    },
    components: [
        {name: "gps", kind: "rok.geolocation", watch: !0, enableHighAccuracy: !0,timeout: this.gpsTimeout, maximumAge: "3000", onSuccess: "locSuccess", onError: "locError"},
		{content: "Tap the pin/region on the map to help!", style: "font-size: 11pt; font-weight: 200;", classes: "bordering-box light-background"},
		{name: "mapCont", fit: true, style: "overflow: hidden; position: relative;"}
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
		this.locSuc = false;
		this.loaded = false;
    },
    rendered: function () {
		this.inherited(arguments);
		this.$.gps.getPosition();

		this.map = L.map(this.$.mapCont.id, {closePopupOnClick: false, maxZoom: 17}).setView([44.981313, -93.266569], 13);
		L.tileLayer("http://acetate.geoiq.com/tiles/acetate-hillshading/{z}/{x}/{y}.png", {
			attribution: "Map data &copy; OpenStreetMap contributors"
		}).addTo(this.map);


	},
	mapLoaded: function() {
		this.loaded = true;
		this.log(this.loaded);
		this.doLoaded();
	},
	locSuccess: function (a, b) {
		Data.setLocationData(b.coords);
		this.locSuc = true;
		if(this.locSuc && !this.loaded && !this.panZoomed) {
			this.centerMap();
		}
		var latlng = new L.LatLng(b.coords.latitude, b.coords.longitude);

		if(this.locSuc && !this.loaded && !this.panZoomed) {
			this.centerMap();
		}
		if (!this.userMarker)
			this.userMarker = L.userMarker(latlng, {pulsing: true, smallIcon: true}).addTo(this.map);

		this.userMarker.setLatLng(latlng);
		this.userMarker.setAccuracy(b.coords.accuracy);

        return true;
    },
    locError: function (a, b) {
		this.log();
	},
	checkMap: function (a) {
		this.locPlot(a);
	},
	locPlot: function (a) {
		this.locations = a;
		this.addMarkers();
	   },
	inside: function (a) {
		/*var b = this.straction.getBounds().getNorthEast(),
		c = this.straction.getBounds().getSouthWest();
		return a[1] <= b.lat && a[1] >= c.lat && a[0] <= b.lon && a[0] >= c.lon ? !0 : !1;*/
	},
	toggleVisible: function (a, b) {
		/*var c = this.parent.parent.getIndex(),
		d = this.id.split("_"),
		e = d[d.length - 1],
		f = this.parent.parent.getPanels()[c].id.split("_"),
		g = f[f.length - 1];
		return this.addRemoveClass("hideMap", e !== g), !0;*/
	},
	makeFilter: function () {
		if(this.loaded)
			this.panZoomed = true;
		this.addMarkers();
	},
	addMarkers: function () {
		var wkt = new Wkt.Wkt();
		for(x in this.locations) {
			var str = this.locations[x].geometryString;
			wkt.read(str);
			var shape = wkt.toObject();
			if(str.indexOf("POINT") != -1) {
				shape.addTo(this.map);
			} else if (str.indexOf("POLYGON") != -1) {
				this.map.addLayer(shape);
				//polygon goes here
			} else {
				this.log("FAILED TO MAP");
			}
			shape.on("click", enyo.bind(this, "makeBubbleClick"));
			this.log(wkt.components);
		}
	},
	centerMap: function () {
		var myLocation = Data.getLocationData();
		this.log(myLocation);
		this.map.setView([myLocation.latitude, myLocation.longitude], 15);
		if(!this.loaded)
			this.mapLoaded();
	},
	makeBubbleClick: function (inEvent) {
		loc = inEvent.latlng;
		loc.lat = loc.lat.toPrecision(8);
		loc.lng = loc.lng.toPrecision(8);
		enyo.Signals.send("onPinClicked", loc);
	},
	makeButtonBubbleClick: function(inEvent) {
		this.log(Data.getLocationData());
		enyo.Signals.send("onPinClicked", Data.getLocationData());
	},
	makeBubbleLoad: function () {
		loaded = !0;
		this.doLoaded();
	},
});
