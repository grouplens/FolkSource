enyo.kind({
	name: "ShowMap",
	kind: enyo.FittableRows,
	classes: "enyo-fit",
	/*style: "overflow: hidden;",*/
	components: [
		{kind: enyo.Signals, onMapClicked: "newPin"},
		{name: "gps", kind: "rok.geolocation", watch: false, enableHighAccuracy: !0, timeout: this.gpsTimeout, maximumAge: "3000", onSuccess: "locSuccess", onError: "locError"},
		{name: "doubleCheckPopup", kind: onyx.Popup, autoDismiss: false, centered: true, floating: true, modal: true, scrimWhenModal: false, scrim: true, classes: "light-background", components: [
			{name: "doubleCheckMessage", content: "Are you sure?", style: "padding: 5px 0px;"},
			{kind: enyo.ToolDecorator, classes: "senseButtons", components: [
				{name: "no", kind: onyx.Button, classes: "button-style button-style-negative", ontap: "resetTasksAndQuestions", components: [
					{tag: "i", classes: "icon-ban-circle"}
				]},
				{name: "yes", kind: onyx.Button, classes: "button-style button-style-affirmative", ontap: "saveTasksAndQuestions", components: [
					{tag: "i", classes: "icon-ok"}
				]},
			]}
		]},
		{name: "toolbar", kind: onyx.Toolbar, layoutKind: enyo.FittableColumnsLayout, classes: "dark-background-flat", components: [
			{name: "showButton", kind: onyx.Button, classes: "button-style light-background", disabled: true, ontap: "showCampaigns", components: [
				{name: "spin", showing: true, tag: "i", classes: "icon-refresh icon-spin"},
				{name: "menuIcon", tag: "i", classes: "icon-list-ul icon-large", showing: false}
			]},
			{content: "FolkSource"},
			{kind: "GrouplensBrand", fit: true, vertical: false},
			{name: "newButton", kind: onyx.Button, classes: "button-style light-background", showing: true, ontap: "showNewMap", components: [
				{tag: "i", classes: "icon-plus icon-large"}
			]},
			{kind: enyo.FittableColumns, components: [
				{name: "cancelButton", kind: onyx.Button, classes: "light-background button-style-negative", style: "width: 50%;", showing: false, ontap: "resetTasksAndQuestions", components: [
					{tag: "i", classes: "icon-ban-circle icon-large"},
				]},
				{name: "saveButton", kind: onyx.Button, classes: "light-background button-style-affirmative", style: "width: 50%;", showing: false, ontap: "saveTasksAndQuestions", components: [
					{tag: "i", classes: "icon-ok icon-large"},
				]}
			]}
		]},
		{name: "container", kind: enyo.FittableColumns, fit: true, components: [
			{kind: "CSenseShowCampaigns"},
			//{name: "showButton", kind: onyx.Button, classes: "toolbar-button-style", ontap: "showCampaigns", content: ">"},
			{name: "mapCont", fit: true, style: "position: relative;", components:[
				{name: "addLocationsAndRegionsToolbar", kind: onyx.Drawer, open: false, style: "z-index: 10; float: right;", components:[
					{name: "addLandRRadioGroup", kind: onyx.RadioGroup, components:[
						{name: "addLocationButton", kind: onyx.Button, classes: "button-style", content: "Add Location"},
						{name: "addRegionButton", kind: onyx.Button, classes: "button-style", content: "Add Region"}
					]}
				]},
				{name: "modifyToolbar", kind: onyx.Drawer, open: false, style: "z-index: 10; float: right;", components:[
					{kind: enyo.ToolDecorator, components:[
						{name: "undoButton", kind: onyx.Button, content: "Undo", classes: "button-style", style:"margin-right: 8px; border-radius: 3px 3px 3px 3px;"},
						{name: "modifyRadioGroup", kind: onyx.RadioGroup, components:[
							{name: "modifyFeaturesButton", kind: onyx.Button, classes: "button-style", content: "Edit"},
							{name: "removeFeaturesButton", kind: onyx.Button, classes: "button-style", content: "Remove"}
						]}
					]}
				]}
			]},
			{name: "campaignBuilder", style: "z-index: 15; position: relative;", kind: "CampaignBuilder"},
		]}
	],
	published: {
		gpsTimeout: "10000",
		location: "",
	},
	events: {
		onClusterSelection: "",
		onDeactivateTaskLocationEditingUI: "",
		onLocationsIncoming: "",
		onNewTapped: "",
		onNewLocation: "",
		onReceiveNewSubmissions: "",
		onShowTapped: "",
		onViewportChanged: "",
		onCleanupSelected: "",
	},
	handlers: {
		//onAddPins: "enableMarkerPlacementMode",
		//onAddPolygon: "enablePolygonPlacementMode",
		//onModifyPinsAndPolygons: "enableModifyMode",

		//onPins: "testLoc", //I think this is left over from the open layers implementation

		onSnapping: "toggleVisible",
		onSnapped: "toggleVisible",
		//onStep: "resizeContainer",
		onDeactivateAllEditing: "deactivateEditingInterface",
		onShowAddFeaturesToolbar: "showAddFeaturesToolbar",
		onShowEditFeaturesToolbar: "showEditFeaturesToolbar",
		/*onShowTaskLocations: "showTaskLocations",*/

		onSelectCampaign: "showTaskLocationsOnMap",
		onSelectTask: "showSubmissionsOnMap",
		onClearTaskSelection: "clearSubmissionsFromMap",

		onDrawerToggled: "adjustMapSize",
		onTaskDrawerOpened: "panToTaskMarkerGroup",
		onTaskDetailDrawerOpened: "panToSubmissionsGroup",

		onAPIResponse: "updateLastSubmissionPollTime",

		onContentSet: "stopTaskDetailSpinner",
		
		onResizeMap: "adjustMapSize",

		onCheckLocation: "highlightMarkerPolygon"
	},

	create: function (inSender, inEvent) {

		this.inherited(arguments);

		this.resized();
		this.$.gps.setTimeout(this.gpsTimeout);

		this.lastSubmissionPoll = 0;
		//enyo.job("submissionPoll", enyo.bind(this, "getNewSubmissions"), 1500);
		
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

		
		this.taskMarkerGroups = {}; //keys: campaign ids, values: L.FeatureGroups holding task markers/polygons
		this.taskMarkers = {}; //keys: task ids, values: L.Layers holding task marker or polygon
		this.submissionMarkerGroups = {}; //Keys: task ids, values: L.FeatureGroups holding submission markers
		this.currentTaskMarkerGroup = null; //Group of task markers currently being displayed
		this.currentSubmissionsGroup = null; //Group of submission markers currently being displayed
		this.currentSubmissionsGroupTaskId = null; //Id of the task whose submissions are currently being displayed
		this.selectedCluster = null;

		this.stopSpinnerOnTaskDetailContSet = false;
	},

	resizeContainer: function(inSender, inEvent) {
		//this.$.container.resized();
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
		this.waterfallDown("onNewLocation", e);
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
	highlightMarkerPolygon: function(inSender, inEvent) {
		var layer = inEvent.layer; 
		this.log(this.map.hasLayer(layer));
		if(this.map.hasLayer(layer)) {
			if(inEvent.layerType === "marker")
				layer.setOpacity(0.4);
			if(inEvent.layerType === "polygon")
				layer.setStyle({color: "#00FF00"});
		}
		return true;
	},	
	undo: function(){
		var action = this.undoStack.pop();

		if (action !== undefined){
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
			this.$.modificationRadioGroup.setActive(null);
		}
		this.waterfallDown("onLocationsIncoming", {locations: this.drawnItems});
	},






	locError: function (a, b) {
		//Do something
	},

	locSuccess: function (a, b) {
		/* This section does no work when loading as file://
		Data.setLocationData(b.coords);
		this.centerMap();
		*/
		this.Map.setView([b.coords[latitude], b.coords[longitude]], 11, true);
		return true;
	},


	pushMarkerState: function (e){
		this.log("The marker started being dragged");
		this.undoStack.push({type:"move", layer: e.target, originalLatLng: e.target.getLatLng()});
	},

	clusterIconCreateFunc: function(cluster){
		var childCount = cluster.getChildCount();
		var min;
		var max;
		if (childCount == 1){ //There is a problem with _get_clusters() on the first size 1 cluster.
			min = 1;
			max = 1;
		} else {
			var clusters = this._get_clusters();
			clusters.sort(function(a, b) {return a.getChildCount() - b.getChildCount();});
			max = clusters[clusters.length -1].getChildCount();
			min = clusters[0].getChildCount();
		}
		var color = this.getClusterIconColor(childCount, min, max, {r:255,g:235,b:245}, {r:255, g:0, b:0});
		//var color = this.getClusterIconColor(childCount, min, max, {r:255,g:255,b:200}, {r:255, g:0, b:0});
		var icon =  new CSenseClusterDivIcon({color: color, html: '<div><span>' + childCount + '</span></div>', className: 'marker-cluster', iconSize: new L.Point(40, 40) });
		return icon;
	},

	/*
		Trigger the cluster selection event and highlight the given cluster
	*/
	selectCluster: function(clust){
		this.clearClusterSelect();
		this.selectedCluster = clust;
		L.DomUtil.addClass(clust._icon, "cluster-selected");
		var subs = [];
		if (clust.getAllChildMarkers){ //cluster is an L.MarkerCluster
			subs = clust.getAllChildMarkers().map(function(m){return m.submission;});
		} else { //cluster is a marker
			subs = [clust.submission];
		}
		this.waterfallDown("onClusterSelection",{submissions: subs});
	},

	/*
		unhighlight the previously selected cluster (if it exists) and if updateSubs is true, trigger an update of the listed submissions to include
		all within the viewport.
	*/
	clearClusterSelect: function(updateSubs) {
		if (this.selectedCluster){
			if (this.selectedCluster._icon){
				L.DomUtil.removeClass(this.selectedCluster._icon, "cluster-selected");
			}
			this.selectedCluster = null;

			if (updateSubs === true){
				//This does what we want but it triggers an event whose name does not reflect what has actually happened
				this.waterfallDown("onViewportChanged",{submissions: this.getVisibleSubmissions()});
			}
		}
		
	},

	animationEndHandler: function(e){
		//Remove the event handler (because there will be several animation end functions)
		this.clusterGroup.off("animationend", this.myAnimationEndFunction, this);
		//After a short delay (to let other animations finish), repopulate the list (which will also trigger an end to the spinner)
		enyo.job("viewChangedByZoom", enyo.bind(this, function(){
			this.stopSpinnerOnTaskDetailContSet = true;
			this.waterfallDown("onViewportChanged",{submissions: this.getVisibleSubmissions()});
		}), 200);	
	},

	stopTaskDetailSpinner: function(inSender, inEvent){
		if (this.stopSpinnerOnTaskDetailContSet) {
			this.$.cSenseShowCampaigns.$.taskDetailDrawerContent.stopSpinner();
			this.stopSpinnerOnTaskDetailContSet = false;
		}
	},

	rendered: function () {
		this.inherited(arguments);
		this.$.gps.getPosition();		

		//-- Create the map --//
		this.map = L.map(this.$.mapCont.id, {closePopupOnClick: false, minZoom: 1, maxZoom: 16}).setView([44.981313, -93.266569], 12);
		L.tileLayer("http://tile.stamen.com/watercolor/{z}/{x}/{y}.jpg", {}).addTo(this.map);
		L.tileLayer("http://tile.stamen.com/toner-lines/{z}/{x}/{y}.png", {}).addTo(this.map);
		L.tileLayer("http://tile.stamen.com/toner-labels/{z}/{x}/{y}.png", {
			attribution: "Map tiles by Stamen Design, under CC BY 3.0. Data by OpenStreetMap, under CC BY SA."
			//attribution: "Map data &copy; OpenStreetMap contributors"
		}).addTo(this.map);


		//-- markerCluster initilization --//
		var that = this;
		this.clusterGroup = new L.MarkerClusterGroup({maxClusterRadius: 35, singleMarkerMode: true, showCoverageOnHover: true, spiderfyOnMaxZoom: false, iconCreateFunction: this.clusterIconCreateFunc.bind(this)});
		this.map.addLayer(this.clusterGroup);
		//Bring cluster to front on hover
		this.clusterGroup.on('clustermouseover', function (a) {
			a.layer._bringToFront();
		});
		this.clusterGroup.on('clustermouseout', function (a) {
			a.layer._resetZIndex();
		});


		//-- Submission Filtering --//
		this.clusterGroup.on('clusterclick', function(a) {
			a.layer.zoomToBounds();
			if (this.map.getMaxZoom() === a.layer._zoom){
				this.selectCluster(a.layer);
			}
		}, this);

		/*
		this.map.on("moveend", function(e){ //"moveend dragend zoomend resize"
			this.clearClusterSelect();
			this.$.cSenseShowCampaigns.$.taskDetailDrawerContent.startSpinner();
			this.clusterGroup.on("animationend", this.myAnimationEndFunction, this);
		}, this);
		*/

		
		this.map.on("dragend resize", function (){
			this.clearClusterSelect();
			this.$.cSenseShowCampaigns.$.taskDetailDrawerContent.startSpinner();
			this.waterfallDown("onViewportChanged",{submissions: this.getVisibleSubmissions()});
			enyo.job("viewChangedByDragOrResize", enyo.bind(this, function(){
				this.$.cSenseShowCampaigns.$.taskDetailDrawerContent.stopSpinner();
			}), 500);
		}, this);
		
		
		this.map.on("zoomend", function (){
			this.clearClusterSelect();
			this.$.cSenseShowCampaigns.$.taskDetailDrawerContent.startSpinner();
			this.clusterGroup.on("animationend", this.animationEndHandler, this);
		}, this);




		this.map.on("click", function(e){
			this.clearClusterSelect(true);
		}, this);
		this.clusterGroup.on("click", function (a){
			this.clearClusterSelect(false);
			this.selectCluster(a.layer);
			//Tell clusterGroup to trigger marker onClick functions when marker (and cluster of size 1) clicks occur.
			if (a.layer.onClick){
				a.layer.onClick();
			}
		}, this);


		//-- Leaflet.draw Campaign editting initialization --//
		this.undoStack = [];
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
			}, 
			marker: {
				icon: new L.DivIcon({iconSize: new L.Point(27,91), html: "<i class=\"icon-map-marker icon-4x\"></i>", className: "map-pin"})
			},
			polygon: {
				shapeOptions: {
					color: "#0000FF"
				}
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
		var classy = this.$.showButton.hasClass("active");
		this.$.showButton.addRemoveClass("active", !classy);
		if(classy)
			this.removeTaskLocations();
		var offset = classy ? -150 : 150;
		this.map.panBy([offset,0],{animate: true, duration: 0});
		
		this.waterfallDown("onShowTapped");
		this.waterfallDown("onDeactivateTaskLocationEditingUI", {locations: this.drawnItems});
		this.deactivateEditingInterface();
		this.map.invalidateSize();
		this.$.mapCont.resized();
	},
	showNewMap: function(inSender, inEvent) {
		var truth = this.$.campaignBuilder.getOpen();
		this.$.campaignBuilder.toggleDrawer();
		this.map.panBy([450,0],{animate: false, duration: 0});
		/*this.map.invalidateSize();
		this.$.mapCont.resized();*/

		this.$.newButton.setShowing(false);
		this.$.saveButton.setShowing(true);
		this.$.cancelButton.setShowing(true);
		this.$.toolbar.resized();
		this.$.toolbar.render();
	},
	resetTasksAndQuestions: function(inSender, inEvent) {
		this.$.campaignBuilder.toggleDrawer();
		this.log();
		this.$.campaignBuilder.removeAllTasks();
		this.$.campaignBuilder.render();

		this.$.saveButton.setShowing(false);
		this.$.cancelButton.setShowing(false);
		this.$.newButton.setShowing(true);
		this.$.toolbar.resized();
		this.$.toolbar.render();
		this.map.panBy([-450,0],{animate: false, duration: 0});
	},
	saveTasksAndQuestions: function(inSender, inEvent) {
		//SAVE STUFF GOES HERE
		this.resetTasksAndQuestions();
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
	Removes any task location/region markers that may or may not be on the map as a result of
	Showing existing campaigns (not from editing campaigns)
	*/
	removeTaskLocations: function (){
		
		if (this.currentTaskMarkerGroup !== null){

			//manually close popups to fix bug where label stays on map
			this.currentTaskMarkerGroup.eachLayer(function(layer){
				layer.closePopup();
			});

			this.map.removeLayer(this.currentTaskMarkerGroup);
			this.currentTaskMarkerGroup = null;
		}
		this.doCleanupSelected();
	},

	/*
		Takes a task and returns a feature group of markers for each of the tasks submissions
	*/
	setupSubmissionMarkers: function(task, pop, popContent){
		//instantiate submission markers:
		var subs = task.submissions;
		var markers = new L.FeatureGroup();
		var showCampaigns = this.$.cSenseShowCampaigns;

		for(var i=0; i < subs.length; i++){
			var mark = this.submissionToMarker(subs[i], showCampaigns, markers);
			if (mark !== null){
				markers.addLayer(mark);
			}
		}
		return markers;
	},

	//I don't love the name of this method
	submissionToMarker: function(sub, showCampaigns, markers){
		var mark = null;
		var latlng = sub.gps_location.split("|");

		if (latlng.length === 2) {
			var latitudelongitude = new L.LatLng(parseFloat(latlng[0]), parseFloat(latlng[1]));
			var makePing = false;
			/*
			if (markers != null){
				makePing = !this.pingWithinRange(markers, latitudelongitude, 10);
			}
			*/

			mark = new SubmissionMarker(latitudelongitude, sub.id, sub, showCampaigns, makePing);
			mark.bindLabel("Submission "+ sub.id);
		} else {
			//Submission has invalid gps coordinates
		}
		return mark;
	},

	pingWithinRange: function(markerGroup, latlng, d){
		//Retruns true if there is a marker in the markerGroup within distance d pixels of this latlng that has a ping animation attached to it.
		//TODO: Implement a faster algorithm than this O(n) aproach.
			// http://en.wikipedia.org/wiki/Fixed-radius_near_neighbors
			// http://en.wikipedia.org/wiki/Nearest_neighbor_search

		var ret = false;
		markerGroup.eachLayer(function(otherMarker){
			if (otherMarker.hasPing()){
				var dist = this.map.latLngToLayerPoint(latlng).distanceTo( this.map.latLngToLayerPoint(otherMarker.getLatLng()) );
				if (dist <= d){
					ret = true;
					//Is there a way to break out here if we have a true?
				}
			}
		}, this);
		return ret;
	},

	clearSubmissionsFromMap: function(inSender, inEvent){
		if (this.currentSubmissionsGroup){
			this.map.removeLayer(this.currentSubmissionsGroup);
		}
		this.currentSubmissionsGroup = null;
		this.currentSubmissionsGroupTaskId = null;
		this.clusterGroup.clearLayers();
	},

	/*
		Adds markers and heatmap to the map illustrating the locations of the submissions for the given task.
		Also pans the map to the markers+taskMarker/Polygon
	*/
	showSubmissionsOnMap: function (inSender, inEvent) {
		var task = inEvent.task;
		var taskDetail = inEvent.taskDetail;
		var taskMarker = this.taskMarkers[task.id];


		if (inEvent.task.id !== this.currentSubmissionsGroupTaskId){
			//Add the markers to the map
			if (this.submissionMarkerGroups[task.id] === undefined){
				//Instantiate the markers
				this.submissionMarkerGroups[task.id] = this.setupSubmissionMarkers(task, null, taskDetail);
			}
			var group = this.submissionMarkerGroups[task.id];

			this.clusterGroup.addLayers(group.getLayers());

			this.currentSubmissionsGroup = group;
			this.currentSubmissionsGroupTaskId = task.id;
		}
		//if(inEvent.detailDrawerOpen === true){
			//this.panToSubmissionsGroup(null, {taskId: task.id, offset: inEvent.offset}); //Here I am calling an event handler manually, is that bad?
		//}
	},

	_get_clusters: function(zoom){
		var desiredZoom = zoom ? zoom : this.map.getZoom();
		var clusters = Array();
		this.clusterGroup._topClusterLevel._recursively(this.clusterGroup.getBounds(), desiredZoom, desiredZoom, function(m) {
			clusters.push(m);
		});
		return clusters;
	},

	getVisibleSubmissions: function() {
		var subs = Array();
		/*
		Baseline to test filtering latency:
		Unfortunately it seems to be just plain slow to build the submissions list, filtering does not seem to cause the slow down...
		*/

		//Get all submissions in clusters
		this.clusterGroup._topClusterLevel._recursively(this.map.getBounds(), this.map.getZoom(), this.map.getZoom(), function(m) {
			var marks = m.getAllChildMarkers();
			subs = subs.concat(marks.map(function(m){return m.submission;}));
		});
		//Get all non clustered submissions
		this.clusterGroup._gridUnclustered[this.map.getZoom()].eachObject(function(o){ //Shit, this is all of them
			if (this.map.getBounds().contains(o.getLatLng())){
				subs.push(o.submission);
			}
		}, this);
		
		return subs;
	},

	/*
		Adds marker and polygons to the map illustrating the locations of the tasks for the given campaign.
		Also pans the map to the markers and polygons.
	*/
	showTaskLocationsOnMap: function(inSender, inEvent){
		var campaign = inEvent.campaign;

		//Remove any markers that may be assiciated with another campaign
		this.removeTaskLocations();
		//Instantiate task markers if needed
		if (this.taskMarkerGroups[campaign.id] === undefined){
			this.taskMarkerGroups[campaign.id] = new L.FeatureGroup();
			//this.taskMarkerGroups[campaign.id] = new L.LayerGroup();

			//setup the functions outside the loop (better practice according to
			//JSHINT)
			var clickpin = function() {
				this.waterfall("onTaskMarkerClicked", {task: shape.task});
			};
			var clickregion = function() {
				this.waterfall("onTaskMarkerClicked", {task: shape.task});
				this.clearClusterSelect();
				this.waterfallDown("onViewportChanged",{submissions: this.getVisibleSubmissions()});
			};
			var mouseover = function() {
				this.updateLabelContent(hoverText);
			};
			var mosueout = function(){
				this.updateLabelContent(labelText);
			};
			for (var i in campaign.tasks){

				task = campaign.tasks[i];
				//instantiate task marker

				var wkt = new Wkt.Wkt();
				for(var x in task.locations) {
					var str = task.locations[x].geometryString;
					wkt.read(str);
					var shape = wkt.toObject();
					shape.task = task;
					if(str.indexOf("POINT") != -1) {
						shape.setIcon(new L.DivIcon({iconSize: new L.Point(27,91), html: "<i class=\"icon-map-marker icon-4x\"></i>", className: "map-pin"}));
						shape.setZIndexOffset(5);
						shape.on("click", clickpin, this);
					} else {
						shape.on("click", clickregion, this);
					}
					this.log(task.submissions.length);
					var labelText = "Task "+task.id+"<br/>"+task.submissions.length+" submissions";
					shape.bindLabel(labelText, { noHide: true });
					var hoverText = task.instructions;

					shape.on("mouseover", mouseover);
					shape.on("mouseout", mouseout);

					if(task.submissions === undefined)
						task.submissions=[];

					this.taskMarkerGroups[campaign.id].addLayer(shape);
					this.taskMarkers[task.id] = shape;
				}
			}
		}
		//Add the markers to the map
		this.map.addLayer(this.taskMarkerGroups[campaign.id]);
		this.currentTaskMarkerGroup = this.taskMarkerGroups[campaign.id];
		this.log(this.currentTaskMarkerGroup);
		/*this.currentTaskMarkerGroup.eachLayer(function (layer){
			layer.showLabel();
		});*/
	},

	/*

	*/
	adjustMapSize: function(inSender, inEvent){
		this.log();
		//this.map.panBy([inEvent.offset,0],{animate: true, duration: 0});
		var offset = inEvent.offset;
		//this.map.invalidateSize();
		//this.map.panBy([offset,0],{animate: true, duration: 0});
		/*this.$.mapCont.resized();
		this.reflow();*/
	},
	/*

	*/
	panToSubmissionsGroup: function(inSender, inEvent){
		var taskId = inEvent.taskId;
		var offset = inEvent.offset;
		this.$.mapCont.resized();
		this.map.invalidateSize();
		this.map.panBy([offset,0],{animate: true, duration: 0});
	},
	/*
	
	*/
	panToTaskMarkerGroup: function(inSender, inEvent){
		var campId = inEvent.campId;
		var offset = inEvent.offset;
		this.$.mapCont.resized();
		this.map.invalidateSize();
		this.map.panBy([offset,0],{animate: true, duration: 0});
		this.log(inEvent.offset);

		return true;
	},

	/* -- Live Update Functions-- */

	getNewSubmissions: function(){
		//var url =  Data.getURL() + "submission.json?after="+String(this.lastSubmissionPoll);
		var url =  "http://localhost:9080/csense/submission.json?after="+String(this.lastSubmissionPoll);

		var ajax = new enyo.Ajax({url: url, method: "GET", handleAs: "json", cacheBust: false});
		ajax.response(this, "updateSubmissions"); 
		ajax.go();
		//Poll again in 1.5 seconds
		enyo.job("submissionPoll", enyo.bind(this, "getNewSubmissions"), 1500);
		
	},
	updateLastSubmissionPollTime: function(inSedner, inEvent){
		this.$.spin.setShowing(false);
		this.$.menuIcon.setShowing(true);
		this.$.showButton.setDisabled(false);
		this.$.toolbar.resized();
		this.$.toolbar.render();
		this.lastSubmissionPoll = inEvent.time;
	},
	/*
		Handles response from server for new submissions request.
	*/
	updateSubmissions: function(inSender, inResponse){
		this.lastSubmissionPoll = inSender.startTime;
		if(inResponse.submissions.length > 0){
			this.log("Got a new submission!");
			this.waterfallDown("onReceiveNewSubmissions", {submissions: inResponse.submissions});
			this.createNewSubmissionMarkers(inResponse.submissions);
		}
	},
	/*
		This function creates new markers for each submission in the given list of submissions (if needed)
		This function is meant to be used as part of the live updating of submissions.
	*/
	createNewSubmissionMarkers: function(submissions){
		for (var i=0;i<submissions.length;i++){
			var sub = submissions[i];
			if (sub.task_id in this.submissionMarkerGroups){
				var mark = this.submissionToMarker(sub, this.$.cSenseShowCampaigns, null);
				if (mark !== null){
					//add it to the list
					this.submissionMarkerGroups[sub.task_id].addLayer(mark);
					if (this.currentSubmissionsGroupTaskId == sub.task_id){
						this.clusterGroup.addLayer(mark);
					}
				}
			}
		}
		this.waterfallDown("onViewportChanged",{submissions: this.getVisibleSubmissions()});
	},




	/* -- Cluster coloring functions -- */

	getClusterIconColor: function(val, minVal, maxVal, minColor, maxColor){
		//linearly interpelates between minColor and maxColor
		//colors should be given as {r: 000, g: 000, b:000}
		if (val == 1){
			return {r:minColor.r, g:minColor.g, b:minColor.b};
		}
		if (minVal == maxVal){
			return {r:maxColor.r, g:maxColor.g, b:maxColor.b};
		}
		var percent = (val - minVal) / (maxVal - minVal);
		var newR = minColor.r + Math.round((maxColor.r - minColor.r) * percent);
		var newG = minColor.g + Math.round((maxColor.g - minColor.g) * percent);
		var newB = minColor.b + Math.round((maxColor.b - minColor.b) * percent);
		return {r:newR, g:newG, b:newB};
	},
	getClusterIconColor2: function(val, minVal, maxVal){
		var p;
		if (val == 1){
			p = 0;
		} else if (minVal == maxVal){
			p = 1;
		} else {
			p = (val - minVal) / (maxVal - minVal);
		}
		var heat = this._heatGradient(1-p);
		return "rgba("+heat.r+","+heat.g+","+heat.b+", 0.6)";

	},
	//http://commons.wikimedia.org/wiki/File:P_hot.gif
	_convertToLight: function(p){
		if (p < 0){ return 0;}
		if (p > 1){ return 255;}
		return Math.round(p*255);
	},
	_heatGradient: function(p){
		var r = this._convertToLight(3*p);
		var g = this._convertToLight(3*p-1);
		var b = this._convertToLight(3*p-2);
		return {r:r, g:g, b:b};
	},
	_greenYellowRedGradient: function(p){
		var r = this._convertToLight(2*p);
		var g = this._convertToLight(-2*p+2);
		var b = this._convertToLight(0*p);
		return {r:r, g:g, b:b};
	},
});
