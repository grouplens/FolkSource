(function (window, document, undefined) {

CSenseClusterDivIcon = L.DivIcon.extend({

	createIcon: function (oldIcon) {
		var div = L.DivIcon.prototype.createIcon.call(this, oldIcon);

		div.style.backgroundColor = this._colorToString(this.options.color, .6);
		div.firstElementChild.style.backgroundColor = this._colorToString(this.options.color, .6);
		div.style.color = this._colorToString(this._getTextColor(this.options.color), 1);
		return div;
	},

	_getTextColor: function(bg){
		var b = {r:0, g:0, b:0};
		var w = {r:255, g:255, b:255};
		if ( this._lumDiff(b, bg) > this._lumDiff(w, bg) ){
			return b;
		}
		return w;
	},

	//http://www.splitbrain.org/blog/2008-09/18-calculating_color_contrast_with_php
	_lumDiff: function (c1, c2){
		var l1 = 0.2126 * Math.pow(c1.r/255, 2.2) +
          		 0.7152 * Math.pow(c1.g/255, 2.2) +
         		 0.0722 * Math.pow(c1.b/255, 2.2);
        var l2 = 0.2126 * Math.pow(c2.r/255, 2.2) +
          		 0.7152 * Math.pow(c2.g/255, 2.2) +
                 0.0722 * Math.pow(c2.b/255, 2.2);
        return (Math.max(l1, l2) + .05) / (Math.min(l1, l2) + .05)
	},

	_colorToString: function(c, opacity){
		return "rgba("+c.r+","+c.g+","+c.b+","+opacity+")";
	},

});

L.cSenseClusterDivIcon = function (latlng, options) {
	return new L.CSenseClusterDivIcon(latlng, options);
};

}(this, document));