enyo.kind({
	name: "ShowMap",
	style: "overflow: hidden;",
	kind: enyo.FittableRows,
	fit: true,
	components: [
		{kind: enyo.Signals, onMapClicked: "newPin"},
		{name: "gps", kind: "rok.geolocation", watch: false, enableHighAccuracy: !0, timeout: this.gpsTimeout, maximumAge: "3000", onSuccess: "locSuccess", onError: "locError"},
		{kind: onyx.Toolbar, layoutKind: enyo.FittableColumnsLayout, components: [
			/*{kind: enyo.ToolDecorator, components: [
				{kind: onyx.Grabber, ontap: "showCampaigns"},
			]},*/
			{content: "CitizenSense .beta.", fit: true},
			{name: "newButton", kind: onyx.Button, content: "new", ontap: "showNewMap"},
		]},
		{name: "container", kind: enyo.FittableColumns, fit: true, components: [
		    {kind: "CSenseShowCampaigns"},
			{name: "showButton", kind: enyo.Button, ontap: "showCampaigns", content: ">"},
		    {name: "mapCont", style: "position: relative;", fit: true, components:[
		    	{name: "addLocationsAndRegionsToolbar", kind: onyx.Drawer, open: false, style: "position: absolute !important; z-index: 100; right: 0px;",components:[
		    		{name: "addLandRRadioGroup", kind: onyx.RadioGroup, components:[
		    			{name: "addLocationButton", kind: onyx.RadioButton, content: "Add Location"},
		    			{name: "addRegionButton", kind: onyx.RadioButton, content: "Add Region"}
		    		]}
		    	]},
		    	{name: "modifyToolbar", kind: onyx.Drawer, open: false, style: "position: absolute !important; z-index: 10; right: 0px;",components:[
		    		{kind: enyo.ToolDecorator, components:[
		    			{name: "undoButton", kind: onyx.Button, content: "Undo", classes: "onyx-radiobutton", style:"margin-right: 8px; border-radius: 3px 3px 3px 3px;"},
		    			{name: "modifyRadioGroup", kind: onyx.RadioGroup, components:[
		    				{name: "modifyFeaturesButton", kind: onyx.RadioButton, content: "Edit"},
		    				{name: "removeFeaturesButton", kind: onyx.RadioButton, content: "Remove"}
		    			]}
		    		]}
		    	]}
		    ]},
			{kind: "CampaignBuilder"}
		]}
	],
	published: {
		gpsTimeout: "10000",
		location: "",
	},
	events: {
	    onNewTapped: "",
		onShowTapped: "",
		onDeactivateTaskLocationEditingUI: "",
	},
	handlers: {
	    //onAddPins: "enableMarkerPlacementMode",
		//onAddPolygon: "enablePolygonPlacementMode",
		//onModifyPinsAndPolygons: "enableModifyMode",
		onPins: "testLoc",
		onSnapping: "toggleVisible",
		onSnapped: "toggleVisible",
		onStep: "resizeContainer",
		onDeactivateAllEditing: "deactivateEditingInterface",
		onShowAddFeaturesToolbar: "showAddFeaturesToolbar",
		onShowEditFeaturesToolbar: "showEditFeaturesToolbar"
	},
	addMarkers: function () {
		if (this.locations instanceof Array) {
			for (x in this.locations) {
				this.log(x);
				var a = this.locations[x].split(",");
				var b = this.convertXYToLonLat(a[0], a[1]);
				var pt = new OpenLayers.Geometry.Point(b.lon, b.lat);
				this.vectors.addFeatures([new OpenLayers.Feature.Vector(pt)]);
			}
		}
		this.straction.addLayer(this.pointsLayer);
		this.pointsLayer.refresh();
		this.pointsLayer.display(true);
	},
	create: function (inSender, inEvent) {
		this.inherited(arguments);
		this.resized();
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
		this.currentTaskName = "";
	},
	centerMap: function (coords) {
		var myLocation = coords;
		this.map.setView([myLocation.latitude, myLocation.longitude], 12, true);
		if(!this.loaded)
			this.mapLoaded();	//Can I axe this? Is this just leftover from the mobile version?
	},

	resizeContainer: function(inSender, inEvent) {
		this.$.container.resized();
	},


	showEditFeaturesToolbar: function(inSender, inEvent){
		this.$.modifyToolbar.setOpen(true);
	},
	showAddFeaturesToolbar: function(inSender, inEvent){
		this.$.addLocationsAndRegionsToolbar.setOpen(true);
	},
	createdDrawing: function(e) {

		//Add the element to the map
		this.drawnItems.addLayer(e.layer);

		//ReEnable whichever drawer was going before
		if (e.layerType === "marker"){
			this.drawMarker = new L.Draw.Marker(this.map, this.drawControl.options.marker);
			this.drawMarker.enable();
		}
		if (e.layerType === "polygon"){
			this.drawPolygon = new L.Draw.Polygon(this.map, this.drawControl.options.polygon);
			this.drawPolygon.enable();
		}

    },
    /*
		This function disables all leaflet.draw controls and activates the marker placement control.
    */
	enableMarkerPlacementMode: function(inSender, inEvent) {
		//disable any other drawers that may be active
		this.deactivateEditing();
		this.$.addLocationButton.setActive(true);
		//enable the markers draw-er
		this.drawMarker.enable();
	},
	/*
		This function disables all leaflet.draw controls and activates the polygon placement control.
	*/
	enablePolygonPlacementMode: function(inSender, inEvent) {
		this.deactivateEditing();
		this.$.addRegionButton.setActive(true);
		//enable the markers draw-er
		this.drawPolygon.enable();
	},
	/*
		This function disables all leaflet.draw controls and activates the leaflet.draw edit control.
	*/
	enableModifyMode: function(inSender, inEvent) {
		this.deactivateEditing();
		this.$.modifyFeaturesButton.setActive(true);

		//enable the editor
		this.editor.enable();

		//Save original state of the verticies for each polygon.
		this.drawnItems.eachLayer(function (layer) {
			if (layer instanceof L.Polygon){
				layer.prevState = L.LatLngUtil.cloneLatLngs(layer.getLatLngs());
			}
		}, this);
	},
	enableRemoveMode: function(inSender, inEvent) {
		this.deactivateEditing();
		this.$.removeFeaturesButton.setActive(true);
		this.remover.enable();
	},

	undo: function(){
		var action = this.undoStack.pop();

		if (action != undefined){
			if (action.type == "remove"){
				this.drawnItems.addLayer(action.layer);
				//this.log("undid a remove action");
			} else if (action.type == "move"){
				action.layer.setLatLng(action.originalLatLng);
				//this.log("undid a move action");
			} else if (action.type == "movePolygon"){
				this.deactivateEditing();
				action.layer.setLatLngs(action.verticies);
				this.enableModifyMode();
				//this.log("undid a movePolygon action");
			}
		}
	},
	deactivateEditing: function(inSender, inEvent){
		this.drawPolygon.disable();
		this.drawMarker.disable();
		this.editor.save();
		this.editor.disable();
		this.remover.save();
		this.remover.disable();

		this.$.modifyRadioGroup.setActive(null);
		this.$.addLandRRadioGroup.setActive(null);

	},
	closeDrawers: function(){
		this.$.addLocationsAndRegionsToolbar.setOpen(false);
		this.$.modifyToolbar.setOpen(false);
	},
	deactivateEditingInterface: function(inSender, inEvent){
		this.deactivateEditing();
		this.closeDrawers();
		if (this.$.modificationRadioGroup !== undefined){
			this.log("in herrrr");
			this.$.modificationRadioGroup.setActive(null);
		}
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
	},
	locError: function (a, b) {
		this.log();
	},
	locPlot: function (a) {
		this.locations = a;//.split("|");
		var pattern = /-\d+\.\d+,\d+\.\d+/;
		if (this.locations.match(pattern) != null) {
			this.locations = this.locations.split("|");
			this.addMarkers();
		}
	},
	locSuccess: function (a, b) {
		/* This section does no work when loading as file://
		Data.setLocationData(b.coords);
		this.centerMap();
		*/
		this.centerMap(b.coords);
		
		return true;
	},
	mapLoaded: function() {
		this.loaded = true;
		this.log(this.loaded);
		//this.doLoaded();
	},


	pushMarkerState: function (e){
		this.log("The marker started being dragged");
		this.undoStack.push({type:"move", layer: e.target, originalLatLng: e.target.getLatLng()});
	},

	rendered: function () {
		this.inherited(arguments);
		this.$.gps.getPosition();		


		this.log(this.$.mapCont.id);



		//Create the map
		this.map = L.map(this.$.mapCont.id).setView([44.981313, -93.266569], 13);
		L.tileLayer("http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
			attribution: "Map data &copy; OpenStreetMap contributors"
		}).addTo(this.map);

		//Leaflet.draw plugin
		this.undoStack = new Array();
		this.drawnItems = new L.FeatureGroup(); //Drawn polygons and markers will be stored in the drawnItems group
		this.map.addLayer(this.drawnItems);

		//Add a draw control with all the buttons hidden
		this.drawControl = new L.Control.Draw({
			draw: {
				polyline: false,
				rectangle: false,
				circle: false,
				polygon: false,
				marker: false
			}
		});
		this.map.addControl(this.drawControl);

		//Remove one of the default tooltips
		L.drawLocal.edit.tooltip.subtext = null;

		//Create Draw objects to be enabled later by our buttons
		this.drawPolygon = new L.Draw.Polygon(this.map, this.drawControl.options.polygon);
		this.drawMarker = new L.Draw.Marker(this.map, this.drawControl.options.marker);
		this.editor = new L.EditToolbar.Edit(this.map, {featureGroup: this.drawnItems, });
		this.remover = new L.EditToolbar.Delete(this.map, {featureGroup: this.drawnItems});

		this.map.on("draw:created", enyo.bind(this, "createdDrawing"));

		//This is used to undo deletes
		this.drawnItems.on("layerremove", function(e){
			//this.log("Removed layer "+e.layer);
			this.undoStack.push({type:"remove", layer: e.layer});
		}, this);

		//These event handlers allow for the undoing of edits
		this.drawnItems.on("layeradd", function(e){
			if (e.layer instanceof L.Marker){
				if (e.layer.hasDragStartHandler !== true){
					e.layer.off("dragstart", this.pushMarkerState, this);
					e.layer.on("dragstart", this.pushMarkerState, this);
					e.layer.hasDragStartHandler = true;
				}
			} else if (e.layer instanceof L.Polygon){
				//this.log("Adding edit event handler");
				//this.log("layer.prevState: " + e.layer.prevState);
				//When a polygon is edited
				e.layer.on("edit", function (ev){
					//this.log("edit event caught!");
					//this.log(ev.target.getLatLngs());
					//this.log(ev);
					this.undoStack.push({type:"movePolygon", layer: ev.target, verticies: ev.target.prevState});
					ev.target.prevState = L.LatLngUtil.cloneLatLngs(ev.target.getLatLngs());
				}, this);
			}
		},this);

		//Hook up our toolbar buttons	
		L.DomEvent.addListener(this.$.addLocationButton.hasNode(),"click", this.enableMarkerPlacementMode, this);
		L.DomEvent.addListener(this.$.addRegionButton.hasNode(),"click", this.enablePolygonPlacementMode, this);
		L.DomEvent.addListener(this.$.modifyFeaturesButton.hasNode(),"click", this.enableModifyMode, this);
		L.DomEvent.addListener(this.$.removeFeaturesButton.hasNode(),"click", this.enableRemoveMode, this);
		L.DomEvent.addListener(this.$.undoButton.hasNode(),"click", this.undo, this);
		L.DomEvent.disableClickPropagation(this.$.addLocationButton.hasNode());
		L.DomEvent.disableClickPropagation(this.$.addRegionButton.hasNode());
		L.DomEvent.disableClickPropagation(this.$.modifyFeaturesButton.hasNode());
		L.DomEvent.disableClickPropagation(this.$.removeFeaturesButton.hasNode());
		L.DomEvent.disableClickPropagation(this.$.undoButton.hasNode());


	},
	savePoint: function(inEvent) {
	    /*var tmp = LocalStorage.get(this.currentTaskName);
		tmp.points.push(inEvent.feature);
		LocalStorage.set(this.currentTaskName, tmp);*/
	},
	savePolygon: function(inEvent) {
	    /*var tmp = LocalStorage.get(this.currentTaskName);
		tmp.polygons.push(inEvent.feature);
		LocalStorage.set(this.currentTaskName, tmp);*/
	},

	showCampaigns: function(inSender, inEvent) {
		if(inSender.getContent() === ">")
			inSender.setContent("<");
		else
			inSender.setContent(">");

	    this.waterfallDown("onShowTapped");
	    //this.waterfallDown("onDeactivateAllEditing");
	   	this.waterfallDown("onDeactivateTaskLocationEditingUI");
	    this.deactivateEditingInterface();
	    //this.map.invalidateSize();
	    this.$.mapCont.resized();
	},
	showNewMap: function(inSender, inEvent) {
		this.waterfallDown("onNewTapped");
		//this.waterfallDown("onDeactivateAllEditing");
		this.waterfallDown("onDeactivateTaskLocationEditingUI");
		this.deactivateEditingInterface();

	    //var truthy = this.$.mapDrawer.getOpen();
		//this.$.mapDrawer.setOpen(!truthy);

		var classy = this.$.newButton.hasClass("active");
		this.$.newButton.addRemoveClass("active", !classy);
	},
	testLoc: function(inSender, inEvent) {
		this.vectors.destroyFeatures();
		this.locPlot(inEvent.location);
		this.vectors.refresh();
	},
	toggleVisible: function (a, b) {
		var c = this.parent.parent.getIndex(),
		d = this.id.split("_"),
		e = d[d.length - 1],
		f = this.parent.parent.getPanels()[c].id.split("_"),
		g = f[f.length - 1];
		return this.addRemoveClass("hideMap", e !== g), !0;
	},
});
