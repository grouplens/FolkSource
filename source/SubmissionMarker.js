(function (window, document, undefined) {

SubmissionMarker = L.Marker.extend({

	initialize: function (latlng, options){
		var opt = options;
		if (opt === undefined){
			opt = {};
		}
		opt.icon = new L.DivIcon({className: 'submission-marker-div'});

		L.Marker.prototype.initialize.call(this, latlng, opt);

		//this._ping = new PingLayer(this.getLatLng(), 0);
		this._ping = new PingCircle(this.getLatLng(), 10, {color: "#000000"});
	},
	onAdd: function(map){
		L.Marker.prototype.onAdd.call(this, map);

		/*
		this._ping.addTo(this._map);
		this._ping.animate({duration: 200, size: 200, delay: 300});
		*/
		this._ping.addTo(this._map);
		this._ping.animate({duration: 600, size: 150, delay: 310});
	},
});

L.submissionMarker = function (latlng, options) {
	return new L.SubmissionMarker(latlng, options);
};

}(this, document));