enyo.kind({
	name: "MapStraction",
	classes: "mapItem",
    kind: "enyo.FittableColumns",
    //style: "height: 100%;",
	published: {
		provider: "google",
		gpsTimeout: "10000"
	},
	components: [
		{name: "gps", kind: "rok.geolocation", watch: true, enableHighAccuracy: true, timeout: this.gpsTimeout, maximumAge: "3000", onSuccess: "locSuccess", onError: "locError"}
	],
    events: {
        onLoaded: "",
        onPinClicked: "",
        onGPSSet: ""
    },
	create: function(inSender) {
		this.inherited(arguments);
        this.$.gps.setTimeout(this.gpsTimeout);
        userMoved = false;
        loaded = false;
	},
	rendered: function() {
		this.straction = new mxn.Mapstraction(this.id, this.provider);
		this.straction.load.addHandler(this.makeBubbleLoad());
        this.straction.changeZoom.addHandler(enyo.bind(this, "makeFilter"));
        this.straction.endPan.addHandler(enyo.bind(this, "makeFilter"));
        this.straction.setOption("enableScrollWheelZoom", true);
		this.$.gps.getPosition();
	},
	locSuccess: function(inSender, inPosition) {
		this.myLocation = inPosition.coords;
        enyo.Signals.send("onGPSSet", {prop: this.myLocation});
		this.centerMap();
        return true;
	},
	locError: function(inSender, inEvent) {
		
	},
    checkMap: function(locs) {
        if(this.straction.markers.length === locs.split("|").length) {
            //DO NOTHING, THIS IS A BAD HACK FOR NOW
        } else {
            this.locPlot(locs);
            this.makeFilter();
        }
    },
    locPlot: function(locs) {
        this.locations = locs.split("|");
        this.makeFilter();
    },
    inside: function(coords) {
        var ne = this.straction.getBounds().getNorthEast();
        var sw = this.straction.getBounds().getSouthWest();
        if((coords[1] <= ne.lat && coords[1] >= sw.lat) && (coords[0] <= ne.lon && coords[0] >= sw.lon))
            return true;
        else
            return false;
    },
    makeFilter: function(){
        if(this.locations.length > 1) {
            this.straction.removeAllMarkers();
            for (x in this.locations) {
                //MAKE POINT
                var coords = this.locations[x].split(",");
                if(this.inside(coords)) {
                    var mark = new mxn.Marker(new mxn.LatLonPoint(coords[1], coords[0]));
                    mark.addData({hover: false});
                    mark.click.addHandler(enyo.bind(this, "makeBubbleClick"));
                    this.straction.addMarker(mark);
                }
            }
        }
    },
	centerMap: function() {
		var loc = new mxn.LatLonPoint(this.myLocation.latitude, this.myLocation.longitude);
        this.straction.setCenterAndZoom(loc, 15);
	},
    makeBubbleClick: function(inSender, inEvent) {
        enyo.Signals.send("onPinClicked", inEvent.location);
    },
    makeBubbleLoad: function() {
        loaded = true;
        this.doLoaded();
    }
});
