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

		//onPins: "testLoc", //I think this is left over from the open layers implementation

		onSnapping: "toggleVisible",
		onSnapped: "toggleVisible",
		onStep: "resizeContainer",
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

		//keys: campaign ids, values: L.FeatureGroups holding task markers/polygons
		this.taskMarkerGroups = {};
		this.taskMarkers = {}; //keys: task ids, values: L.Layers holding task marker or polygon
		this.submissionMarkerGroups = {} //Keys: task ids, values: L.FeatureGroups holding submission markers
		this.currentTaskMarkerGroup = null; //Group of task markers currently being displayed
		this.currentSubmissionsGroup = null; //Group of submission markers currently being displayed
		this.currentSubmissionsGroupTaskId = null; //Id of the task whose submissions are currently being displayed

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
			this.$.modificationRadioGroup.setActive(null);
		}
	},






	locError: function (a, b) {
		//Do something
	},

	locSuccess: function (a, b) {
		/* This section does no work when loading as file://
		Data.setLocationData(b.coords);
		this.centerMap();
		*/
		this.Map.setView([b.coords[latitude], b.coords[longitude]], 12, true);
		return true;
	},


	pushMarkerState: function (e){
		this.log("The marker started being dragged");
		this.undoStack.push({type:"move", layer: e.target, originalLatLng: e.target.getLatLng()});
	},

	rendered: function () {
		this.inherited(arguments);
		this.$.gps.getPosition();		

		//Create the map		
		this.map = L.map(this.$.mapCont.id, {closePopupOnClick: false, maxZoom: 17}).setView([44.981313, -93.266569], 13);
		
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

		//markerCluster
		var that = this;
		this.clusterGroup = new L.MarkerClusterGroup({maxClusterRadius: 35, singleMarkerMode: true, showCoverageOnHover: false, spiderfyOnMaxZoom: false, iconCreateFunction: function(cluster){
			var childCount = cluster.getChildCount();
			if (childCount == 1){ //There is a problem with _get_clusters() on the first size 1 cluster.
				var min = 1;
				var max = 1;
			} else {
				var clusters = that._get_clusters();
				clusters.sort(function(a, b) {return a.getChildCount() - b.getChildCount();});
				var max = clusters[clusters.length -1].getChildCount();
				var min = clusters[0].getChildCount();
			}
			var color = that.getClusterIconColor(childCount, min, max, {r:255,g:235,b:235}, {r:255, g:0, b:0});
			var icon =  new CSenseClusterDivIcon({color: color, html: '<div><span>' + childCount + '</span></div>', className: 'marker-cluster', iconSize: new L.Point(40, 40) });
			return icon;
		}});
		this.map.addLayer(this.clusterGroup);
		this.clusterGroup.on('click', function (a) {
			if (a.layer.onClick){
				a.layer.onClick();
			}
		});
		this.clusterGroup.on('clustermouseover', function (a) {
			a.layer._bringToFront();
		});
		this.clusterGroup.on('clustermouseout', function (a) {
			a.layer._resetZIndex();
		});
		


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

			//manually close popups to fix bug where label stays on map
			this.currentTaskMarkerGroup.eachLayer(function(layer){
				layer.closePopup();
			});

			this.map.removeLayer(this.currentTaskMarkerGroup);
			this.currentTaskMarkerGroup = null;
		}
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
			var latlng = subs[i].gps_location.split("|");
			if (latlng.length === 2) {

				var latitudelongitude = new L.LatLng(parseFloat(latlng[0]), parseFloat(latlng[1]));
				var submissionId = subs[i].id;
				//var makePing = !this.pingWithinRange(markers, latitudelongitude, 10);
				var makePing = false;

				var mark = new SubmissionMarker(latitudelongitude, submissionId, showCampaigns, makePing);
				mark.bindLabel("Submission "+ submissionId);
				markers.addLayer(mark);
				
			} else {
				//Submission has invalid gps coordinates
			}
		}

		return markers;
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

			this.log("Finished adding layers to cluster group");
			this.log(this.clusterGroup);
			this.log(this._get_clusters());

			this.currentSubmissionsGroup = group;
			this.currentSubmissionsGroupTaskId = task.id;
		}
		if(inEvent.detailDrawerOpen === true){
			this.panToSubmissionsGroup(null, {taskId: task.id}); //Here I am calling an event handler manually, is that bad?
		}
	},

	_get_clusters: function(zoom){
		var desiredZoom = zoom ? zoom : this.map.getZoom();
		var clusters = Array();
		this.clusterGroup._topClusterLevel._recursively(this.clusterGroup.getBounds(), desiredZoom, desiredZoom, function(m) {
			clusters.push(m);
		});
		return clusters;
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
			for (i in campaign.tasks){

				task = campaign.tasks[i];
				//instantiate task marker
				var latlng = this.getLatLngFromDbString(campaign.location); //Note that once database is updated this line will need to change to get location from tasks
				var labelText = "Task "+task.id+"<br/>"+task.submissions.length+" submissions";
				var hoverText = task.instructions;
				var taskMarker = L.marker(latlng)
				taskMarker.task = task;

				taskMarker.bindLabel(labelText, { noHide: true });
				taskMarker.on("mouseover", function(){
					this.updateLabelContent(hoverText);
				});
				taskMarker.on("mouseout", function(){
					this.updateLabelContent(labelText);
				});
				taskMarker.on("click", function(){
					this.waterfall("onTaskMarkerClicked", {task: taskMarker.task});
					//"detailview" the task. Show the details pane in the task pane and put submission markers on the map
					//Should an event trigger the showing of submission markers, or should a direct method call?
				}, this);
				this.taskMarkerGroups[inEvent.campaign.id].addLayer(taskMarker);
				this.taskMarkers[task.id] = taskMarker;
			}
		}
		//Add the markers to the map
		this.taskMarkerGroups[campaign.id].addTo(this.map);
		this.currentTaskMarkerGroup = this.taskMarkerGroups[campaign.id];
		this.currentTaskMarkerGroup.eachLayer(function (layer){
			layer.showLabel();
		});

		this.panToTaskMarkerGroup(null, {campId: campaign.id}); //Here I am calling an event handler manually, is that bad?
	},

	/*

	*/
	adjustMapSize: function(inSender, inEvent){
		this.map.invalidateSize();
		this.map.panBy([inEvent.offset,0],{animate: false, duration: 0});
	},
	/*

	*/
	panToSubmissionsGroup: function(inSender, inEvent){
		var taskId = inEvent.taskId;
		// assert taskId === this.currentSubmissionsGroupTaskId
		this.map.fitBounds(
			this.submissionMarkerGroups[taskId].getBounds().extend(this.taskMarkers[task.id]),
			{pan: {animate: true}}
		);
	},
	/*
	
	*/
	panToTaskMarkerGroup: function(inSender, inEvent){
		var campId = inEvent.campId;
		// assert this.currentTaskMarkerGroup corresponds to campId
		this.map.panTo(this.currentTaskMarkerGroup.getBounds().getCenter());
		//this.map.fitBounds(this.currentTaskMarkerGroup.getBounds(), {pan: {animate: true}});
	},



	getNewSubmissions: function(){
		//var url =  Data.getURL() + "submission.json?after="+String(this.lastSubmissionPoll);
		var url =  "http://localhost:9080/csense/submission.json?after="+String(this.lastSubmissionPoll);

		var ajax = new enyo.Ajax({url: url, method: "GET", handleAs: "json"});
		ajax.response(this, "updateSubmissions"); 
		ajax.go();
		//Poll again in 1.5 seconds
		enyo.job("submissionPoll", enyo.bind(this, "getNewSubmissions"), 1500);
		
	},
	updateSubmissions: function(inSender, inResponse){
		//this.log("updateSubmissions called");
		this.lastSubmissionPoll = inSender.startTime;
		if(inResponse.submissions.length > 0){
			this.log("Got a new submission!")
		}
	},
	updateLastSubmissionPollTime: function(inSedner, inEvent){
		this.lastSubmissionPoll = inEvent.time;
	},

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
		if (val == 1){
			var p = 0;
		} else if (minVal == maxVal){
			var p = 1;
		} else {
			var p = (val - minVal) / (maxVal - minVal);
		}
		var heat = this._heatGradient(1-p);
		return "rgba("+heat.r+","+heat.g+","+heat.b+", 0.6)";

	},
	//http://commons.wikimedia.org/wiki/File:P_hot.gif
	_convertToLight: function(p){
		if (p < 0){ return 0;}
		if (p > 255){ return 255;}
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
