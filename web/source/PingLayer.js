/*
	PingLayer is a css3 animated div implementation of a "pinging" animation (A circle that grows on the map and disapears)
*/

(function (window, document, undefined) {

PingLayer = L.Class.extend({
	includes: L.Mixin.Events,

	options: {
		/*
		opacity: 1,
		*/
		foo: "bar",
	},

	initialize: function (center, radius, options){
		this._center = center;
		this._radius = radius;

		L.setOptions(this, options);
	},

	onAdd: function (map){
		this._map = map;

		if (!this._div){
			this._initDiv();
		}

		map._panes.overlayPane.appendChild(this._div);

		map.on("viewreset", this._reset, this);

		this._reset();
	},

	animate: function (options){
		//options must include duration, size, and delay

		if (L.DomUtil.TRANSITION) {
			this._div.style[L.DomUtil.TRANSITION] = ("all " + options.duration + "ms linear");
			this._div.style["transition-delay"]= (options.delay+"ms");
			
			L.DomEvent.on(this._div, L.DomUtil.TRANSITION_END, function(){
				this.destroy();
			}, this);

			var that = this;
			var t = setTimeout(function(){
				that.setSize(options.size);
				console.log("still going");
			}, 10);
		}
	},

	onRemove: function (map){
		map.getPanes().overlayPane.removeChild(this._div);

		map.off("viewreset", this._reset, this);
	},

	addTo: function (map){
		map.addLayer(this);
		return this;
	},

	setLocation: function (latLng){
		this._center = latLng;
		this._reset();
	},

	setSize: function (radius){
		this._radius = radius;
		this._reset();
	},

	destroy: function(){
		if (this._map){
			this._map.removeLayer(this);
		}
	},

	_initDiv: function (){
		this._div = L.DomUtil.create("div", "leaflet-image-layer");
		L.DomUtil.addClass(this._div, "csense-ping-layer");

		L.DomUtil.addClass(this._div, "leaflet-zoom-hide");

		//No idea what these do
		L.extend(this._div, {
			onselectstart: L.Util.falseFn,
			onmousemove: L.Util.falseFn,
		});

	},
	_reset: function (){
		var offset = new L.Point(this._radius/2, this._radius/2);
		var topLeft = this._map.latLngToLayerPoint(this._center).subtract(offset);

		L.DomUtil.setPosition(this._div, topLeft);
		this._div.style.width = this._radius + "px";
		this._div.style.height = this._radius + "px";
	},
});

pingLayer = function (center, radius, options){
	return new PingLayer(center, radius, options);
};

}(this, document));

