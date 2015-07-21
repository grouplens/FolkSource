//package org.folksource.geojson;
//
//import org.grouplens.common.dto.Dto;
//
//import java.util.ArrayList;
//
//public class GeometryCollection extends Dto { //creates a geoJSON key that contains geoJSON
//	public String type = "GeometryCollection";
//	public Geom[] geometries;
//
//	public GeometryCollection(ArrayList<Geom> input) {
//		super();
//		this.geometries = new Geom[input.size()];
//		input.toArray(this.geometries);
////		this.geometries = (Feature[])input;
//	}
//	public GeometryCollection(Geom[] input) {
//		super();
//		this.geometries = input;
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
//	public Geom[] getGeometries() {
//		return geometries;
//	}
//
//	public void setGeometries(Geom[] geometries) {
//		this.geometries = geometries;
//	}
//}
