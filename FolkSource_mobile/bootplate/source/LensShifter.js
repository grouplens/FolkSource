enyo.kind({
  name: "LensShifter",
  // kind: "enyo.FittableRows",
  classes: "dark-background-flat",
  style: "width: 100%;",
  handlers: {
    onSearchTriggered: "switchToSearch",
  },
  events: {
    onFindUserCenter: ""
  },
  components: [
    {kind: "enyo.Signals", onGPSCoordLookup: "handleGPS"},
    {kind: "enyo.FittableRows", components: [
      {kind: "onyx.Toolbar", layoutKind: "enyo.FittableColumnsLayout", classes: "dark-background-flat", components: [
        {name: "locateMe", tag: "i", classes: "fa fa-fw fa-crosshairs fa-2x color-icon", ontap: "handleCenter"},
        {name: "searchInput", kind: "onyx.Input", fit: true, gpsed: true, type: "search", placeholder: "Search for a place or browse map", onchange: "searchInput", onchange: "searchChanged", style: "height: 100%; width: 100%;"},
        {name: "cancel", tag: "i", classes: "fa fa-fw fa-close fa-2x color-icon", ontap: "clearField"},
      ]}
    ]},
    {kind: "onyx.Toolbar", classes: "light-background-flat", components: [
      {name: "locationStatus", content: "Tap a location on on the map to help!", style: "width: 100%; text-align: center;"},
    ]}
  ],
  clearField: function(inSender, inEvent) {
    this.$.searchInput.setValue('');
    this.$.searchInput.osm_id = null;
    this.$.locationStatus.setContent("Tap a location on on the map to help!");
  },
  create: function(inSender, inEvent) {
    this.inherited(arguments);
  },
  handleGPS: function(inSender, inEvent) {
    if(this.$.searchInput.gpsed) {
      this.$.searchInput.setValue(inEvent.display);
      this.$.searchInput.osm_id = inEvent.osm_id;
    }
    this.$.searchInput.gpsed = true;
  },
  handleCenter: function() {
    this.doFindUserCenter();
    this.$.searchInput.gpsed = true;
    this.clearField();
  },
  renderResponse: function(inSender, inEvent) {
    var response = inEvent;
    this.log(JSON.stringify(inEvent));
    var real;
    for(var i in response) {
      if(response[i].osm_id === this.$.searchInput.osm_id) {
        real = response[i];
      }
    }
    if(!real) {
      real = response[0];
    }

    var addr = real.address.house + ", " + real.address.house_number + " " + real.address.pedestrian;
    this.$.locationStatus.setContent(real.display_name);
    this.$.locationStatus.render();
    enyo.Signals.send("onSearchedLocation", {lat: real.lat, lon: real.lon});
  },
  searchInput: function(inSender, inEvent) {
    if(searchString !== '') {
      this.log(searchString);
    } else {
    }
  },
  searchChanged: function(inSender, inEvent) {
    /*var searchString = inSender.getValue();
    this.log(searchString);*/
    this.$.searchInput.gpsed = false;
    this.$.searchInput.blur();
    var inString = inSender.getValue();
    var encoded = encodeURIComponent(inString);
    var url = "http://nominatim.openstreetmap.org/search?format=json&addressdetails=1&q=" + encoded;
    var ajax = new enyo.Ajax({url: url, method: "GET", cacheBust: false});
    ajax.response(this, "renderResponse");
    ajax.go();
  },
});
