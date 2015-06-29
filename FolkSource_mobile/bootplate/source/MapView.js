enyo.kind({
  name: "MapView",
  kind: "enyo.FittableRows",
  published: {
    doneRendering: false,
    logged_in: false,
    isLocationSelected: false,
    lastTime: 0,
    searched: -1,
    eventFrom: ''
  },
  events: {
    onGPSSet: "",
    onLayerTapped: "",
    onReloadedData: "",
  },
  handlers: {
    onHideCampaigns: "hideCamps",
    onShowCampaigns: "showCamps",
    onFindUserCenter: "userCenter",
    onSearchFieldCleared: "cancelTask"
  },
  components: [
    {kind: "enyo.Signals", onLocationFound: "locSuccess", onPinClicked: "popupTriggered", onLoggedIn: "fetchData", onSearchedLocation: "mapCenterFromSearch"},
    {name: "camps", kind: "enyo.Popup", modal: false, floating: true, autoDismiss: false, showTransitions: true, style: "height: 100px; width: 90%; margin-left: 5%; margin-right: 5%; box-shadow: 0 0 5px #222;", layoutKind: "enyo.FittableRowsLayout", components: [
      {kind: "enyo.Panels", name: "taskpanels", arrangerKind: "enyo.CardArranger", fit: true, style: "min-height: 100%;", components: [
        {kind: "enyo.FittableColumns", style: "height: 100%;", components: [
          {name: "leftButton", kind: "onyx.Button", slide: "prev", ontap: "buttonTapHandler", classes: "button-style filledButtons", disabled: !0, components: [
            {tag: "i", classes: "fa fa-chevron-left fa-2x color-icon"}
          ]},
          {name: "panels", kind: "enyo.Panels", arrangerKind: "enyo.CarouselArranger", fit: true, onTransitionFinish: "transitionFinishHandler", onTransitionStart: "transitionStartHandler", classes: "filledPanels light-background", layoutKind: "enyo.FittableColumnsLayout"},
          {name: "rightButton", kind: "onyx.Button", slide: "next", ontap: "buttonTapHandler", classes: "button-style filledButtons", components: [
            {tag: "i", classes: "fa fa-chevron-right fa-2x color-icon"}
          ]},
        ]},
        {name: "task_content", kind: "enyo.FittableRows", style: "text-align: center;", classes: "light-background", components: [
          {name: "task_ask", content: "To help, please:", classes: "light-background", style: "font-size: 13pt; font-weight: 400; text-align: center;"},
          {name: "task_description", fit: true, style: "text-transform: lowercase; margin-left: auto; margin-right: auto; font-size: 11pt; padding: 5px; width: 80%;",content: "test"},
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

    this.map = L.map(this.$.mapCont.id, {center: [44.981313, -93.266569], zoom: 17});
    this.addMapLayers();
    this.showCamps();
  },
  addMapEventHandlers: function() {
    // this.map.on('resize', enyo.bind(this, "resizeMap"));
    // this.vectors.on('ontilesloaded', enyo.bind(this, "vectorsLoaded"));
    // this.vectors.on('')
  },
  addMapLayers: function() {
    L.tileLayer('http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png').addTo(this.map);
    this.vectors = new L.TileLayer.MVTSource({
      url: 'http://innsbruck-umh.cs.umn.edu/tiles/all/{z}/{x}/{y}.mapbox',
      style: function(feature, context) {
        var style={};
        if(feature.properties.outcome === 'n') {
          style.color = "rgba(123,50,148,0.7)";
        } else if(feature.properties.outcome === 'y') {
          style.color = "rgba(0,136,55,0.7)";
        } else {
          style.color = "rgba(64,64,64,0.7)";
        }

        if(feature.type === 1 ){ //Point
          style.radius = 10;
          style.selected = {
            // color: style.color,
            color: "rgba(219, 112, 30, 0.7)",
            radius: style.radius,
          }
        } else { // Polygon
          style.selected = {
            color: style.color,
            outline: {
              color: "rgba(219, 112, 30, 0.7)",
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
      onClick: enyo.bind(this, "makeBubbleClick"),
      onTilesLoaded: enyo.bind(this, "vectorsLoaded"),
    });
    this.map.addLayer(this.vectors);
    this.addMapEventHandlers();
    this.doneRendering = true;
  },
  cancelTask: function(inSender, inEvent) {
    if(this.isLocationSelected) {
      this.$.taskpanels.setIndex(0);
      this.deselectMap();
    }
    this.isLocationSelected = false;
  },
  drawMap: function (inSender, inEvent) { //inSender = a, inEvent = b;
    var panels = this.$.panels.getPanels();
    if(this.logged_in === true) {
      for (var x in panels) {
        this.sendTasks();
      }
    }

    this.map.invalidateSize();
    return !0;
  },
  clickMap: function() {
    if(this.searched == -1 || this.eventFrom == -1) {
      return;
    }
    this.map.fireEvent('click', {
      latlng: this.searched,
      layerPoint: this.map.latLngToLayerPoint(this.searched),
      containerPoint: this.map.latLngToContainerPoint(this.searched)
    });
  },
  deselectMap: function() {
    this.eventFrom = 'deselect';
    this.clickMap();
  },
  triggerTask: function(inSender, inEvent) {
    //figure out
    this.log(this.$.task_description.data);
    this.bubbleUp("onPlaceChosen", {data: this.$.task_description.data, location_id: this.$.task_description.location_id});
    this.deselectMap();
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
    var url = Data.getURL() + "campaign.json";
    var ajax = new enyo.Ajax({method: "GET", cacheBust: false, url: url, handleAs: "json", headers: {AuthToken: LocalStorage.get("authtoken")}});
    ajax.response(this, "renderResponse");
    ajax.go();
  },
  deleteAndReCreateCampaigns: function(camp_data, panel_name, item_name) {
    if(this.$.panels.getComponents().length > 0) {
      this.$.panels.destroyComponents();
    }
    this.$.panels.createComponent(
      {name: panel_name, classes: "panelItem white-text", fit: true, data: camp_data, kind: "enyo.FittableRows", components: [
      {name: item_name, style: "text-align: center;", kind: "CampaignItem", title: "" + camp_data.title, description: "" + camp_data.description},
    ]});
  },
  renderResponse: function (a, b) {
    this.campaignArray = b.campaigns;
    var remove = [];
    for (var c in this.campaignArray) {
      var currentCampaign = this.campaignArray[c];
      var panel_name = "panel_" + currentCampaign.id;
      var item_name = "item_" + currentCampaign.id;
      /*
       * This block below is needed because not all browsers parse dates
       * the same way. This should be mostly browser compatible.
       */
      var date = Date.parse(new Date());
      /*var st = currentCampaign.start_date_string.split(/[- :]/);
        var en = currentCampaign.end_date_string.split(/[- :]/);
        var startDate = Date.parse(new Date(st[0], st[1]-1, st[2], st[3], st[4], st[5]));
        var endDate = Date.parse(new Date(en[0], en[1]-1, en[2], en[3], en[4], en[5]));*/

      //if(endDate >= date) { // "closed" campaigns shouldn't show up
      //if(currentCampaign.title !== undefined) {
      this.deleteAndReCreateCampaigns(currentCampaign, panel_name, item_name)
    }

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
    var real_height = -4*(height/5); //put the bottom of the campaign list at 4/5 the height of the map
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
    var latlng = new L.LatLng(coords.latitude, coords.longitude);

    if (!this.userMarker) {
      this.userMarker = L.userMarker(latlng, {smallIcon: true}).addTo(this.map);
      this.map.setView(latlng, 17, {animate: true});
    }

    this.userMarker.setLatLng(latlng);
    this.userMarker.setAccuracy(coords.accuracy);
    this.resize();
    var nowTime = Date.now();
    if(nowTime - this.lastTime > 60000) {
      var url = "http://nominatim.openstreetmap.org/reverse?format=json&lat="+coords.latitude+"&lon="+coords.longitude//+"&zoom=18"
      var ajax = new enyo.Ajax({url: url, method: "GET", cacheBust: false});
      ajax.response(this, "nominatimResponse");
      ajax.go();
      this.lastTime = Date.now();
    }

    return true;
  },
  checkMap: function (a) {
    this.locations = a;
  },
  resizeMap: function() {
    this.map.invalidateSize();
    return;
  },
  vectorsLoaded: function(inSender, inEvent) {
    this.log(this.eventFrom);
    if(this.eventFrom == -1) {
      return;
    }
    if(this.searched != -1) {
      this.eventFrom = 'vectors';
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
      this.$.lenses.getNominatimName(osm_id, layer_name);
      this.$.task_description.location_layer = layer_name;
      this.log("chosen");
    }
  },
  makeBubbleClick: function (inEvent) {
    this.isLocationSelected = true;
    if(!inEvent.feature ||
       this.eventFrom == -1 ||
       inEvent.feature.properties.type === 'seed_voting') {
      return;
    }
    if(inEvent.feature.selected) {

      this.setTaskPanel(inEvent.feature.properties.osm_id, inEvent.feature.layer.name);
      this.$.taskpanels.setIndex(1);
      this.eventFrom = -1;
    } else {
      if(this.eventFrom === 'dselect') {
        this.$.taskpanels.setIndex(0);
        this.log('cleared');
        this.searched = -1;
      }
    }

    /*if(this.searched === 'deslect') {
      this.searched = -1;
      this.eventFrom = -1;
    }*/
    this.$.lenses.endLoading();
    return;
  },
  mapCenterFromSearch: function(inSender, inEvent) {
    var ll = L.latLng(inEvent.lat, inEvent.lon)
    this.searched = ll;
    this.map.panTo(ll);
    this.vectors.redraw();
    return;
  },
  nominatimResponse: function(inSender, inEvent) {
    enyo.Signals.send("onGPSCoordLookup", {display: inEvent.display_name, osm_id: inEvent.osm_id});
    return;
  },
  userCenter: function() {
    var ll = this.userMarker.getLatLng();
    this.map.panTo(ll);
    return;
  },
  sendTasks: function() {
    var tasks = this.campaignArray[this.$.panels.getIndex()].tasks;
    var tmp = [];
    for(var y in tasks) {
      tmp.push(tasks[y].locations);
    }
    var tmp2 = [];
    tmp2 = tmp2.concat.apply(tmp2, tmp);
    this.checkMap(tmp2);
  },

});
