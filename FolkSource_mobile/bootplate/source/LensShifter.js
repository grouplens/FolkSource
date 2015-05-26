enyo.kind({
  name: "LensShifter",
  kind: enyo.Panels,
  arrangerKind: enyo.CardArranger,
  draggable: false,
  classes: "dark-background-flat",
  style: "height: 50px; width: 100%;",
  wrap: false,
  handlers: {
    onSearchTriggered: "switchToSearch",
  },
  components: [
    {kind: enyo.Signals, onGPSCoordLookup: "handleGPS"},
    {kind: enyo.FittableRows, components: [
      {name: "spaceToolbar", kind: "SpaceUsageToolbar", topic: "Guns", fit: true, defaultUsage: true, components: [
      ]},
    ]},
    {kind: enyo.FittableRows, components: [
      {kind: onyx.Toolbar, fit: true, layoutKind: enyo.FittableColumnsLayout, style: "padding: 15px;", classes: "dark-background-flat", components: [
        {name: "searchInput", kind: onyx.Input, type: "search", fit: true, placeholder: "Search for a place or browse map", onchange: "searchInput", onchange: "searchChanged"},
        {name: "cancel", tag: "i", classes: "fa fa-fw fa-close fa-lg color-icon", ontap: "switchBack"},
      ]}
    ]},
  ],
  create: function(inSender, inEvent) {
    this.inherited(arguments);
  },
  handleGPS: function(inSender, inEvent) {
    this.$.spaceToolbar.setPlace(inEvent.display);
  },
  renderResponse: function(inSender, inEvent) {
    var response = inEvent;
    this.log(inEvent);
    var real = response[0];
    var addr = real.address.house + ", " + real.address.house_number + " " + real.address.pedestrian;
    this.$.spaceToolbar.setPlace(real.display_name);
    this.switchBack();
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
    var inString = inSender.getValue();
    var encoded = encodeURIComponent(inString);
    var url = "http://nominatim.openstreetmap.org/search?format=json&addressdetails=1&q=" + encoded;
    var ajax = new enyo.Ajax({url: url, method: "GET", cacheBust: false});
    ajax.response(this, "renderResponse");
    ajax.go();
  },
  switchBack: function() {
    this.setIndex(0);
    return true;
  },
  switchToSearch: function() {
    this.setIndex(1);
    return true;
  },
});
