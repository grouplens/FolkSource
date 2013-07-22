(function (window, document, undefined) {

SubmissionMarker = L.Marker.extend({

	initialize: function (latlng, submissionId, showCampaigns, makePing, options){
		//Set the icon
		var opt = options;
		if (opt === undefined){
			opt = {};
		}
		opt.icon = new L.DivIcon({className: 'submission-marker-div', iconSize: [8 ,8]});

		L.Marker.prototype.initialize.call(this, latlng, opt);

		//Initililize ping animation
		if (makePing){
			this._ping = new PingCircle(this.getLatLng(), 10, {color: "#000000"});
			//this._ping = new PingLayer(this.getLatLng(), 0);
		}

		this.submissionId = submissionId;
		this.showCampaigns = showCampaigns;

		//Initialize click action
		this._setupClickHandler();
	},
	onAdd: function(map){
		L.Marker.prototype.onAdd.call(this, map);

		if (this._ping){
			this._ping.addTo(this._map);
			this._ping.animate({duration: 600, size: 150, delay: 310});
			//this._ping.animate({duration: 200, size: 200, delay: 300});
		}
	},

	_setupClickHandler: function(){
		this.onClick = function(){
			this.showCampaigns.waterfall("onEmphasizeSubmission", {submissionId: this.submissionId});
		}
	},

	hasPing: function(){
		return this._ping ? true : false;
	}

});

L.submissionMarker = function (latlng, options) {
	return new L.SubmissionMarker(latlng, options);
};

}(this, document));