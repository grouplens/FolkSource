enyo.kind({
  name: 'MapView',
  kind: 'enyo.FittableRows',
  published: {
    logged_in: false,
    lastTime: 0,
    searched: -1,
    eventFrom: -1,
    panning: false
  },
  events: {
    onGPSSet: '',
    onLayerTapped: '',
    onReloadedData: '',
  },
  handlers: {
    onHideCampaigns: 'hideCamps',
    onSenseClosed: 'resetAfterSense',
    onFindUserCenter: 'userCenter',
    onSearchFieldCleared: 'cancelTask'
  },
  components: [
    {kind: 'enyo.Signals', onLocationFound: 'locSuccess', onPinClicked: 'popupTriggered', onLoggedIn: 'fetchData', onSearchedLocation: 'mapCenterFromSearch'},
    {name: 'tasks', kind: 'enyo.Popup', scrim: true, modal: true, floating: true, autoDismiss: true, showTransitions: true, style: 'height: 114px; width: 80%; margin-left: auto; margin-right: auto;', onHide: 'deselectMap', layoutKind: 'enyo.FittableRowsLayout', components: [
      {name: 'task_list', kind: 'enyo.List', fit: true, noSelect: true, onSetupItem: 'buildTaskList', components: [
        {name: 'task_container', ontap: 'taskTapped', classes: 'light-background', style: 'height: 55px; margin-bottom: 2px;', components: [
          {name: 'task_item', content: 'list', style: "font-size: 10pt;"}
        ]}
      ]}
    ]},
    {name: 'camps', kind: 'enyo.Popup', modal: false, floating: true, autoDismiss: false, showTransitions: true, style: 'height: 110px; width: 95%; margin-left: 2.5%; margin-right: 2.5%; box-shadow: 0 0 5px #222;', layoutKind: 'enyo.FittableRowsLayout', components: [
      {kind: 'enyo.Panels', name: 'taskpanels', arrangerKind: 'enyo.CardArranger', draggable: false, fit: true, style: 'min-height: 100%;', components: [
        {kind: 'enyo.FittableColumns', style: 'height: 100%;', components: [
          {name: 'leftButton', kind: 'onyx.Button', slide: -1, ontap: 'buttonTapHandler', classes: 'button-style filledButtons', style: "width: 44px;", disabled: !0, components: [
            {tag: 'i', classes: 'fa fa-chevron-left fa-2x color-icon'}
          ]},
          {name: 'panelsContainer', kind: 'enyo.FittableRows', fit: true, components: [
            {name: 'panels', kind: 'enyo.Panels', animate: true, arrangerKind: 'enyo.CarouselArranger', fit: true, draggable: false, classes: 'filledPanels light-background', layoutKind: 'enyo.FittableColumnsLayout', onTransitionStart: 'buttonTapHandler'},
          ]},
          {name: 'rightButton', kind: 'onyx.Button', slide: 1, ontap: 'buttonTapHandler', classes: 'button-style filledButtons', style: "width: 44px;", components: [
            {tag: 'i', classes: 'fa fa-chevron-right fa-2x color-icon'}
          ]},
        ]},
        {name: 'task_content', kind: 'enyo.FittableRows', classes: 'light-background', components: [
          {name: 'task_ask', content: 'To help, please:', classes: 'light-background', style: 'font-size: 13pt; font-weight: 400; text-align: center;'},
          {name: 'task_description', fit: true, style: 'text-transform: lowercase; margin-left: auto; margin-right: auto; font-size: 9pt; padding: 3px; width: 80%;',content: 'test'},
          {name: 'buttons', /*kind: 'enyo.ToolDecorator',*/ classes: 'senseButtons', style: 'text-align: center;', components: [
            {name: 'submit', kind: 'onyx.Button', style: 'width: 80%;', classes: 'button-style button-style-affirmative', ontap: 'triggerTask', components: [
              {content: 'Sure!'}
            ]}
          ]}
        ]}
      ]}
    ]},
    {name: 'lenses', kind: 'LensShifter'},
    {name: 'mapCont', fit: true, style: 'position: relative;'}
  ],
  create: function (a) {
    this.inherited(arguments);
    this.hideCamps();
    this.taskPicked = false;
  },
  buttonTapHandler: function (inSender, inEvent) {
    this.map.removeLayer(this.vectors);
    if(inSender.name ==='panels') {
      this.log("PANELS");
    } else {
      var newIndex = this.$.panels.getIndex() + inSender.slide;
      this.$.panels.setIndex(newIndex);
    }
    this.checkBothSides();
    this.map.addLayer(this.vectors);

    // if(a.slide === 'prev') {
    //   this.$.panels.previous();
    // } else if(a.slide === 'next') {
    //   this.log('next')
    //   this.$.panels.next();
    // } else {
    //   this.$.panels.snapTo(a.slide);
    // }
  },
  rendered: function () {
    this.inherited(arguments);

    // this.showCamps();
    var tmpBounds = this.$.panels.getAbsoluteBounds();
    this.$.tasks.applyStyle('width', tmpBounds.width+'px')
    this.$.tasks.resize();
    this.log();
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
    if(this.vectors) {
      this.map.removeLayer(this.vectors);
    }
    this.vectors = new L.TileLayer.MVTSource({
      url: 'http://innsbruck-umh.cs.umn.edu/tiles/all/{z}/{x}/{y}.mapbox',
      style: function(feature, context) {
        var style={};
        var selectColor = 'rgba(219, 112, 30, 0.7)';

        if(feature.properties.outcome === 'n') {
          style.color = 'rgba(123,50,148,0.7)';
        } else if(feature.properties.outcome === 'y') {
          style.color = 'rgba(0,136,55,0.7)';
        } else {
          style.color = 'rgba(64,64,64,0.7)';
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
      filter: enyo.bind(this, 'filterHandler'),
      onClick: enyo.bind(this, 'clickHandler'),
      onTilesLoaded: enyo.bind(this, 'vectorsLoaded')
    });
    this.map.addLayer(this.vectors);
  },
  buildTaskList: function(inSender, inEvent) {
    var out = this.tasks[inEvent.index];
    this.$.task_item.setContent(out.instructions)
  },
  cancelTask: function(inSender, inEvent) {
    if(this.searched) {
      this.$.taskpanels.setIndex(0);
      this.deselectMap();
    }
  },
  cancelTaskWithoutClicking: function() {
    if(this.searched) {
      this.$.lenses.clearFieldWithoutClicking();
      this.$.taskpanels.setIndex(0);
      this.$.lenses.endLoading();
      this.clearTapData();
    }
  },
  setupPanels: function (inSender, inEvent) { //inSender = a, inEvent = b;
    var panels = this.$.panels.getPanels();
    if(this.logged_in === true) {
      for (var x = 0; x < panels.length; x++) {
        this.sendTasks();
      }
    }
  },
  clickMap: function() {
    if(this.searched == -1 || this.eventFrom == -1) {
      return;
    }
    this.log(this.searched);
    this.map.fireEvent('click', {
      latlng: this.searched,
      layerPoint: this.map.latLngToLayerPoint(this.searched),
      containerPoint: this.map.latLngToContainerPoint(this.searched)
    });
  },
  deselectMap: function() {
    if(!this.taskPicked) {
      this.eventFrom = 'deselect';
      this.log('deselect')
      this.clickMap();
    } else {
      this.taskPicked = false;
    }
  },
  triggerTask: function(inSender, inEvent) {
    //figure out
    this.log(this.$.task_description.data);
    this.bubbleUp('onPlaceChosen', {data: this.$.task_description.data, location_id: this.$.task_description.location_id});
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
  filterHandler: function(feature, context) {
    var tasks = this.campaignArray[this.$.panels.getIndex()].tasks
    var truth = tasks.map(function(obj) {
      var truthy = obj.id == feature.properties.task_id;
      if(truthy) {
        console.log(obj.id)
        console.log(feature.properties.task_id)
      }
      return truthy
    });

    if(truth.indexOf(true) >= 0) {
      return true;
    }
    return false;
  },
  fetchData: function() {
    if(this.logged_in === false) {
      this.logged_in = true;
    }
    var url = Data.getURL() + 'campaign.json';
    var ajax = new enyo.Ajax({method: 'GET', cacheBust: false, url: url, handleAs: 'json', headers: {AuthToken: LocalStorage.get('authtoken')}});
    ajax.response(this, 'renderResponse');
    ajax.go();
    return;
  },
  deleteAndReCreateCampaigns: function(camp_data) {
    this.$.panels.destroy();
    this.$.panelsContainer.createComponent({name: 'panels', kind: 'enyo.Panels', animate: true, arrangerKind: 'enyo.CarouselArranger', fit: true, draggable: false, classes: 'filledPanels light-background', layoutKind: 'enyo.FittableColumnsLayout'}, {owner: this});

    this.$.panelsContainer.render();

    for (var c = 0; c < camp_data.length; c++) {
      var currentCampaign = camp_data[c];
      var panel_name = 'panel_' + currentCampaign.id;
      var item_name = 'item_' + currentCampaign.id;
      if(currentCampaign.id != undefined) {
        this.$.panels.createComponent(
          {name: panel_name, classes: 'panelItem white-text', fit: true, data: currentCampaign, kind: 'enyo.FittableRows', components: [
            {name: item_name, style: 'text-align: center;', kind: 'CampaignItem', title: '' + currentCampaign.title, description: '' + currentCampaign.description},
          ]}
        );
      }
    }
    this.$.panels.resize();
    this.$.panelsContainer.render();
  },
  renderResponse: function (a, b) {
    // this.log(JSON.stringify(b));
    this.campaignArray = b.campaigns;

    this.deleteAndReCreateCampaigns(this.campaignArray);

    enyo.Signals.send('onCampLoaded');

    this.checkBothSides(); // make sure the arrow buttons work
    this.showCamps();
    this.setupPanels();
    this.doReloadedData();
  },
  showTasks: function(osm_id, layer_name) {
    this.tasks = this.campaignArray[this.$.panels.getIndex()].tasks;
    if(this.tasks.length > 1) {
      this.setTaskList();
    } else {
      this.setTaskPanel(0);
    }
  },
  showCamps: function() {
    this.log("SHOWING CAMPAIGNS");
    this.$.taskpanels.setIndex(0);
    var height = parent.innerHeight;
    var real_height = -3*(height/4); //put the bottom of the campaign list at 4/5 the height of the map
    this.log(real_height);
    this.$.camps.showAtPosition({bottom: real_height});
  },
  hideCamps: function(inSender, inEvent) {
    this.$.camps.setShowing(false);
  },
  checkBothSides: function () {
    var index = this.$.panels.getIndex();
    var size = this.$.panels.getPanels().length;
    var adjSize = size - 1; //adjust for counting at 0 vs. 1
    this.$.rightButton.setDisabled(false);
    this.$.leftButton.setDisabled(false);
    if (this.campaignArray !== undefined) {
      if(adjSize !== 0) {
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
  taskTapped: function(inSender, inEvent) {
    this.eventFrom = 'task_list';
    this.taskPicked = true;
    this.$.tasks.hide();
    this.setTaskPanel(inEvent.index);
    return true;
  },
  reloadMapLayers: function() {
    if(this.vectors) {
      if(this.map.hasLayer(this.vectors)) {
        this.map.removeLayer(this.vectors);
      }
      this.map.addLayer(this.vectors);
    }
  },
  locSuccess: function (a, b) {
    var coords = b.coords;
    var latlng = L.latLng(coords.latitude, coords.longitude);

    if(!this.map) {
      this.map = L.map(this.$.mapCont.id, {center: latlng, zoom: 14, zoomControl: false, attributionControl: false});
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
    if(this.searched != -1) {
      this.log('vectors')
      this.clickMap();
    }
  },
  setTaskList: function() {
    this.$.task_list.setCount(this.tasks.length);
    this.$.task_list.reset();
    var height = parent.innerHeight;
    var real_height = (-3*(height/4)); //put the bottom of the campaign list at 4/5 the height of the map
    var tmp = real_height;
    if(this.tasks.length*57 < 330) {
      tmp += (this.tasks.length * 57);
    } else {
      tmp += 330;
    }
    this.log('tmp: ' + tmp)
    // this.$.tasks.applyStyle('height', tmp+'px');
    this.log(this.$.tasks)
    // this.$.tasks.render();
    this.$.tasks.showAtPosition({bottom: (110+tmp)});
  },
  setTaskPanel: function(id) {
    this.$.task_description.setContent(this.tasks[id].instructions);
    this.$.task_description.data = this.tasks[id];
    this.$.task_description.location_id = this.curTaskData.osm_id;
    this.$.task_description.location_layer = this.curTaskData.layer_name;
    this.$.taskpanels.setIndex(1);
  },
  clearTapData: function() {
    this.eventFrom = -1;
    this.searched = -1;
    return;
  },
  clickHandler: function (inEvent) {
    this.log(inEvent);
    this.$.lenses.startLoading();
    if(this.eventFrom === 'task_list') {
      this.clearTapData();
      return;
    }

    if(!inEvent.feature) {
      if(this.eventFrom === 'gps') {
        this.clearTapData();
      }
      this.$.lenses.endLoading();
      return;
    }

    this.curTaskData = {};
    this.curTaskData.osm_id = inEvent.feature.properties.osm_id;
    this.curTaskData.layer_name = inEvent.feature.layer.name;

    if(this.eventFrom === 'deselect') {
      this.$.taskpanels.setIndex(0);
      this.$.lenses.endLoading();
    }

    if(inEvent.feature.selected && inEvent.feature.properties.type !== 'seed_voting') {
      this.showTasks();

      if(this.eventFrom == -1) {
        this.searched = L.latLng(inEvent.latlng.lat, inEvent.latlng.lng);
        this.eventFrom = 'user';
        this.$.lenses.reverseNominatimSearch(this.curTaskData.osm_id, inEvent.latlng.lat, inEvent.latlng.lng, this.curTaskData.layer_name);
      }
    } else {
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
      this.log('panToLocation')
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
