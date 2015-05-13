enyo.kind({
  name: "NewMap",
  kind: enyo.FittableRows,
  //classes: "bordering-box light-background",
  published: {
    gpsTimeout: "10000"
  },
  components: [
    {kind: enyo.Signals, onLocationFound: "locSuccess", onPinClicked: "popupTriggered", onLoggedIn: "fetchData", onSearchedLocation: "mapCenterFromSearch"},
    /*{name: "spinUp", kind: onyx.Popup, centered: true, floating: true, autoDismiss: false, classes: "dark-background-flat", components: [
      {name: "spin", kind: onyx.Spinner, classes: "onyx-dark dark-background"}
    ]},*/
    {content: "Tap the pin/region on the map to help!", style: "font-size: 11pt; font-weight: 100; text-align: center; padding: 3px;", classes: "light-background"},
    {name: "camps", kind: enyo.Popup, modal: false, floating: true, autoDismiss: false, showTransitions: true, style: "height: 100px; width: 90%; margin-left: 5%; margin-right: 5%; box-shadow: 2px 2px 2px  #222;", layoutKind: enyo.FittableRowsLayout, components: [
      {kind: enyo.Panels, name: "taskpanels", arrangerKind: enyo.CardArranger, fit: true, style: "min-height: 100%;", components: [
        {kind: enyo.FittableColumns, style: "height: 100%;", components: [
          {name: "leftButton", kind: onyx.Button, slide: "prev", ontap: "buttonTapHandler", classes: "button-style filledButtons", disabled: !0, components: [
            {tag: "i", classes: "fa fa-chevron-left fa-2x color-icon"}
          ]},
          {name: "panels", kind: enyo.Panels, arrangerKind: enyo.CarouselArranger, fit: true, onTransitionFinish: "transitionFinishHandler", onTransitionStart: "transitionStartHandler", classes: "filledPanels light-background", layoutKind: enyo.FittableColumnsLayout},
          {name: "rightButton", kind: onyx.Button, slide: "next", ontap: "buttonTapHandler", classes: "button-style filledButtons", components: [
            {tag: "i", classes: "fa fa-chevron-right fa-2x color-icon"}
          ]},
        ]},
        {name: "task_content", kind: enyo.FittableRows, components: [
          {name: "task_description", fit: true, classes: "dark-background", style: "font-size: 11pt; padding: 5px;",content: "test"},
          {name: "buttons", kind: enyo.ToolDecorator, classes: "senseButtons", components: [
            {name: "remove", kind: onyx.Button, classes: "button-style button-style-negative", ontap: "cancelTask", components: [
              {tag: "i", classes: "fa fa-ban fa-large"}
            ]},
            {name: "submit", kind: onyx.Button, classes: "button-style button-style-affirmative", ontap: "triggerTask", components: [
              {tag: "i", classes: "fa fa-check fa-large"}
            ]}
          ]}
        ]}
      ]}
    ]},
    {name: "mapCont", fit: true, style: "position: relative;"}
  ],
  events: {
    onLoaded: "",
    onPinClicked: "",
    onGPSSet: "",
    onPlaceChosen: ""
  },
  eventStarted: !1,
  handlers: {
    //onSnapping: "turnOffMap",
    //onSnapped: "resetPins",
    onHideCampaigns: "hideCamps",
    onShowCampaigns: "showCamps"
  },
  create: function (a) {
    this.inherited(arguments);
    this.doneRendering = false;
    //this.$.gps.setTimeout(this.gpsTimeout);
    userMoved = false;
    loaded = false;
    this.panZoomed = false;
    this.firstTime = true;
    this.notShowing = true;
    this.locSuc = false;
    this.panned = false;
    this.dragged = false;
    this.loaded = false;
    this.logged_in = false;
    this.pointsLayer = L.featureGroup();
    this.polygonsLayer = L.featureGroup();
    /*this.$.taskpanels.getAnimator().setDuration(750);
    this.$.panels.getAnimator().setDuration(750);*/
    this.hideCamps();
    this.lastTime = -1;
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
    //this.$.gps.getPosition();

    this.map = L.map(this.$.mapCont.id).setView([44.981313, -93.266569], 15);
    this.map.on('resize', enyo.bind(this, "resizeMap"));
    this.map.on('zoomend', enyo.bind(this, "resetZoomed"));
    this.map.on('dragend', enyo.bind(this, "resetPanned"));
    L.tileLayer('http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png',{
      attribution: 'Map tiles by <a href="http://cartodb.com/attributions#basemaps">CartoDB</a>, under <a href="https://creativecommons.org/licenses/by/3.0/">CC BY 3.0</a>. Data by <a href="http://www.openstreetmap.org/">OpenStreetMap</a>, under ODbL.'
    }).addTo(this.map);


    L.tileLayer('http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png').addTo(this.map);
    var vectors = new L.TileLayer.MVTSource({
      url: 'http://innsbruck-umh.cs.umn.edu/tiles/buildings/{z}/{x}/{y}.mapbox',
      style: function(feature, context) {
        var style={};
        if(feature.type === 1) {
          style.radius = 3;
        }
        if(feature.properties.allowed === 'n') {
          style.color = "rgba(123,50,148,0.7)";
          style.size=5;
        } else if(feature.properties.allowed === 'y') {
          style.color = "rgba(0,136,55,0.7)";
          style.size=5;
        } else {
          style.color = "rgba(64,64,64,0.7)";
          style.size=5;
        }
        return style;
      },
      mutexToggle: true,
      getIDForLayerFeature: function(feature) {
        if(feature.type === 2) {
          feature.type = 3;
        }
        feature.properties.task_id=59;
        //return Number(feature.properties.id);
        return Number(feature.properties.uid);
      },
      onClick: enyo.bind(this, "makeBubbleClick")
    });
    this.map.addLayer(vectors);


    //this.$.spin.start();
    this.showCamps();
    this.doneRendering = true;
  },
  testClick: function(inEvent) {
      console.log("CLICK");
  },
  mapLoaded: function() {
    this.loaded = true;
    this.doLoaded();
  },
  cancelTask: function(inSender, inEvent) {
    this.$.taskpanels.setIndex(0);
  },
  drawMap: function (inSender, inEvent) { //inSender = a, inEvent = b;
    var panels = this.$.panels.getPanels();
    var d = 0;
    var e;
    if(this.logged_in === true) {
      for (var x in panels) {
        this.sendTasks();
      }
    }
    if(this.doneRendering) {
      this.map.invalidateSize();
    }
    return !0;
  },
  triggerTask: function(inSender, inEvent) {
    //figure out
    this.log(this.$.task_description.data);
    this.bubbleUp("onPlaceChosen", {data: this.$.task_description.data, location_id: this.$.task_description.location_id});
    //this.doPlaceChosen({data: this.$.task_description.data});
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
  renderResponse: function (a, b) {
    this.campaignArray = b.campaigns;
    var remove = [];
    for (var c in this.campaignArray) {
      var currentCampaign = this.campaignArray[c];
      var e = "panel_" + currentCampaign.id;
      var f = "item_" + currentCampaign.id;
      var g = "map_" + currentCampaign.id;
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
      this.$.panels.createComponent(
        {name: e, classes: "panelItem", fit: true, data: this.campaignArray[c], kind: enyo.FittableRows, components: [
        {name: f, kind: "CampaignItem", title: "" + currentCampaign.title, description: "" + currentCampaign.description},
      ]});
      /*} else {
        remove.push(c);
        }*/
    }

    enyo.Signals.send("onCampLoaded");

    this.$.panels.render();
    this.checkSides(); // make sure the arrow buttons work
    this.showCamps();
    this.drawMap();
  },
  showTasks: function(inSender, inEvent) {
    this.$.taskpanels.setIndex(1);
  },
  showCamps: function() {
    if(this.doneRendering) {
      this.map.invalidateSize();
    }
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
    this.resetPins();
    this.drawMap();
    this.checkSides();
  },
  transitionStartHandler: function (a, b) {
    var c = this.$.panels.getIndex();
    this.turnOffMap();
  },
  locSuccess: function (a, b) {
    var coords = b.coords;
    var latlng = new L.LatLng(coords.latitude, coords.longitude);

    if (!this.userMarker) {
      this.userMarker = L.userMarker(latlng, {smallIcon: true}).addTo(this.map);
    }

    this.userMarker.setLatLng(latlng);
    this.userMarker.setAccuracy(coords.accuracy);
    this.resized();
    if(this.lastTime === -1) {
      this.lastTime = Date.now();
    }
    var nowTime = Date.now();
    if(nowTime - this.lastTime > 5000) {
      var url = "http://nominatim.openstreetmap.org/reverse?format=json&osm_type=W&lat="+coords.latitude+"&lon="+coords.longitude+"&zoom=18"
      var ajax = new enyo.Ajax({url: url, method: "GET", cacheBust: false});
      ajax.response(this, "nominatimResponse");
      ajax.go();
    }

    if(!this.dragged && !this.panned) {
      // TODO fix back in MN
      //this.map.setView(latlng, 15, {animate: true});
    }
    return true;
  },
  checkMap: function (a) {
    this.locPlot(a);
  },
  locPlot: function (a) {
    this.locations = a;
    this.points = [];
    this.polygons = [];
    //this.addMarkers();
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
    if(this.doneRendering) {
      this.pointsLayer.clearLayers();
      this.map.removeLayer(this.pointsLayer);
      this.polygonsLayer.clearLayers();
      this.map.removeLayer(this.polygonsLayer);
    }
		//remove all markers
		/*for(x in this.points) {
			this.map.removeLayer(this.points[x]);
		}
		for (x in this.polygons) {
			this.map.removeLayer(this.polygons[x]);
		}*/
		//this.$.spinUp.show();
	},
	resetPins: function(inSender, inEvent) {
		//re-create markers
	},
  resetPanned: function() {
    this.panned=true;
    this.log();
    return;
  },
  resizeMap: function() {
    this.map.invalidateSize();
    return;
  },
  resetZoomed: function() {
    this.zoomed=true;
    this.log(this.map.getZoom());
    return;
  },
	makeFilter: function () {
		if(this.loaded)
      this.panZoomed = true;
    //this.addMarkers();
  },
  addMarkers: function () {
    this.makeBubbleClick();
    for (var x in this.locations) {
      var url = Data.getTileURL() + this.locations[x] + "/{z}/{x}/{y}.geojson";
      //var layer = new L.TileLayer.d3_geoJSON(url, {minZoom: 14, maxNativeZoom: 14, unloadInvisibleTiles: true});
      //layer.addTo(this.map);

    }
    /*for(var x in this.locations) {
      var str = this.locations[x].geometryString;
      //wkt.read(str);
      var data = Terraformer.WKT.parse(str);
      //var shape = wkt.toObject();
      var points = [];
      var polygons = [];
      if(str.indexOf("POINT") != -1) {
        var shape = L.geoJson(data, {
          pointToLayer: function (feature, latlng) {
            var point = new L.Point(27,91);
            var icon = L.divIcon({iconSize: point, html: "<i class=\"icon-map-marker icon-4x\"></i>", className: "map-pin"});
            return L.marker(latlng, {icon: icon});
          }});
        shape.on("click", enyo.bind(this, "makeBubbleClick"));
        this.pointsLayer.addLayer(shape);
        points.push(shape);
      } else if (str.indexOf("POLYGON") != -1) {
        var shape = L.geoJson(data);
        shape.on("click", enyo.bind(this, "makeBubbleClick"));
        shape.setStyle({color: "#2E426F"});
        this.polygonsLayer.addLayer(shape);
        polygons.push(shape);
      } else {
      }

    }
    this.pointsLayer.addTo(this.map);

    this.polygonsLayer.addTo(this.map);

    /*var bounds = this.polygonsLayer.getBounds();
    if(bounds) {
      bounds.extend(this.pointsLayer.getBounds());
    } else {
      bounds = this.pointsLayer.getBounds();
    }

    if(this.userMarker !== undefined) {
      bounds.extend(this.userMarker.getLatLng());
    }

    var lat = (bounds._northEast.lat + bounds._southWest.lat) / 2;
    var lng = (bounds._northEast.lng + bounds._southWest.lng) / 2;
    this.map.fitBounds(bounds);*/
    //this.map.panTo([lat, lng], {animate: true});
  },
  makeBubbleClick: function (inEvent) {
    //loc = inEvent.latlng;
    /*loc.lat = loc.lat.toPrecision(8);
    loc.lng = loc.lng.toPrecision(8);*/
    //enyo.Signals.send("onPinClicked", loc);
    if(inEvent.feature !== null) {
    this.log(inEvent);
    this.$.taskpanels.setIndex(1);
    this.tasks = this.campaignArray[this.$.panels.getIndex()].tasks;
    if(this.tasks.length > 1) {
      this.$.tasks.setCount(this.tasks.length);
      this.$.tasks.reset();
      this.$.taskpanels.setIndex(2);
    } else {
      this.$.task_description.setContent(this.tasks[0].instructions);
      this.$.taskpanels.setIndex(1);
      this.$.task_description.data = this.tasks[0];
      this.$.task_description.location_id = inEvent.feature.properties.uid;
    }
    }
  },
  makeButtonBubbleClick: function(inEvent) {
    this.log(inEvent);
    this.log(this.tasks[inEvent.index]);
    //enyo.Signals.send("onPinClicked", Data.getLocationData());
  },
  makeBubbleLoad: function () {
    loaded = !0;
    this.doLoaded();
  },
  mapCenterFromSearch: function(inSender, inEvent) {
    this.log(inEvent);
    this.map.setView([inEvent.lat, inEvent.lon], 15);
  },
  nominatimResponse: function(inSender, inEvent) {
    var out = inEvent.display_name;
    enyo.Signals.send("onGPSCoordLookup", {display: out});
    return;
  },
  userCenter: function() {
    var ll = this.userMarker.getLatLng();
    this.map.setView(ll, 15, {animate: true});
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


