//package org.folksource.geojson;
//
//import org.grouplens.common.dto.Dto;
//
//import java.util.ArrayList;
//
//public class GeoJSON extends Dto { //creates a geoJSON key that contains geoJSON
//	public String type = "FeatureCollection";
//	public Feature[] features;
//
//	public GeoJSON(ArrayList<Feature> input) {
//		super();
//		this.features = new Feature[input.size()];
//		input.toArray(this.features);
////		this.geometries = (Feature[])input;
//	}
//	public GeoJSON(Feature[] input) {
//		super();
//		this.features = input;
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
//	public Feature[] getFeatures() {
//		return features;
//	}
//
//	public void setFeatures(Feature[] features) {
//		this.features = features;
//	}
//}
