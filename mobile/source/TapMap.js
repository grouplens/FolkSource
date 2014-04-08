enyo.kind({
	//reacts to "osm_reverse_geocoder" type of question
    name: "TapMap",
	kind: enyo.FittableRows,
    published: {
        gpsTimeout: "10000"
    },
    components: [
		{kind: enyo.Signals, onLocationFound: "locSuccess"},
		{name: "address", content: "The address will go here", style: "font-size: 11pt; font-weight: 100; text-align: center; padding: 3px;", classes: "dark-background"},
		{name: "mapCont", fit: true, style: "overflow: hidden; position: relative;"}
    ],
    events: {
        onLoaded: "",
        onPinClicked: "",
        onGPSSet: ""
    },
    eventStarted: !1,
    handlers: {
        onSnapping: "turnOffMap",
        onSnapped: "resetPins",
    },
    create: function (a) {
        this.inherited(arguments);
    },
    rendered: function () {
		this.inherited(arguments);

		this.map = L.map(this.$.mapCont.id).setView([44.981313, -93.266569], 13);
		L.tileLayer('http://{s}.mqcdn.com/tiles/1.0.0/map/{z}/{x}/{y}.png', {
		//L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
			attribution: 'Tiles Courtesy of <a href="http://www.mapquest.com/" target="_blank">MapQuest</a> <img src="http://developer.mapquest.com/content/osm/mq_logo.png"> - &copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
			detectRetina: true,
			subdomains: ['otile1', 'otile2', 'otile3', 'otile4']
		}).addTo(this.map);
		
		this.map.on("click", enyo.bind(this, "clickListener"));

	},
	clickListener: function(inSender, inEvent) {
		var latlng = inSender.latlng;
		var end = "lat=" + latlng.lat + "&lon=" + latlng.lng;
		this.log(end);
		this.log(latlng);
		var bounds = this.map.getBounds();
		var vbox = bounds.getWest() + "," + bounds.getNorth() + "," + bounds.getEast() + "," + bounds.getSouth();
		var url = "http://open.mapquestapi.com/nominatim/v1/reverse.php?format=json&bounded=1&osm_type=W&viewbox="+vbox+"&"+end;
		var ajax = new enyo.Ajax({url: url, handleAs: "json"});
		ajax.response(this, "handleNominatimResponse");
		ajax.go();
	},
	handleNominatimResponse: function(inSender, inEvent) {
		this.log(inEvent);
		this.lastClicked = inEvent.place_id;
		this.$.address.setContent(inEvent.display_name);
		this.$.address.render();
	},	
	locSuccess: function (a, b) {
		var coords = b.coords;

		var latlng = new L.LatLng(coords.latitude, coords.longitude);

		if (!this.userMarker)
			this.userMarker = L.userMarker(latlng, {pulsing: true}).addTo(this.map);

		this.userMarker.setLatLng(latlng);
		this.userMarker.setAccuracy(coords.accuracy);

		this.map.setView(latlng, 20);
		this.resized();

        return true;
	},
});
