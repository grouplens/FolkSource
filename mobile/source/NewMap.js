enyo.kind({
    name: "NewMap",
	kind: enyo.FittableRows,
	//classes: "bordering-box light-background",
    published: {
        gpsTimeout: "10000"
    },
    components: [
		{kind: enyo.Signals, onLocationFound: "locSuccess"},
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
        onSnapped: "resetPins",
    },
    create: function (a) {
        this.inherited(arguments);
        //this.$.gps.setTimeout(this.gpsTimeout);
        userMoved = false;
        loaded = false;
        this.panZoomed = false;
        this.firstTime = true;
        this.notShowing = true;
		this.locSuc = false;
		this.loaded = false;
		this.pointsLayer = L.featureGroup();
		this.polygonsLayer = L.featureGroup();
    },
    rendered: function () {
		this.inherited(arguments);
		//this.$.gps.getPosition();

		this.map = L.map(this.$.mapCont.id, {maxZoom: 17}).setView([44.981313, -93.266569], 13);
		L.tileLayer("http://tile.stamen.com/toner-lite/{z}/{x}/{y}.png", {
			attribution: "Map tiles by Stamen Design, under CC BY 3.0. Data by OpenStreetMap, under CC BY SA.",
		}).addTo(this.map);

		this.$.spin.start();
	},
	mapLoaded: function() {
		this.loaded = true;
		this.log(this.loaded);
		this.doLoaded();
	},
	locSuccess: function (a, b) {
		//alert("MAP success");
		var coords = b.coords;
		if(this.locSuc && !this.loaded && !this.panZoomed) {
			this.centerMap();
		}
		var latlng = new L.LatLng(coords.latitude, coords.longitude);

		if(this.locSuc && !this.loaded && !this.panZoomed) {
			this.centerMap();
		}
		if (!this.userMarker)
			this.userMarker = L.userMarker(latlng, {pulsing: true}).addTo(this.map);

		this.userMarker.setLatLng(latlng);
		this.userMarker.setAccuracy(coords.accuracy);
		this.resized();

        return true;
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
		this.log("start");
		for(var x in this.locations) {
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
				shape.setStyle({color: "#2E426F"});
				this.polygonsLayer.addLayer(shape);
				//this.map.addLayer(shape);
				polygons.push(shape);
				//this.map.addLayer(shape);
				//polygon goes here
			} else {
				this.log("FAILED TO MAP");
			}

		}
		this.pointsLayer.addTo(this.map);

		this.polygonsLayer.addTo(this.map);

		this.$.spinUp.hide();
		var bounds = this.polygonsLayer.getBounds();
		if(bounds)
			bounds.extend(this.pointsLayer.getBounds());
		else
			bound = this.pointsLayer.getBounds();
		if(this.userMarker !== undefined)
			bounds.extend(this.userMarker.getLatLng());
		var lat = (bounds._northEast.lat + bounds._southWest.lat) / 2;
		var lng = (bounds._northEast.lng + bounds._southWest.lng) / 2;
		this.map.fitBounds(bounds);
		//this.map.panTo([lat, lng], {animate: true});
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
