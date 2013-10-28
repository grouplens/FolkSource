enyo.kind({
    name: "NewMap",
	kind: enyo.FittableRows,
	//classes: "bordering-box light-background",
    published: {
        gpsTimeout: "10000"
    },
    components: [
        {name: "gps", kind: "rok.geolocation", watch: !0, enableHighAccuracy: !0,timeout: this.gpsTimeout, maximumAge: "3000", onSuccess: "locSuccess", onError: "locError"},
		{name: "spinUp", kind: onyx.Popup, centered: true, floating: true, autoDismiss: false, classes: "dark-background-flat", components: [
			{name: "spin", kind: onyx.Spinner, classes: "onyx-dark dark-background"}
		]},
		{content: "Tap the pin/region on the map to help!", style: "font-size: 11pt; font-weight: 100; text-align: center; padding: 3px;", classes: "dark-background"},
		{name: "mapCont", fit: true, style: "overflow: hidden; position: relative;"}
    ],
    events: {
        onLoaded: "",
        onPinClicked: "",
        onGPSSet: ""
    },
    eventStarted: !1,
    handlers: {
        onSnapping: "turnOffMap",
        onSnapped: "resetPins"
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
		this.pointsLayer = L.layerGroup();
		this.polygonsLayer = L.layerGroup();
    },
    rendered: function () {
		this.inherited(arguments);
		this.$.gps.getPosition();

		this.map = L.map(this.$.mapCont.id, {closePopupOnClick: false, maxZoom: 17}).setView([44.981313, -93.266569], 13);
		//L.tileLayer("http://acetate.geoiq.com/tiles/acetate-hillshading/{z}/{x}/{y}.png", {
		L.tileLayer("http://tile.stamen.com/watercolor/{z}/{x}/{y}.png", {}).addTo(this.map);
		L.tileLayer("http://tile.stamen.com/toner-lines/{z}/{x}/{y}.png", {}).addTo(this.map);
		L.tileLayer("http://tile.stamen.com/toner-labels/{z}/{x}/{y}.png", {
		/*L.tileLayer("http://{s}.mqcdn.com/tiles/1.0.0/map/{z}/{x}/{y}.jpg", {
			subdomains: ['otile1', 'otile2', 'otile3', 'otile4'],*/
			attribution: "Map data &copy; OpenStreetMap contributors",
		}).addTo(this.map);

		this.$.spin.start();
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
			this.userMarker = L.userMarker(latlng, {pulsing: true}).addTo(this.map);

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
		this.points = [];
		this.polygons = [];
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
	turnOffMap: function(inSender, inEvent) {
		this.log();
		/*for(x in this.pointsLayer) {
			this.map.removeLayer(this.pointsLayer[x]);
		}
		for(x in this.polygonsLayer) {
			this.map.removeLayer(this.polygonsLayer[x]);
		}*/
		this.pointsLayer.clearLayers();
		this.map.removeLayer(this.pointsLayer);
		this.polygonsLayer.clearLayers();
		this.map.removeLayer(this.polygonsLayer);
		//remove all markers
		/*for(x in this.points) {
			this.map.removeLayer(this.points[x]);
		}
		for (x in this.polygons) {
			this.map.removeLayer(this.polygons[x]);
		}*/
		this.$.spinUp.show();
	},
	resetPins: function(inSender, inEvent) {
		//re-create markers
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
			var points = [];
			var polygons = [];
			if(str.indexOf("POINT") != -1) {
				shape.on("click", enyo.bind(this, "makeBubbleClick"));
				shape.setIcon(new L.DivIcon({iconSize: new L.Point(27,91), html: "<i class=\"icon-map-marker icon-4x\"></i>", className: "map-pin"}));
				this.pointsLayer.addLayer(shape);
				//shape.addTo(this.map);
				points.push(shape);
			} else if (str.indexOf("POLYGON") != -1) {
				shape.on("click", enyo.bind(this, "makeBubbleClick"));
				this.polygonsLayer.addLayer(shape);
				//this.map.addLayer(shape);
				polygons.push(shape);
				//this.map.addLayer(shape);
				//polygon goes here
			} else {
				this.log("FAILED TO MAP");
			}

			/*if(!this.pointsLayer)
				this.pointsLayer = L.layerGroup(points);*/
			this.pointsLayer.addTo(this.map);

			/*if(!this.polygonsLayer)
				this.polygonsLayer = L.featureGroup(polygons);*/
			this.polygonsLayer.addTo(this.map);
			
		}
		this.$.spinUp.hide();
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
