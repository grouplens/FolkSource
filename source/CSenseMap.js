enyo.kind({
	name: "CSenseMap", style: "position: relative;", fit: true, components: [
		{name: "addLocationsAndRegionsToolbar", kind: "onyx.Drawer", open: false, style: "position: absolute !important; z-index: 100; right: 0px;",components:[
			{name: "addLandRRadioGroup", kind: onyx.RadioGroup, components:[
				{name: "addLocationButton", kind: onyx.RadioButton, content: "Add Location"},
				{name: "addRegionButton", kind: onyx.RadioButton, content: "Add Region"}
			]}
		]},
		{name: "modifyToolbar", kind: "onyx.Drawer", open: false, style: "position: absolute !important; z-index: 10; right: 0px;",components:[
			{kind: enyo.ToolDecorator, components:[
				{name: "undoButton", kind: onyx.Button, content: "Undo", classes: "onyx-radiobutton", style:"margin-right: 8px; border-radius: 3px 3px 3px 3px;"},
				{name: "modifyRadioGroup", kind: onyx.RadioGroup, components:[
					{name: "modifyFeaturesButton", kind: onyx.RadioButton, content: "Edit"},
					{name: "removeFeaturesButton", kind: onyx.RadioButton, content: "Remove"}
				]}
			]}
		]}
	],

	events: {
		"onMapRendered": "",
	},


	/*=================================*/
	/*===== General Map Functions =====*/
	/*=================================*/

	rendered: function(){
		this.inherited(arguments);
		this.mapInitialization();
		this.drawingInitialization();
		this.doMapRendered();
	},

	mapInitialization: function(){
		this.map = L.map(this.id, {closePopupOnClick: false, maxZoom: 17}).setView([44.981313, -93.266569], 13);
		L.tileLayer("http://acetate.geoiq.com/tiles/acetate-hillshading/{z}/{x}/{y}.png", {
			attribution: "Map data &copy; OpenStreetMap contributors"
		}).addTo(this.map);
	},

	/*=================================*/
	/*===== Map Drawing Functions =====*/
	/*=================================*/

	/*
		Initialize all instance variables / event handlers needed for drawing, editing, and undoing.
	*/
	drawingInitialization: function (){

		this.undoStack = new Array();
		this.drawnItems = new L.FeatureGroup().addTo(this.map); //Drawn polygons and markers will be stored in the drawnItems group

		//Add a draw control with all the buttons hidden
		this.drawControl = new L.Control.Draw({draw: {polyline: false, rectangle: false, circle: false, polygon: false, marker: false}});
		this.map.addControl(this.drawControl);

		//Remove one of the default tooltips
		L.drawLocal.edit.tooltip.subtext = null;

		this.map.on("draw:created", enyo.bind(this, "createdDrawing"));

		//Create Draw objects to be enabled later by our buttons
		this.drawPolygon = new L.Draw.Polygon(this.map, this.drawControl.options.polygon);
		this.drawMarker = new L.Draw.Marker(this.map, this.drawControl.options.marker);
		this.editor = new L.EditToolbar.Edit(this.map, {featureGroup: this.drawnItems, });
		this.remover = new L.EditToolbar.Delete(this.map, {featureGroup: this.drawnItems});

		//This event handler allows for the undoing of deletes
		this.drawnItems.on("layerremove", function(e){
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
				//When a polygon is edited
				e.layer.on("edit", function (ev){
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


	//// MODE ENABLING
	/*
		This function disables all leaflet.draw controls and activates the marker placement control.
	*/
	enableMarkerPlacementMode: function(inSender, inEvent) {
		//disable any other drawers that may be active
		this.deactivateEditing();
		this.$.addLocationButton.setActive(true);
		this.drawMarker.enable();
		this.fixTooltip(this.drawMarker._tooltip._container); //Don't show tooltip in the upper left hand corner as is the default initial behavior
	},
	/*
		This function disables all leaflet.draw controls and activates the polygon placement control.
	*/
	enablePolygonPlacementMode: function(inSender, inEvent) {
		this.deactivateEditing();
		this.$.addRegionButton.setActive(true);
		this.drawPolygon.enable();
		this.fixTooltip(this.drawPolygon._tooltip._container);//Don't show tooltip in the upper left hand corner as is the default initial behavior
	},
	/*
		This function disables all leaflet.draw controls and activates the leaflet.draw edit control.
	*/
	enableModifyMode: function(inSender, inEvent) {
		this.deactivateEditing();
		this.$.modifyFeaturesButton.setActive(true);
		this.editor.enable();
		this.fixTooltip(this.editor._tooltip._container);

		//Save original state of the verticies for each polygon.
		this.drawnItems.eachLayer(function (layer) {
			if (layer instanceof L.Polygon){
				layer.prevState = L.LatLngUtil.cloneLatLngs(layer.getLatLngs());
			}
		}, this);
	},
	/*
		This function disables all leaflet.draw controls and activates the leaflet.draw remove control.
	*/
	enableRemoveMode: function(inSender, inEvent) {
		this.deactivateEditing();
		this.$.removeFeaturesButton.setActive(true);
		this.remover.enable();
		this.fixTooltip(this.remover._tooltip._container);
	},


	//// MODE DISABLING
	/*
		Disables all leaflet.draw controls and saves any changes that have been made. Also clears selected
		buttons corresponding to the leaflet.draw controls.
	*/
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
	/*
		Deactivates editing AND hides the editing interface.
	*/
	deactivateEditingInterface: function(inSender, inEvent){
		this.deactivateEditing();

		this.$.addLocationsAndRegionsToolbar.setOpen(false);
		this.$.modifyToolbar.setOpen(false);

		//TODO: I think this.$.modificationRadioGroup doesn't exist. Git rid of this if it doesn't.
		if (this.$.modificationRadioGroup !== undefined){
			this.$.modificationRadioGroup.setActive(null);
		}
	},


	//// UNDOING
	/*
		Undo the latest change made to the markers or polygons on the map.
	*/
	undo: function(){
		var action = this.undoStack.pop();

		if (action != undefined){
			if (action.type == "remove"){
				this.drawnItems.addLayer(action.layer);
			} else if (action.type == "move"){
				action.layer.setLatLng(action.originalLatLng);
			} else if (action.type == "movePolygon"){
				this.deactivateEditing();
				action.layer.setLatLngs(action.verticies);
				this.enableModifyMode();
			}
		}
	},
	/*
		Pushes marker move information onto the undo stack.
	*/
	pushMarkerState: function (e){
		this.undoStack.push({type:"move", layer: e.target, originalLatLng: e.target.getLatLng()});
	},


	//// SAVING CHANGES
	/*
		This function is invoked after a drawing action has completed. It adds the newly drawn layer
		to the map and reenables whichever drawing service was previously active (L.Draw.Marker or
		L.Draw.Polygon).
	*/
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


	//// HELPERS
	/*
		This function fixes a graphical bug with the given tooltipContainer.
		Without this fix the tooltip will show in the upper left hand corner until the user
		moves the mouse.
	*/
	fixTooltip: function (tooltipContainer) {
		L.DomUtil.addClass(tooltipContainer, "hidden");
		this.tooltip = tooltipContainer;
		this.map.on("mousemove", this.showTooltip, this);
	},
	/*
		fixTooltip helper function
	*/
	showTooltip: function () {
		L.DomUtil.removeClass(this.tooltip, "hidden");
		this.map.off("mousemove", this.showTooltip, this);
	},

})
