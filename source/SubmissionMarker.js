(function (window, document, undefined) {

SubmissionMarker = L.Marker.extend({

	initialize: function (latlng, submissionId, pop, popContent, options){
		//Set the icon
		var opt = options;
		if (opt === undefined){
			opt = {};
		}
		opt.icon = new L.DivIcon({className: 'submission-marker-div'});

		L.Marker.prototype.initialize.call(this, latlng, opt);

		//Initililize ping animation
		this._ping = new PingCircle(this.getLatLng(), 10, {color: "#000000"});
		//this._ping = new PingLayer(this.getLatLng(), 0);

		//Initialize click action
		this._setupClickHandler(submissionId, pop, popContent);
	},
	onAdd: function(map){
		L.Marker.prototype.onAdd.call(this, map);

		this._ping.addTo(this._map);
		this._ping.animate({duration: 600, size: 150, delay: 310});
		//this._ping.animate({duration: 200, size: 200, delay: 300});
	},

	_setupClickHandler: function(submissionId, pop, popContent){
		this.on("click", function(){
			popContent.emphasizeSubmission(submissionId)
			pop._adjustPan();
		});
	},

});

L.submissionMarker = function (latlng, options) {
	return new L.SubmissionMarker(latlng, options);
};

}(this, document));