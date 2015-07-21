//package org.folksource.geojson;
//
//import com.vividsolutions.jts.geom.*;
//
//import org.folksource.entities.Location;
//import org.folksource.model.*;
//import org.grouplens.common.dto.Dto;
//
////"type":"Point","crs":{"type":"name","properties":{"name":"EPSG:4326"}},"coordinates":[-87.6292744211119,41.8844803313794]}
//
//public class Feature extends Dto {
//	public String type = "Feature";
//	public Geom geometry;// = new Polygon(new Double[2][2]);
//	public Properties properties;
//
//	public Feature(Geom input) {
//		super();
//		this.setGeometry(input);
//	}
//	public Feature(org.folksource.entities.Location input) {
//		super();
//		this.setGeometry(input.getGeometry());
//		this.setProperties(input);
//	}
//	public Geom getGeometry() {
//		return geometry;
//	}
//
//	public void setGeometry(Geom geometry) {
//		this.geometry = geometry;
//	}
//
//	public void setGeometry(Geometry geometry) {
//		if(geometry instanceof com.vividsolutions.jts.geom.Point) {
//			this.geometry = new Point((com.vividsolutions.jts.geom.Point) geometry);
//		} else {
//			this.geometry = new Polygon((com.vividsolutions.jts.geom.Polygon) geometry);
//		}
//	}
//
//	public String getType() {
//		return type;
//	}
//
//	public void setType(String type) {
//		this.type = type;
//	}
//
//	public Properties getProperties() {
//		return properties;
//	}
//
//	public void setProperties(Properties properties) {
//		this.properties = properties;
//	}
//
//	public void setProperties(Location g) {
//		Properties p = new Properties(g);
//		this.properties = p;
//	}
//}
