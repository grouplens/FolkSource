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
    {classes: "dark-background nice-padding", content: "Search or tap a location on on the map to help!", style: "font-size: 9pt; text-align: center;"},
    {kind: "enyo.FittableRows", components: [
      {kind: "onyx.Toolbar", layoutKind: "enyo.FittableColumnsLayout", classes: "dark-background-flat", components: [
        {name: "locateMe", tag: "i", classes: "fa fa-fw fa-crosshairs fa-2x color-icon", ontap: "handleCenter"},
        {name: "searchInput", kind: "onyx.Input", fit: true, type: "search", placeholder: "Search for a place or browse map", onchange: "nominatimSearch", style: "height: 100%; width: 100%;"},
        {name: "cancel", tag: "i", classes: "fa fa-fw fa-close fa-2x color-icon", ontap: "clearField"},
        {name: "loading", tag: "i", classes: "fa fa-fw fa-2x fa-spin fa-circle-o-notch color-icon", showing: false}
      ]}
    ]}
  ],
  clearField: function(inSender, inEvent) {
    this.log("cancelling")
    this.currentOSM_ID = -1;
    this.$.searchInput.setValue('');
    this.searchString = '';
    this.doSearchFieldCleared();
  },
  clearFieldWithoutClicking: function(inSender, inEvent) {
    this.log("cancelling")
    this.currentOSM_ID = -1;
    this.$.searchInput.setValue('');
    this.searchString = '';
  },
  create: function(inSender, inEvent) {
    this.inherited(arguments);
  },
  endLoading: function() {
    this.$.loading.setShowing(false);
    this.$.cancel.setShowing(true);
  },
  handleAddress: function(address) {
    this.$.searchInput.setValue(address.display_name != undefined ? address.display_name : address.error);
    var output = {lat: address.lat, lon: address.lon, osm_id: address.osm_id};
    // this.endLoading();
    return output;
  },
  handleCenter: function() {
    this.startLoading();
    this.doFindUserCenter();
    // this.clearField();
  },
  nominatimSearch: function(inSender, inEvent) {
    if(this.searchString != inSender.getValue()) {
      this.startLoading();
      this.searchString = inSender.getValue();
      this.log(this.searchString);
      this.$.searchInput.blur();
      var inString = inSender.getValue();
      var encoded = encodeURIComponent(inString);
      var url = "http://nominatim.openstreetmap.org/search?format=json&addressdetails=1&q=" + encoded;
      var ajax = new enyo.Ajax({url: url, method: "GET", cacheBust: false});
      ajax.response(this, "nominatimSearchResponse");
      ajax.go();
    }
  },
  nominatimSearchResponse: function(inSender, inEvent) {
    var response = inEvent;
    this.log(response);
    this.log(this.$.searchInput.osm_id);
    var real;
    for(var i = 0; i < response.length; i++) {
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
  reverseNominatimSearch: function(osm_id, lat, lon, layer_type) {
    var url = "http://nominatim.openstreetmap.org/reverse?format=json&addressdetails=1&"
    if(osm_id) {
      if(this.currentOSM_ID === osm_id) {
        return;
      }
      this.startLoading();
      this.currentOSM_ID = osm_id;
      var osm_type='R';
      if(layer_type === "buildings") {
        osm_type='W';
      } else if(layer_type === "pois") {
        osm_type='N';
        this.log("nodes");
      }
      url = url + "osm_id=" + osm_id+"&osm_type="+osm_type;
    } else {
      url = url + "lat=" + lat + "&lon=" + lon
    }
    this.log(url);
    var ajax = new enyo.Ajax({url: url, method: "GET", cacheBust: false});
    ajax.response(this, "reverseNominatimSearchResponse");
    ajax.go();
    return;
  },
  reverseNominatimSearchResponse: function(inSender, inEvent) {
    this.log(inEvent);
    this.handleAddress(inEvent);
  },
  startLoading: function() {
    this.$.cancel.setShowing(false);
    this.$.loading.setShowing(true);
  },
});
