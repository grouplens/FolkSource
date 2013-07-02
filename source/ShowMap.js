enyo.kind({
	name: "ShowMap",
	style: "overflow: hidden;",
	kind: enyo.FittableRows,
	fit: true,
	components: [
		{kind: enyo.Signals, onMapClicked: "newPin"},
		{name: "gps", kind: "rok.geolocation", watch: false, enableHighAccuracy: !0, timeout: this.gpsTimeout, maximumAge: "3000", onSuccess: "locSuccess", onError: "locError"},
		{kind: onyx.Toolbar, layoutKind: enyo.FittableColumnsLayout, components: [
				{kind: enyo.ToolDecorator, components: [
				{kind: onyx.Grabber, ontap: "showCampaigns"},
			]},
			{content: "CitizenSense .beta."},
			{fit: true},
			{name: "newButton", kind: onyx.Button, content: "new", ontap: "showNewMap"},
		]},
		{name: "container", kind: enyo.FittableColumns, fit: true, components: [
			{kind: "CSenseShowCampaigns"},
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
			{kind: "CSenseNewCampaign"}
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
		onShowEditFeaturesToolbar: "showEditFeaturesToolbar",
		onShowTaskLocations: "showTaskLocations",
		onInvalidateMapSize: "invalidateMapSize",
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

		this.log(this);

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

		//keys: campaign ids, values: L.FeatureGroups holding task markers/polygons
		this.taskMarkerGroups = {};
		this.currentTaskMarkerGroup = null;

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
			this.drawMarker._tooltip.updatePosition(e.layer._latlng);
		}
		if (e.layerType === "polygon"){
			this.drawPolygon = new L.Draw.Polygon(this.map, this.drawControl.options.polygon);
			this.drawPolygon.enable();
			this.drawPolygon._tooltip.updatePosition(e.layer._latlngs[0]);
		}

	},

	showTooltip: function () {
		L.DomUtil.removeClass(this.tooltip, "hidden");
		this.map.off("mousemove", this.showTooltip, this);
	},

	fixTooltip: function (tooltipContainer) {
		L.DomUtil.addClass(tooltipContainer, "hidden");
		this.tooltip = tooltipContainer;
		this.map.on("mousemove", this.showTooltip, this);
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
		//Don't show tooltip in the upper left hand corner as is the default initial behavior
		this.fixTooltip(this.drawMarker._tooltip._container);
	},
	/*
		This function disables all leaflet.draw controls and activates the polygon placement control.
	*/
	enablePolygonPlacementMode: function(inSender, inEvent) {
		this.deactivateEditing();
		this.$.addRegionButton.setActive(true);
		this.drawPolygon.enable();
		//Don't show tooltip in the upper left hand corner as is the default initial behavior
		this.fixTooltip(this.drawPolygon._tooltip._container);
	},
	/*
		This function disables all leaflet.draw controls and activates the leaflet.draw edit control.
	*/
	enableModifyMode: function(inSender, inEvent) {
		this.deactivateEditing();
		this.$.modifyFeaturesButton.setActive(true);

		//enable the editor
		this.editor.enable();

		//fix the tooptip
		this.fixTooltip(this.editor._tooltip._container);

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
		this.fixTooltip(this.remover._tooltip._container);
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

		//Create the map		
		this.map = L.map(this.$.mapCont.id).setView([44.981313, -93.266569], 13);
		
		//L.tileLayer("http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
		//L.tileLayer("http://otile1.mqcdn.com/tiles/1.0.0/map/{z}/{x}/{y}.jpg", {
		L.tileLayer("http://acetate.geoiq.com/tiles/acetate-hillshading/{z}/{x}/{y}.png", {
			attribution: "Map data &copy; OpenStreetMap contributors"
		}).addTo(this.map);
		/*
		//Stamen tiles
		//To use be sure to add <script type="text/javascript" src="http://maps.stamen.com/js/tile.stamen.js?v1.2.2"></script>
		//to the html file.
		var tileLayer = new L.StamenTileLayer("terrain");
		this.map.addLayer(tileLayer);
		*/


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
		this.waterfallDown("onShowTapped");
		this.waterfallDown("onDeactivateTaskLocationEditingUI");
		this.deactivateEditingInterface();
		this.$.mapCont.resized(); //This line may not do any thing since the container doesn't change size until the animation has completed
		this.removeTaskLocations();
	},
	showNewMap: function(inSender, inEvent) {
		this.waterfallDown("onNewTapped");
		//this.waterfallDown("onDeactivateAllEditing");
		this.waterfallDown("onDeactivateTaskLocationEditingUI");
		this.deactivateEditingInterface();
		this.removeTaskLocations();

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

	/*
	This function turns a location string from the database into an L.LatLng object
	At present the strings are lng,lat !
	*/
	getLatLngFromDbString: function(str){
		//temporary fix to allow for testing
		if (str == "Minneapolis, MN"){
			return new L.LatLng(44.976032,-93.266987);
		}
		var lnglat = str.split(",");
		return new L.LatLng(parseFloat(lnglat[1]), parseFloat(lnglat[0]));
	},

	/*
	Removes campaign any task location/region markers that may or may not be on the map as a result of
	Showing existing campaigns (not from editing campaigns)
	*/
	removeTaskLocations: function (){
		if (this.currentTaskMarkerGroup !== null){
			this.map.removeLayer(this.currentTaskMarkerGroup);
			this.currentTaskMarkerGroup = null;
		}
	},

	/*
		Takes a task and returns a feature group of markers for each of the tasks submissions
	*/
	setupSubmissionMarkers: function(task){
		//instantiate submission markers:
		var subs = task.submissions;
		var markers = new L.FeatureGroup();
		for(var i=0; i < subs.length; i++){
			var latlng = subs[i].gps_location.split("|");
			if (latlng.length === 2) {
				latlng = new L.LatLng(parseFloat(latlng[0]), parseFloat(latlng[1]));
				var mark = new L.Marker(latlng, {icon: new L.DivIcon({className: 'submission-icon-div'})});
				mark.bindLabel("Submission "+subs[i].id);
				markers.addLayer(mark);
			}
		}
		return markers;
	},

	showTaskLocations: function (inSender, inEvent) {
		//Remove any markers that may be assiciated with another task
		this.removeTaskLocations();
		if (this.taskMarkerGroups[inEvent.campaign.id] === undefined){
			this.taskMarkerGroups[inEvent.campaign.id] = new L.FeatureGroup();
			for (i in inEvent.campaign.tasks){

				task = inEvent.campaign.tasks[i];

				//instantiate task marker
				var latlng = this.getLatLngFromDbString(inEvent.campaign.location);
				var labelText = "Task "+task.id+"<br/>"+task.submissions.length+" submissions";
				var hoverText = task.instructions

				var taskMarker = L.marker(latlng)
					.bindLabel(labelText, { noHide: true })
					.on("mouseover", function(){
						this.updateLabelContent(hoverText);
					})
					.on("mouseout", function(){
						this.updateLabelContent(labelText);
					});
				taskMarker.task = task.id;
				this.taskMarkerGroups[inEvent.campaign.id].addLayer(taskMarker)

				//Create a div for the enyo kind to render into
				var popDiv = L.DomUtil.create("div");
				//Create a popup
				var pop = L.popup({minWidth: 400, maxHeight: 300}).setContent(popDiv);
				//Add it to the marker
				taskMarker.bindPopup(pop);

				//instantiate the enyo popup content
				var popContent = new CSenseTaskPopup({owner: this, popup: pop, task: task});
				popContent.renderInto(popDiv);
				
				pop.on("open", function(){
					//foo
					this.map.invalidateSize();
					//The kind is initially rendered into a div that has no size. This ensures the kind is rerendered
					//after the div is displayed in the popup.
					popContent.resized();
					//Forward click events to the enyo entities that originated them.
					//This is a workaround for this issue: http://forums.enyojs.com/discussion/comment/7159
					L.DomEvent.on(pop._contentNode, "click", forward, this);
					//Hide label when clicked
					taskMarker.hideLabel();
				}, this);
				pop.on("close", function(){
					taskMarker.showLabel();
				}, this);

				//inspired by https://github.com/NBTSolutions/Leaflet/commit/466c0e3507cf0934a9d1441af151df2324a4537b#L2R129
				function forward(e){
					if (window.enyo && window.enyo.$ && e.srcElement && e.srcElement.id && window.enyo.$[e.srcElement.id]){
						window.enyo.$[e.srcElement.id].bubble("ontap", e);
					}
				}

				//Show submission locations when markers are clicked:
				//  instantiate markers for submissions
				taskMarker.submissionMarkersGroup = this.setupSubmissionMarkers(task);
				//  on marker click show the submission location and pan to them
				pop.on("open", function(){
					this.map.addLayer(taskMarker.submissionMarkersGroup);
					this.map.fitBounds(
						taskMarker.submissionMarkersGroup.getBounds().extend(taskMarker.getLatLng()),
						{animate: true}
					);
				}, this);
				//  on close of the popup hide the submission locations
				pop.on("close", function(){
					this.map.removeLayer(taskMarker.submissionMarkersGroup);
				}, this)
				//NOTE:
				//There is an issue with this scheme. Markers behind the popup can never be seen!
				//Also, panning to the markers potentially moves away from the popup.
					
					
			}
		}
		this.taskMarkerGroups[inEvent.campaign.id].addTo(this.map);
		this.currentTaskMarkerGroup = this.taskMarkerGroups[inEvent.campaign.id];
		this.taskMarkerGroups[inEvent.campaign.id].eachLayer(function (layer){
			layer.showLabel();
		});
		//Pan map to bounds
		this.panToCurrentTaskMarkerGroup();
	},
	panToCurrentTaskMarkerGroup: function(){
		if (this.currentTaskMarkerGroup){
			this.map.panTo(this.currentTaskMarkerGroup.getBounds().getCenter());
			//this.map.fitBounds(this.currentTaskMarkerGroup.getBounds(), {animate: true});

		}
	},
	invalidateMapSize: function (inSender, inEvent){
		this.map.invalidateSize();
		this.map.panBy([inEvent.offset,0],{animate: false, duration: 0});
		this.panToCurrentTaskMarkerGroup();
	}

});
