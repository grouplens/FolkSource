enyo.kind({
	//reacts to "osm_reverse_geocoder" type of question
  name: "TapMap",
  style: "position: relative;",
  kind: "enyo.FittableRows",
  components: [
		{kind: "MediaSensor", type: "camera", sendAutomatically: false},
		{content: "Where does the warning apply? Tap on the map to let us know!", style: "font-size: 11pt; font-weight: 100; text-align: center; padding: 3px;", classes: "dark-background"},
		{name: "mapCont", style: "height: 400px; width: 400px; margin-left: auto; position: relative; margin-right: auto; overflow: hidden;"},
		{name: "address", content: "The address will go here", style: "font-size: 11pt; font-weight: 100; text-align: center; padding: 3px;", classes: "dark-background"},
  ],
  rendered: function () {
		this.inherited(arguments);
		this.lastClicked=0;
		this.tapMap = L.map(this.$.mapCont.id, {maxZoom: 17}).setView([44.981313, -93.266569], 13);
		//L.tileLayer("http://tile.stamen.com/toner-lite/{z}/{x}/{y}.png", {
		L.tileLayer("http://{s}.tile.osm.org/{z}/{x}/{y}.png", {attribution: "Data by OpenStreetMap, under CC BY SA."}).addTo(this.tapMap);
		//this.tapMap.invalidateSize();

		this.tapMap.on("click", enyo.bind(this, "clickListener"));
    this.tapMap.on('render', enyo.bind(this, "invalidateMapSize"));
    //this.tapMap.invalidateSize();
		this.locSuccess();
	},
  invalidateMapSize: function() {
    this.tapmap.invalidateSize();
  },
	clickListener: function(inSender, inEvent) {
		var latlng = inSender.latlng;
		var end = "&lat=" + latlng.lat.toPrecision(8) + "&lon=" + latlng.lng.toPrecision(8);
		var bounds = this.tapMap.getBounds();
		var type = "&osm_type=W";
		var bounded = "&bounded=1";
		var vbox = "&viewbox=" + bounds.getWest() + "," + bounds.getNorth() + "," + bounds.getEast() + "," + bounds.getSouth();
		var url = "http://nominatim.openstreetmap.org/reverse?format=json&email=thebault@cs.umn.edu" /* + type + bounded + vbox */ + end;
		var ajax = new enyo.Ajax({url: url, handleAs: "json"});
		ajax.response(this, "handleNominatimResponse");
		ajax.go();
	},
	getData: function(inSender, inEvent) {
		return this.lastClicked;
	},
	handleNominatimResponse: function(inSender, inEvent) {
		this.log(inEvent);
		this.lastClicked = inEvent.place_id;
		this.$.address.setContent(inEvent.display_name);
		this.$.address.render();
	},
	locSuccess: function () {
		//var coords = b.coords;
		var latlng = Data.getLocationData();

    //this.log(coords);
		//var latlng = new L.LatLng(coords.lat.toPrecision(8), coords.lng.toPrecision(8))Jj;

		if (!this.usMarker)
			this.usMarker = L.userMarker(latlng, {pulsing: true}).addTo(this.tapMap);

		this.usMarker.setLatLng(latlng);
		//this.usMarker.setAccuracy(coords.accuracy);

		this.log(latlng);
		//this.tapMap.setView(latlng, 17);
    this.tapMap.invalidateSize();
	},
});
