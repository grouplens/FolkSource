enyo.kind({
    name: "NewMap",
    //classes: "mapItem hideMap",
    //style: "overflow: hidden; z-index: 5;",
	fit: true,
    published: {
        gpsTimeout: "10000"
    },
    components: [
        {name: "gps", kind: "rok.geolocation", watch: !0, enableHighAccuracy: !0,timeout: this.gpsTimeout, maximumAge: "3000", onSuccess: "locSuccess", onError: "locError"},
	//{kind: "enyo.FittableRows", classes: "mapItem", name: "rows", components: [
	    {name: "obsButton", kind: "onyx.Button", content: "Make an Observation", ontap: "makeButtonBubbleClick", style: "clear: both; width: 100%;"},
	    {name: "mapCont", style: "height: 100%;"}
	//]}
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

	this.straction = new OpenLayers.Map(this.$.mapCont.id);

	//get rid of the OSM attribution for now
	var c = this.straction.getControlsBy("displayClass", "olControlAttribution");
	this.straction.removeControl(c[0]);

	var osm = new OpenLayers.Layer.OSM("OSM", null, {transitionEffect: "resize"});
	this.pointsLayer = new OpenLayers.Layer.Vector('points', {
		styleMap: new OpenLayers.StyleMap({
			externalGraphic: "assets/pin2.png",
	    		graphicOpacity: 1.0,
	    		graphicHeight: 44,
	    		graphicWidth: 44
		}),
		projection: "EPSG:900913"
	});
	//registerEvents(this.pointsLayer);

	//add the layers
	this.straction.addLayers([osm, this.pointsLayer]);
	
	this.select = new OpenLayers.Control.SelectFeature(this.pointsLayer, {autoActivate: true, onSelect: enyo.bind(this, this.makeBubbleClick)});
	var nav = new OpenLayers.Control.TouchNavigation({dragPanOptions: {enableKinetic: true}});
	var zoom = new OpenLayers.Control.Zoom();

	//add the controls
	this.straction.addControls([nav, zoom, this.select]);

	//register events
	this.straction.events.register("zoomend", this.straction, this.makeFilter());
	this.straction.events.register("moveend", this.straction, this.makeFilter());
	/*this.straction.events.register("zoomend", this.straction, enyo.bind(this, "makeFilter"));
	this.straction.events.register("moveend", this.straction, enyo.bind(this, "makeFilter"));*/
	//this.straction.events.register("loadend", this.straction, enyo.bind(this, "mapLoaded"));

	//this.centerMap();
	//this.straction.raiseLayer('points', 500);
	//this.log(this.straction.getProjection());
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
        return true;
    },
    locError: function (a, b) {
	this.log();
	},
    checkMap: function (a) {
        this.locPlot(a);
    },
    locPlot: function (a) {
	this.locations = a;//.split("|");
	var pattern = /-\d+\.\d+,\d+\.\d+/;
	if (this.locations.match(pattern) != null) {
	    this.log(this.locations);
	    this.locations = this.locations.split("|");
	    this.addMarkers();
	    this.$.obsButton.addStyles("display: none;");
	}
        //this.locations = a.split("|"), !(this.locations instanceof Array && this.locations.length > 2), this.makeFilter();
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
	if(this.loaded)
	    this.panZoomed = true;
	this.addMarkers();
        /*var a = this.straction.getBounds().getNorthEast(),
            b = this.straction.getBounds().getSouthWest();
        return this.straction.removeAllFilters(), this.straction.addFilter("lat", "ge", b.lat), this.straction.addFilter("lat", "le", a.lat), this.straction.addFilter("lon", "ge", b.lon), this.straction.addFilter("lon", "le", a.lon), this.addMarkers(), !0;*/
    },
    addMarkers: function () {
        if (this.locations instanceof Array/* && this.locations.length != this.straction.markers.length*/) {
	    this.pointsLayer.removeAllFeatures();
            for (x in this.locations) {
		var a = this.locations[x].split(",");
		var b = this.convertXYToLonLat(a[0], a[1]);
		var pt = new OpenLayers.Geometry.Point(b.lon, b.lat);
		this.pointsLayer.addFeatures([new OpenLayers.Feature.Vector(pt/*, {styleMap: new OpenLayers.StyleMap({externalGraphic: "assets/pin2.png"})}*/)]);
		/*b.addData({hover: false});
		b.setAttribute("lat", a[1]);
		b.setAttribute("lon", a[0]);*/
	    }
	    this.pointsLayer.refresh();
	    this.pointsLayer.display();
	    this.straction.addLayer(this.pointsLayer);
        }
    },
    centerMap: function () {
	var myLocation = Data.getLocationData();
	var pt = this.convertCoordsToLonLat(myLocation);
	this.straction.setCenter(pt, 15);//, true, true);
	if(!this.loaded)
	    this.mapLoaded();
    },
    makeBubbleClick: function (mapGeometry) {
	var pt = this.convertLonLatToCoords(mapGeometry.geometry);
	//this.bubble("onPinClicked", null, pt);
	enyo.Signals.send("onPinClicked", pt);
    },
    makeButtonBubbleClick: function(inSender, inEvent) {
	var pt = this.convertCoordsToLonLat(Data.getLocationData());
	enyo.Signals.send("onPinClicked", pt);
    },
    makeBubbleLoad: function () {
	loaded = !0;
	this.doLoaded();
    },
    convertLonLatToCoords: function(lonlat) {
	var point = new OpenLayers.LonLat(Number(lonlat.x), Number(lonlat.y));
	var gpsProj = new OpenLayers.Projection("EPSG:4326");
	var mapProj = this.straction.getProjectionObject();
	point.transform(mapProj, gpsProj);

	return point;
    },
    convertCoordsToLonLat: function(coords) {
	var point = new OpenLayers.LonLat(Number(coords.longitude), Number(coords.latitude));
	var gpsProj = new OpenLayers.Projection("EPSG:4326");
	var mapProj = this.straction.getProjectionObject();
	point.transform(gpsProj, mapProj);

	return point;
    },
    convertXYToLonLat: function(lon, lat) {
	var point = new OpenLayers.LonLat(Number(lon), Number(lat));
	var gpsProj = new OpenLayers.Projection("EPSG:4326");
	var mapProj = this.straction.getProjectionObject();
	point.transform(gpsProj, mapProj);

	return point;
    }
});
