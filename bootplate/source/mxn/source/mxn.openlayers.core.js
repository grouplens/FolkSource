// mxn.openlayers.core.js

mxn.register("openlayers", {
    Mapstraction: {
        init: function (a, b) {
            var c = this;
            this.layers = {}, this.layers.osm = new OpenLayers.Layer.OSM("OpenStreetMap", null, ["http://a.tile.openstreetmap.org/", "http://b.tile.openstreetmap.org/", "http://c.tile.openstreetmap.org/"], {
                transitionEffect: "resize"
            }), this.layers.markers = new OpenLayers.Layer.Vector("markers", {
                strategies: new OpenLayers.Strategy.Cluster({
                    distance: 30,
                    threshold: 2
                })
            });
            var d = new OpenLayers.Map(a.id, {
                numZoomLevels: 18,
                projection: "EPSG:900913"
            });
            d.events.register("click", d, function (a) {
                var e = d.getLonLatFromViewPortPx(a.xy),
                    f = new mxn.LatLonPoint;
                f.fromProprietary(b, e), c.click.fire({
                    location: f
                });
            }), d.events.register("zoomend", d, function (a) {
                c.changeZoom.fire();
            }), d.events.register("moveend", d, function (a) {
                c.moveendHandler(c), c.endPan.fire();
            });
            var e = function (a) {
                c.load.fire(), this.events.unregister("loadend", this, e);
            };
            for (var f in this.layers) this.layers.hasOwnProperty(f) && this.layers[f].visibility === !0 && this.layers[f].events.register("loadend", this.layers[f], e);
            d.addLayer(this.layers.osm), d.addLayer(this.layers.markers), this.tileLayers.push(["http://a.tile.openstreetmap.org/", this.layers.osm, !0]), this.maps[b] = d, this.loaded[b] = !0;
        },
        applyOptions: function () {
            var a = this.maps[this.api],
                b = a.getControlsByClass("OpenLayers.Control.TouchNavigation"),
                c;
            b.length > 0 && (c = b[0], this.options.enableDragging ? c.activate() : c.deactivate());
        },
        resizeTo: function (a, b) {
            this.currentElement.style.width = a, this.currentElement.style.height = b, this.maps[this.api].updateSize();
        },
        testFunction: function () {
            console.log("in test function");
        },
        addControls: function (a) {
            var b = this.maps[this.api];
            for (var c = b.controls.length; c > 1; c--) b.controls[c - 1].deactivate(), b.removeControl(b.controls[c - 1]);
            a.zoom == "large" ? b.addControl(new OpenLayers.Control.PanZoomBar) : a.zoom == "small" ? (b.addControl(new OpenLayers.Control.ZoomPanel), a.pan && b.addControl(new OpenLayers.Control.PanPanel)) : a.zoom == "mobile" ? (b.addControl(new OpenLayers.Control.TouchNavigation({
                dragPanOptions: {
                    enableKinetic: !0
                },
                autoActivate: !0,
                documentDrag: !1,
                clickHandlerOptions: {
                    pixelTolerance: 20
                }
            })), b.addControl(new OpenLayers.Control.Zoom), b.addControl(new OpenLayers.Control.SelectFeature(this.layers.markers, {
                autoActivate: !0,
                onSelect: function (a) {
                    a.mapstraction_marker.click.fire();
                }
            }))) : a.pan && b.addControl(new OpenLayers.Control.PanPanel), a.overview && b.addControl(new OpenLayers.Control.OverviewMap), a.map_type && b.addControl(new OpenLayers.Control.LayerSwitcher), a.scale && b.addControl(new OpenLayers.Control.ScaleLine);
        },
        addSmallControls: function () {
            var a = this.maps[this.api];
            this.addControlsArgs.pan = !1, this.addControlsArgs.scale = !1, this.addControlsArgs.zoom = "small", a.addControl(new OpenLayers.Control.ZoomBox), a.addControl(new OpenLayers.Control.LayerSwitcher({
                ascending: !1
            }));
        },
        addLargeControls: function () {
            var a = this.maps[this.api];
            a.addControl(new OpenLayers.Control.PanZoomBar), this.addControlsArgs.pan = !0, this.addControlsArgs.zoom = "large";
        },
        addMapTypeControls: function () {
            var a = this.maps[this.api];
            a.addControl(new OpenLayers.Control.LayerSwitcher({
                ascending: !1
            })), this.addControlsArgs.map_type = !0;
        },
        setCenterAndZoom: function (a, b) {
            var c = this.maps[this.api],
                d = a.toProprietary(this.api),
                e = new OpenLayers.LonLat(d.x, d.y);
            c.setCenter(e, b);
        },
        addMarker: function (a, b) {
            var c = this.maps[this.api],
                d = a.toProprietary(this.api);
            return this.layers.markers.addFeatures([d]), c.addLayer(this.layers.markers), d;
        },
        removeMarker: function (a) {
            throw "Not implemented";
        },
        declutterMarkers: function (a) {
            throw "Not supported";
        },
        addPolyline: function (a, b) {
            throw "Not implemented";
        },
        removePolyline: function (a) {},
        removeAllPolylines: function () {},
        getCenter: function () {
            var a = this.maps[this.api],
                b = a.getCenter(),
                c = new mxn.LatLonPoint;
            return c.fromProprietary(this.api, b), c;
        },
        setCenter: function (a, b) {
            var c = this.maps[this.api],
                d = a.toProprietary(this.api);
            c.setCenter(d);
        },
        setZoom: function (a) {
            var b = this.maps[this.api];
            b.zoomTo(a);
        },
        getZoom: function () {
            var a = this.maps[this.api];
            return a.zoom;
        },
        getZoomLevelForBoundingBox: function (a) {
            var b = this.maps[this.api],
                c = a.getSouthWest(),
                d = a.getNorthEast();
            c.lon > d.lon && (c.lon -= 360);
            var e = new OpenLayers.Bounds;
            e.extend((new mxn.LatLonPoint(c.lat, c.lon)).toProprietary(this.api)), e.extend((new mxn.LatLonPoint(d.lat, d.lon)).toProprietary(this.api));
            var f = b.getZoomForExtent(e);
            return f;
        },
        setMapType: function (a) {
            var b = this.maps[this.api];
            throw "Not implemented (setMapType)";
        },
        getMapType: function () {
            var a = this.maps[this.api];
            return mxn.Mapstraction.ROAD;
        },
        getBounds: function () {
            var a = this.maps[this.api],
                b = a.calculateBounds(),
                c = new OpenLayers.LonLat(b.left, b.bottom),
                d = new mxn.LatLonPoint(0, 0);
            d.fromProprietary(this.api, c);
            var e = new OpenLayers.LonLat(b.right, b.top),
                f = new mxn.LatLonPoint(0, 0);
            return f.fromProprietary(this.api, e), new mxn.BoundingBox(d.lat, d.lon, f.lat, f.lon);
        },
        setBounds: function (a) {
            var b = this.maps[this.api],
                c = a.getSouthWest(),
                d = a.getNorthEast();
            c.lon > d.lon && (c.lon -= 360);
            var e = new OpenLayers.Bounds;
            e.extend((new mxn.LatLonPoint(c.lat, c.lon)).toProprietary(this.api)), e.extend((new mxn.LatLonPoint(d.lat, d.lon)).toProprietary(this.api)), b.zoomToExtent(e);
        },
        addImageOverlay: function (a, b, c, d, e, f, g, h) {
            var i = this.maps[this.api],
                j = new OpenLayers.Bounds;
            j.extend((new mxn.LatLonPoint(e, d)).toProprietary(this.api)), j.extend((new mxn.LatLonPoint(g, f)).toProprietary(this.api));
            var k = new OpenLayers.Layer.Image(a, b, j, new OpenLayers.Size(h.imgElm.width, h.imgElm.height), {
                isBaseLayer: !1,
                alwaysInRange: !0
            });
            i.addLayer(k), this.setImageOpacity(k.div.id, c);
        },
        setImagePosition: function (a, b) {},
        addOverlay: function (a, b) {
            var c = this.maps[this.api],
                d = new OpenLayers.Layer.GML("kml", a, {
                    format: OpenLayers.Format.KML,
                    formatOptions: new OpenLayers.Format.KML({
                        extractStyles: !0,
                        extractAttributes: !0
                    }),
                    projection: new OpenLayers.Projection("EPSG:4326")
                });
            if (b) {
                var e = function () {
                    dataExtent = this.getDataExtent(), c.zoomToExtent(dataExtent);
                };
                d.events.register("loadend", d, e);
            }
            c.addLayer(d);
        },
        addTileLayer: function (a, b, c, d, e, f) {
            var g = this.maps[this.api],
                h = a.replace(/\{Z\}/g, "${z}");
            h = h.replace(/\{X\}/g, "${x}"), h = h.replace(/\{Y\}/g, "${y}");
            var i = new OpenLayers.Layer.XYZ(c, h, {
                sphericalMercator: !1,
                transitionEffect: "resize",
                opacity: b
            });
            f || i.addOptions({
                displayInLayerSwitcher: !1,
                isBaseLayer: !1
            }), g.addLayer(i), this.tileLayers.push([a, i, !1]);
        },
        toggleTileLayer: function (a) {
            var b = this.maps[this.api];
            for (var c = this.tileLayers.length - 1; c >= 0; c--) this.tileLayers[c][0] == a && (this.tileLayers[c][2] = !this.tileLayers[c][2], this.tileLayers[c][1].setVisibility(this.tileLayers[c][2]));
        },
        getPixelRatio: function () {
            var a = this.maps[this.api];
        },
        mousePosition: function (a) {
            var b = this.maps[this.api],
                c = document.getElementById(a);
            c !== null && b.events.register("mousemove", b, function (a) {
                var d = b.getLonLatFromViewPortPx(a.xy),
                    e = new mxn.LatLonPoint;
                e.fromProprietary("openlayers", d);
                var f = e.lat.toFixed(4) + " / " + e.lon.toFixed(4);
                c.innerHTML = f;
            }), c.innerHTML = "0.0000 / 0.0000";
        }
    },
    LatLonPoint: {
        toProprietary: function () {
            var a = this.lon * 20037508.34 / 180,
                b = Math.log(Math.tan((90 + this.lat) * Math.PI / 360)) / (Math.PI / 180);
            b = b * 20037508.34 / 180;
            var c = new OpenLayers.Geometry.Point(a, b);
            return c;
        },
        fromProprietary: function (a) {
            var b = a.lon / 20037508.34 * 180,
                c = a.lat / 20037508.34 * 180;
            c = 180 / Math.PI * (2 * Math.atan(Math.exp(c * Math.PI / 180)) - Math.PI / 2), this.lon = b, this.lat = c;
        }
    },
    Marker: {
        toProprietary: function () {
            var a, b, c, d = {};
            this.iconSize ? (d.graphicWidth = this.iconSize[0], d.graphicWidth = this.iconSize[1]) : (d.graphicWidth = 21, d.graphicWidth = 25), this.iconUrl ? d.externalGraphic = this.iconUrl : d.externalGraphic = "http://openlayers.org/dev/img/marker-gold.png";
            var e = this.location.toProprietary("openlayers"),
                f = new OpenLayers.Geometry.Point(e.lat, e.lon);
            f.calculateBounds();
            var g = new OpenLayers.Feature.Vector(e, null, d);
            return g;
        },
        openBubble: function () {
            throw "Not implemented";
        },
        closeBubble: function () {
            throw "Not implemented";
        },
        hide: function () {
            throw "Not implemented";
        },
        show: function () {
            throw "Not implemented";
        },
        update: function () {
            throw "Not implemented";
        }
    },
    Polyline: {
        toProprietary: function () {
            throw "Not implemented";
        },
        show: function () {
            throw "Not implemented";
        },
        hide: function () {
            throw "Not implemented";
        }
    }
});
