/*
 * This is based on work by Nelson Minar, modified for our purposes.
 * The original can be found at:
 * https://github.com/NelsonMinar/vector-river-map/blob/master/clients/lib/TileLayer.d3_geoJSON.js
 */
L.TileLayer.d3_geoJSON =  L.TileLayer.extend({
  onAdd : function(map) {
    L.TileLayer.prototype.onAdd.call(this,map);
    this.g = d3.select(map._container).select("svg").append("g");
    this._path = d3.geo.path().projection(function(d) {
      var point = map.latLngToLayerPoint(new L.LatLng(d[1],d[0]));
      return [point.x,point.y];
    });
    this.on("tileunload",function(d) {
      if (d.tile.xhr) d.tile.xhr.abort();
      if (d.tile.nodes) d.tile.nodes.remove();
      d.tile.nodes = null;
      d.tile.xhr = null;
    });
    console.log("ADDED");
  },
  _loadTile : function(tile,tilePoint) {
    var self = this;
    this._adjustTilePoint(tilePoint);
 
    if (!tile.nodes && !tile.xhr) {
      tile.nodes = d3.select();
      tile.xhr = d3.json(this.getTileUrl(tilePoint),function(d) {
        tile.xhr = null;
        tile.nodes = self.g.append("path")
          .datum(d)
          .attr("d",self._path)
          //.attr("stroke", "black")
          .attr("fill", function(d) {
            if(d.properties.allowed === 'y') {
              return "#008837";
            } else if(d.properties.allowed === 'n') {
              return "#7B3294";
            } else {
              return "grey";
            }
          })
          .attr("opacity", .6)
          .attr("class",self.options.class);

      });

    }
  }
})
