/*
	PingCircle is a vector graphic implementation of a "pinging" animation (A circle that grows on the map and disapears)
*/

(function (window, document, undefined) {

PingCircle = L.CircleMarker.extend({

	initialize: function (latlng, radius, options){
		//TODO: Use the leaflet built in option setting function here
		var opt = options;
		if (opt === undefined){
			opt = {};
		}
		opt.radius = radius;
		opt.fill = false;
		L.CircleMarker.prototype.initialize.call(this, latlng, opt);
		//this.originalSettings will be used to reset the state of the PingCircle
		this.originalSettings = {latlng: latlng, radius: radius, options: opt};
	},

	onAdd: function(map){
		L.CircleMarker.prototype.onAdd.call(this, map);
	},

	_animateBody: function(options){
		//inspired by https://github.com/maximeh/leaflet.bouncemarker/blob/master/bouncemarker.js

		var that = this;
		var start = new Date();
		var originalRadius = this._radius;
		var targetRadius = options.size;

		that.id = setInterval(function(){
			var timePassed = new Date() - start;
			var progress = timePassed / options.duration;
			if (progress > 1) {
				progress = 1;
			}

			var newRadius = originalRadius + (targetRadius - originalRadius) * progress;
			that.setRadius(newRadius);
			that.setStyle({opacity: 1 - progress});

			if (progress === 1){
				clearInterval(that.id);
				that.destroy();
			}
		}, 10);
	},

	animate: function(options){
		//options must include duration, size, and delay

		var that = this;
		that.delayId = setInterval(function(){
			that._animateBody(options);
			clearInterval(that.delayId);
		}, options.delay);
	},

	destroy: function(){
		if (this._map){
			this._map.removeLayer(this);
		}
		this.reset();
	},

	reset: function(){
		this.setRadius(this.originalSettings.radius);
		this.setStyle(this.originalSettings.options);
	},

});

L.pingCircle = function (latlng, options) {
	return new L.PingCircle(latlng, options);
};

}(this, document));