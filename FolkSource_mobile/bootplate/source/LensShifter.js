enyo.kind({
  name: "LensShifter",
  classes: "dark-background-flat",
  style: "width: 100%;",
  handlers: {
    onSearchTriggered: "switchToSearch",
  },
  events: {
    onFindUserCenter: "",
    onSearchFieldCleared: ""
  },
  components: [
    {kind: "enyo.Signals", onGPSCoordLookup: "handleGPS"},
    {classes: "dark-background nice-padding", content: "Search or tap a location on on the map to help!", style: "width: 100%; text-align: center;"},
    {kind: "enyo.FittableRows", components: [
      {kind: "onyx.Toolbar", layoutKind: "enyo.FittableColumnsLayout", classes: "dark-background-flat", components: [
        {name: "locateMe", tag: "i", classes: "fa fa-fw fa-crosshairs fa-2x color-icon", ontap: "handleCenter"},
        {name: "searchInput", kind: "onyx.Input", fit: true, gpsed: true, type: "search", placeholder: "Search for a place or browse map", onchange: "searchChanged", style: "height: 100%; width: 100%;"},
        {name: "cancel", tag: "i", classes: "fa fa-fw fa-close fa-2x color-icon", ontap: "clearField"},
        {name: "loading", tag: "i", classes: "fa fa-fw fa-2x fa-spin fa-circle-o-notch color-icon", showing: false}
      ]}
    ]}
  ],
  clearField: function(inSender, inEvent) {
    this.$.searchInput.setValue('');
    this.searchString = '';
    this.doSearchFieldCleared();
  },
  create: function(inSender, inEvent) {
    this.inherited(arguments);
  },
  endLoading: function() {
    this.$.loading.setShowing(false);
    this.$.cancel.setShowing(true);
  },
  getNominatimName: function(osm_id, layer_type) {
    this.startLoading();
    var osm_type='';
    if(layer_type === "buildings") {
      osm_type='W';
    } else if(layer_type === "pois") {
      osm_type='N';
      this.log("nodes");
    }
    var url = "http://nominatim.openstreetmap.org/reverse?format=json&addressdetails=1&osm_id=" + osm_id+"&osm_type="+osm_type;
    this.log(url);
    var ajax = new enyo.Ajax({url: url, method: "GET", cacheBust: false});
    ajax.response(this, "renderOSM_IDResponse");
    ajax.go();
    return;
  },
  handleAddress: function(address) {
    this.$.searchInput.setValue(address.display_name);
    var output = {lat: address.lat, lon: address.lon, osm_id: address.osm_id};
    return output;
  },
  handleGPS: function(inSender, inEvent) {
    if(this.$.searchInput.gpsed) {
      this.gps_name = inEvent.display;
      this.clearField();
      this.$.searchInput.setValue(inEvent.display);
      this.$.searchInput.osm_id = inEvent.osm_id;
    }
    this.$.searchInput.gpsed = true;
  },
  handleCenter: function() {
    this.$.searchInput.setValue(this.gps_name);
    this.doFindUserCenter();
    this.$.searchInput.gpsed = true;
    // this.clearField();
  },
  renderAddressSearchResponse: function(inSender, inEvent) {
    var response = inEvent;
    this.log(response);
    this.log(this.$.searchInput.osm_id);
    var real;
    for(var i in response) {
      if(response[i].osm_id === this.$.searchInput.osm_id) {
        real = response[i];
        break;
      }
    }
    if(!real) {
      real = response[0];
    }
    var output = this.handleAddress(real)
    enyo.Signals.send("onSearchedLocation", output);
  },
  renderOSM_IDResponse: function(inSender, inEvent) {
    this.log(inEvent);
    this.handleAddress(inEvent);
  },
  searchChanged: function(inSender, inEvent) {
    if(this.searchString != inSender.getValue()) {
      this.startLoading();
      this.searchString = inSender.getValue();
      this.log(this.searchString);
      this.$.searchInput.gpsed = false;
      this.$.searchInput.blur();
      var inString = inSender.getValue();
      var encoded = encodeURIComponent(inString);
      var url = "http://nominatim.openstreetmap.org/search?format=json&addressdetails=1&q=" + encoded;
      var ajax = new enyo.Ajax({url: url, method: "GET", cacheBust: false});
      ajax.response(this, "renderAddressSearchResponse");
      ajax.go();
    }
  },
  startLoading: function() {
    this.$.loading.setShowing(false);
    this.$.cancel.setShowing(true);
  },
});
