enyo.kind({
    name: "CreateMap",
    	style: "overflow: hidden;",
	fit: true,
	kind: "enyo.FittableColumns",
    components: [
	{kind: "enyo.Signals", onMapClicked: "newPin", onTaskEdited: "pickTask"},
        {name: "gps", kind: "rok.geolocation", watch: !0, enableHighAccuracy: !0,timeout: this.gpsTimeout, maximumAge: "3000", onSuccess: "locSuccess", onError: "locError"},
	{kind: "enyo.FittableRows", components: [
		{name: "pinButton", kind: "enyo.Button", content: "Add Pins", classes: "map-button", ontap: "clickToAddPins"},
		{name: "polygonButton", kind: "enyo.Button", content: "Add Polygon", classes: "map-button", ontap: "clickToAddPolygon"},
		{name: "shapefileButton", kind: "enyo.Button", content: "Upload a Shapefile", classes: "map-button", ontap: "clickToAddShapeFile"},
		/*{name: "uploadDrawer", orient: "v", components: [
		]}*/
	]},
	{name: "mapCont", fit: true, style: "background-color: green; height: 100%;"}
    ],
    published: {
        gpsTimeout: "10000",
	location: "",
    },
    events: {
    },
    handlers: {
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
	this.locations = [];

	//buttons
	this.addPins = false;
	this.addPolygon = false;
	this.addShapeFile = false;

	this.events.onPins = '';

	//click handler
	/*OpenLayers.Control.Click = OpenLayers.Class(OpenLayers.Control, {
                defaultHandlerOptions: {
                    'single': true,
                    'double': false,
                    'pixelTolerance': 0,
                    'stopSingle': false,
                    'stopDouble': false
                },

                initialize: function(options) {
                    this.handlerOptions = OpenLayers.Util.extend(
                        {}, this.defaultHandlerOptions
                    );
                    OpenLayers.Control.prototype.initialize.apply(
                        this, arguments
                    );
                    this.handler = new OpenLayers.Handler.Click(
                        this, {
                            'click': this.trigger
                        }, this.handlerOptions
                    );
                },

                trigger: /*enyo.bind(this, function(e) {*/
		    enyo.bind(this, this.newPin)
		    /*enyo.Signals.send("onMapClick", {xy: e.xy});
		    //console.log(e.xy);
                })

            });*/
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
	    projection: "EPSG:4326"
	});

	this.polyLayer = new OpenLayers.Layer.Vector('polygons', {
	    styleMap: new OpenLayers.StyleMap({
		//externalGraphic: "assets/pin2.png",
		fillOpacity: 0.3,
		fillColor: "#00FF00",
		strokeWidth: 0.5
	    }),
	    projection: "EPSG:4326"
	});

	//add the layers
	this.straction.addLayers([osm, this.pointsLayer]);

	/*this.nav;
	if(this.createCampaign) {
	    this.nav = new OpenLayers.Control.DragPan({dragPanOptions: {enableKinetic: true}});
	} else {*/
	    this.nav = new OpenLayers.Control.TouchNavigation({dragPanOptions: {enableKinetic: true}});
	//}
	this.zoom = new OpenLayers.Control.Zoom();
	this.select = new OpenLayers.Control.SelectFeature(this.pointsLayer, {autoActivate: true, onSelect: enyo.bind(this, this.makeBubbleClick)});
	//this.click = new OpenLayers.Control.Click();
	this.mousePos = new OpenLayers.Control.MousePosition();
	this.drawPolygon = new OpenLayers.Control.DrawFeature(this.polyLayer, OpenLayers.Handler.Polygon);

	//add the controls
	this.straction.addControls([this.nav, this.zoom, this.select, /*this.click,*/ this.drawPolygon, this.mousePos]);
	this.drawPolygon.deactivate();

	//register events
	this.straction.events.register("zoomend", this.straction, this.makeFilter());
	this.straction.events.register("moveend", this.straction, this.makeFilter());
    },
    deactivateMap: function(truthiness, type) {
	if(type === "pin")
	    this.$.pinButton.addRemoveClass("active", truthiness);
	if(type === "poly")
	    this.$.polygonButton.addRemoveClass("active", truthiness);

	if(truthiness) {
	    //this.straction.removeControl(this.zoom);
	    this.zoom.deactivate();
	    this.nav.deactivate();
	    this.click.activate();
	    if(type === "poly")
		this.drawPolygon.activate();
	} else{
	    //this.straction.addControl(this.zoom);
	    this.zoom.activate();
	    this.nav.activate();
	    this.click.deactivate();
	    if(type === "poly")
		this.drawPolygon.deactivate();
	}
    },
    clickToAddPins: function(inSender, inEvent) {
	this.addPins = !this.addPins;
	this.deactivateMap(this.addPins, "pin");
    },
    newPin: function(inEvent) {
	var xy = inEvent.xy;
	var coords = this.straction.getLonLatFromPixel(xy);

	//haven't figured out why this part is necessary yet.
	var gpsProj = new OpenLayers.Projection("EPSG:4326");
	var mapProj = this.straction.getProjectionObject();
	coords.transform(mapProj, gpsProj);

	if(this.addPin) {
	    var ptString = "" + coords.lon.toString() + "," + coords.lat.toString();
	    this.locations.push(ptString);
	    this.addMarkers();
	} else if (this.addPolygon) {
	}
    },
    clickToAddPolygon: function(inSender, inEvent) {
	this.addPolygon = !this.addPolygon;
	this.deactivateMap(this.addPolygon, "poly");
	this.polyLayer;
    },
    clickToAddShapeFile: function(inSender, inEvent) {
    },
    mapLoaded: function() {
	this.loaded = true;
	this.log(this.loaded);
	//this.doLoaded();
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
	    this.locations = this.locations.split("|");
	    this.addMarkers();
	}
    },
    makeFilter: function () {
	if(this.loaded)
	    this.panZoomed = true;
	this.addMarkers();
    },
    addMarkers: function () {
        if (this.locations instanceof Array) {
            for (x in this.locations) {
		this.log(x);
		var a = this.locations[x].split(",");
		var b = this.convertXYToLonLat(a[0], a[1]);
		var pt = new OpenLayers.Geometry.Point(b.lon, b.lat);
		this.pointsLayer.addFeatures([new OpenLayers.Feature.Vector(pt)]);
	    }
        }
	this.straction.addLayer(this.pointsLayer);
	this.pointsLayer.refresh();
	this.pointsLayer.display(true);
    },
    centerMap: function () {
	var myLocation = Data.getLocationData();
	var pt = this.convertCoordsToLonLat(myLocation);
	this.straction.setCenter(pt, 12);//, true, true);
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
    pickTask: function(inSender, inEvent) {
	this.log(inEvent.taskData);
	return true;
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
