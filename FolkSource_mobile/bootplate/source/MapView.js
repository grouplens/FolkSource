enyo.kind({
  name: "MapView",
  kind: "enyo.FittableRows",
  published: {
    logged_in: false,
    lastTime: 0,
    searched: -1,
    eventFrom: -1,
    panning: false
  },
  events: {
    onGPSSet: "",
    onLayerTapped: "",
    onReloadedData: "",
  },
  handlers: {
    onHideCampaigns: "hideCamps",
    onSenseClosed: "resetAfterSense",
    onFindUserCenter: "userCenter",
    onSearchFieldCleared: "cancelTask"
  },
  components: [
    {kind: "enyo.Signals", onLocationFound: "locSuccess", onPinClicked: "popupTriggered", onLoggedIn: "fetchData", onSearchedLocation: "mapCenterFromSearch"},
    {name: "camps", kind: "enyo.Popup", modal: false, floating: true, autoDismiss: false, showTransitions: true, style: "height: 110px; width: 90%; margin-left: 5%; margin-right: 5%; box-shadow: 0 0 5px #222;", layoutKind: "enyo.FittableRowsLayout", components: [
      {kind: "enyo.Panels", name: "taskpanels", arrangerKind: "enyo.CardArranger", draggable: false, fit: true, style: "min-height: 100%;", components: [
        {kind: "enyo.FittableColumns", style: "height: 100%;", components: [
          {name: "leftButton", kind: "onyx.Button", slide: "prev", ontap: "buttonTapHandler", classes: "button-style filledButtons", disabled: !0, components: [
            {tag: "i", classes: "fa fa-chevron-left fa-2x color-icon"}
          ]},
          {name: "panels", kind: "enyo.Panels", arrangerKind: "enyo.CarouselArranger", fit: true, onTransitionFinish: "transitionFinishHandler", onTransitionStart: "transitionStartHandler", classes: "filledPanels light-background", layoutKind: "enyo.FittableColumnsLayout"},
          {name: "rightButton", kind: "onyx.Button", slide: "next", ontap: "buttonTapHandler", classes: "button-style filledButtons", components: [
            {tag: "i", classes: "fa fa-chevron-right fa-2x color-icon"}
          ]},
        ]},
        {name: "task_content", kind: "enyo.FittableRows", classes: "light-background", components: [
          {name: "task_ask", content: "To help, please:", classes: "light-background", style: "font-size: 13pt; font-weight: 400; text-align: center;"},
          {name: "task_description", fit: true, style: "text-transform: lowercase; margin-left: auto; margin-right: auto; font-size: 9pt; padding: 3px; width: 80%;",content: "test"},
          {name: "buttons", /*kind: "enyo.ToolDecorator",*/ classes: "senseButtons", style: "text-align: center;", components: [
            {name: "submit", kind: "onyx.Button", style: "width: 80%;", classes: "button-style button-style-affirmative", ontap: "triggerTask", components: [
              {content: "Sure!"}
            ]}
          ]}
        ]}
      ]}
    ]},
    {name: "lenses", kind: "LensShifter"},
    {name: "mapCont", fit: true, style: "position: relative;"}
  ],
  create: function (a) {
    this.inherited(arguments);
    this.log("CREATE");
    this.hideCamps();
  },
  buttonTapHandler: function (a, b) {
    if(a.slide === "prev") {
      this.$.panels.previous();
    } else if(a.slide === "next") {
      this.$.panels.next();
    } else {
      this.$.panels.snapTo(a.slide);
    }
  },
  rendered: function () {
    this.inherited(arguments);

    this.log("RENDERED");
    this.showCamps();
  },
  addMapEventHandlers: function() {
    // put map handlOers here if you want them
    // this.map.on('load', enyo.bind(this, 'addVectorLayer'));
    this.map.on('movestart', enyo.bind(this, function() {
      this.panning = true;
    }));
    this.map.on('moveend', enyo.bind(this, function() {
      this.panning = false;
    }));
    this.addMapLayers();
  },
  addMapLayers: function() {
    L.tileLayer('http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png').addTo(this.map);
    this.addVectorLayer();

  },
  addVectorLayer: function(inSender, inEvent) {
    this.vectors = new L.TileLayer.MVTSource({
      url: 'http://innsbruck-umh.cs.umn.edu/tiles/all/{z}/{x}/{y}.mapbox',
      style: function(feature, context) {
        var style={};
        var selectColor = "rgba(219, 112, 30, 0.7)";

        if(feature.properties.outcome === 'n') {
          style.color = "rgba(123,50,148,0.7)";
        } else if(feature.properties.outcome === 'y') {
          style.color = "rgba(0,136,55,0.7)";
        } else {
          style.color = "rgba(64,64,64,0.7)";
        }

        if(feature.type === 1 ){ //Point
          style.radius = 7;
          style.selected = {
            color: selectColor,
            radius: style.radius,
          }
        } else { // Polygon
          style.selected = {
            color: style.color,
            outline: {
              color: selectColor,
              size: 5
            }
          }
        }
        return style;
      },
      mutexToggle: true,
      getIDForLayerFeature: function(feature) {
        if(feature.type === 2) {
          feature.type = 3;
        }
        return Number(feature.properties.uid);
      },
      onClick: enyo.bind(this, "clickHandler"),
      onTilesLoaded: enyo.bind(this, "vectorsLoaded")
    });
    this.map.addLayer(this.vectors);
  },
  cancelTask: function(inSender, inEvent) {
    this.log("canceling 2");
    if(this.searched) {
      this.$.taskpanels.setIndex(0);
      this.deselectMap();
    }
  },
  cancelTaskWithoutClicking: function() {
    this.log(this.searched)
    if(this.searched) {
      this.$.lenses.clearFieldWithoutClicking();
      this.$.taskpanels.setIndex(0);
      this.$.lenses.endLoading();
      this.clearTapData();
    }
  },
  drawMap: function (inSender, inEvent) { //inSender = a, inEvent = b;
    var panels = this.$.panels.getPanels();
    if(this.logged_in === true) {
      for (var x = 0; x < panels.length; x++) {
        this.sendTasks();
      }
    }
  },
  clickMap: function() {
    this.log(this.searched + " " + this.eventFrom);
    if(this.searched == -1 || this.eventFrom == -1) {
      return;
    }
    this.log("clicking map");
    this.log(this.searched);
    this.map.fireEvent('click', {
      latlng: this.searched,
      layerPoint: this.map.latLngToLayerPoint(this.searched),
      containerPoint: this.map.latLngToContainerPoint(this.searched)
    });
  },
  deselectMap: function() {
    this.log("deselecting")
    this.eventFrom = 'deselect';
    this.clickMap();
  },
  triggerTask: function(inSender, inEvent) {
    //figure out
    this.log(this.$.task_description.data);
    this.bubbleUp("onPlaceChosen", {data: this.$.task_description.data, location_id: this.$.task_description.location_id});
  },
  setTasks: function(inSender, inEvent) {
    var i = inEvent.index;
    this.$.task_desc.setContent(this.tasks[i].instructions);
    this.$.task_desc.data = this.tasks[i];
    if(inSender.isSelected(i)) {
      this.$.task_description.setContent(this.tasks[i].instructions);
      this.$.task_description.data = this.tasks[i];
      this.$.taskpanels.setIndex(1);
    }
  },
  fetchData: function() {
    if(this.logged_in === false) {
      this.logged_in = true;
    }
    var url = Data.getURL() + "campaign/campaigns";
    var ajax = new enyo.Ajax({method: "GET", cacheBust: false, url: url, handleAs: "json", headers: {AuthToken: LocalStorage.get("authtoken")}});
    ajax.response(this, "renderResponse");
    ajax.go();
    return;
  },
  deleteAndReCreateCampaigns: function(camp_data) {
    if(this.$.panels.getComponents().length > 0) {
      this.$.panels.destroyComponents();
    }

    for (var c = 0; c < camp_data.length; c++) {
      var currentCampaign = camp_data[c];
      var panel_name = "panel_" + currentCampaign.id;
      var item_name = "item_" + currentCampaign.id;
      if(currentCampaign.id != undefined) {
        this.$.panels.createComponent(
          {name: panel_name, classes: "panelItem white-text", fit: true, data: currentCampaign, kind: "enyo.FittableRows", components: [
            {name: item_name, style: "text-align: center;", kind: "CampaignItem", title: "" + currentCampaign.title, description: "" + currentCampaign.description},
          ]}
        );
      }
    }
  },
  renderResponse: function (a, b) {
    // this.log(JSON.stringify(b));
    this.campaignArray = b;

    this.deleteAndReCreateCampaigns(this.campaignArray);

    enyo.Signals.send("onCampLoaded");

    this.$.panels.render();
    this.checkSides(); // make sure the arrow buttons work
    this.showCamps();
    this.drawMap();
    this.doReloadedData();
  },
  showTasks: function(inSender, inEvent) {
    this.$.taskpanels.setIndex(1);
  },
  showCamps: function() {
    this.$.taskpanels.setIndex(0);
    var height = parent.innerHeight;
    var real_height = -3*(height/4); //put the bottom of the campaign list at 4/5 the height of the map
    this.$.camps.showAtPosition({bottom: real_height});
  },
  hideCamps: function(inSender, inEvent) {
    this.$.camps.setShowing(false);
  },
  checkSides: function () {
    var index = this.$.panels.getIndex();
    var size = this.$.panels.getPanels().length;
    var adjSize = size - 1; //adjust for counting at 0 vs. 1
    this.$.rightButton.setDisabled(false);
    this.$.leftButton.setDisabled(false);
    if (this.campaignArray !== undefined) {
      if (index !== 0 && adjSize !== 0) {
        if (index === 0) {
          this.$.rightButton.setDisabled(false);
          this.$.leftButton.setDisabled(true);
        } else if (index === adjSize && index !== 0) {
          this.$.rightButton.setDisabled(true);
          this.$.leftButton.setDisabled(false);
        }
      } else {
          this.$.rightButton.setDisabled(true);
          this.$.leftButton.setDisabled(true);
      }
    }
  },
  transitionFinishHandler: function (a, b) {
    var c = this.$.panels.getIndex();
    this.drawMap();
    this.checkSides();
  },
  transitionStartHandler: function (a, b) {
    var c = this.$.panels.getIndex();
  },
  locSuccess: function (a, b) {
    var coords = b.coords;
    var latlng = L.latLng(coords.latitude, coords.longitude);

    if(!this.map) {
      this.map = L.map(this.$.mapCont.id, {center: latlng, zoom: 17, zoomControl: false, attributionControl: false});
      this.addMapEventHandlers();
    }

    if (!this.userMarker) {
      this.userMarker = L.userMarker(latlng, {smallIcon: true}).addTo(this.map);
    }

    this.userMarker.setLatLng(latlng);
    this.userMarker.setAccuracy(coords.accuracy);
    // this.resize();
    var nowTime = Date.now();
    if(nowTime - this.lastTime > 60000) {
      this.lastTime = Date.now();
      this.userCenter();
    }

    return true;
  },
  resizeMap: function() {
    this.map.invalidateSize();
    return;
  },
  resetAfterSense: function(inSender, inEvent) {
    this.showCamps();
    this.$.lenses.clearField();
    return;
  },
  vectorsLoaded: function(inSender, inEvent) {
    this.log(this.searched + " " + this.eventFrom);
    if(this.searched != -1) {
      this.log(this.searched + " " + this.eventFrom);
      this.clickMap();
    }
  },
  setTaskPanel: function(osm_id, layer_name) {
    this.tasks = this.campaignArray[this.$.panels.getIndex()].tasks;
    if(this.tasks.length > 1) {
      this.$.tasks.setCount(this.tasks.length);
      this.$.tasks.reset();
      this.$.taskpanels.setIndex(2);
    } else {
      this.$.task_description.setContent(this.tasks[0].instructions);
      this.$.taskpanels.setIndex(1);
      this.$.task_description.data = this.tasks[0];
      this.$.task_description.location_id = osm_id;
      this.$.task_description.location_layer = layer_name;
    }
  },
  clearTapData: function() {
    this.eventFrom = -1;
    this.searched = -1;
    return;
  },
  clickHandler: function (inEvent) {
    this.$.lenses.startLoading();
    if(!inEvent.feature) {
      this.log("no feature")
      if(this.eventFrom === 'gps') {
        this.clearTapData();
      }
      this.$.lenses.endLoading();
      return;
    }

    var osm_id = inEvent.feature.properties.osm_id;
    var layer_name = inEvent.feature.layer.name;

    if(this.eventFrom === 'deselect') {
      this.$.taskpanels.setIndex(0);
      this.log("click handler deselected");
      this.$.lenses.endLoading();
      // return;
    }

    // if(inEvent.feature.properties.type === 'seed_voting') {
    // }
    if(inEvent.feature.selected && inEvent.feature.properties.type !== 'seed_voting') {
      this.setTaskPanel(osm_id, layer_name);
      this.$.taskpanels.setIndex(1);

      if(this.eventFrom == -1) {
        this.log("user tapped the map");
        this.searched = L.latLng(inEvent.latlng.lat, inEvent.latlng.lng);
        this.eventFrom = 'user';
        this.$.lenses.reverseNominatimSearch(osm_id, layer_name);
      }
    } else {
      this.log("not selected or yes seed_voting")
      this.log(inEvent.feature.properties.osm_id);
      inEvent.feature.deselect();
      this.cancelTaskWithoutClicking()
      this.$.lenses.endLoading();
    }

    if(this.eventFrom === 'deselect') {
      this.clearTapData();
    }
    return;
  },
  panToLocation: function(latlng) {
    this.searched = latlng;
    if(this.map.getBounds().contains(this.searched)) {
      this.clickMap();
    } else {
      this.map.panTo(this.searched, {animate: true});
    }
  },
  mapCenterFromSearch: function(inSender, inEvent) {
    var ll = L.latLng(inEvent.lat, inEvent.lon)
    this.eventFrom = 'search';
    this.$.lenses.startLoading();
    this.panToLocation(ll);
    return;
  },
  userCenter: function() {
    var ll = this.userMarker.getLatLng();
    if(this.eventFrom === -1) {
      this.eventFrom = 'gps';
      this.$.lenses.startLoading();
      this.panToLocation(ll)
    }
    return;
  },
  sendTasks: function() {
    var tasks = this.campaignArray[this.$.panels.getIndex()].tasks;
    var tmp = [];
    for(var y in tasks) {
      tmp.push(tasks[y].locations);
    }
    this.locations = [].concat.apply([], tmp);
  },

});
