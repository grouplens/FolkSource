package org.folksource.model;

import org.grouplens.common.dto.Dto;

import com.mchange.v2.c3p0.stmt.GooGooStatementCache;
import com.vividsolutions.jts.geom.Geometry;
import com.vividsolutions.jts.geom.Point;
import com.vividsolutions.jts.geom.Polygon;
import com.vividsolutions.jts.io.ParseException;
import com.vividsolutions.jts.io.WKTReader;

public class LocationDto extends Dto{
	public Integer id = 0;
	public Integer task_id = 0;
	public String geometryString;
	private Geometry geometry;
	
	public LocationDto()
	{
		super();
	}
	
	public LocationDto(Location locIn) {
		this.id = locIn.id;
		this.task_id = locIn.task_id;
		this.geometryString = locIn.getGeometry().toString();
	}
	
	public Location toLocation() {
		System.out.println("TO LOCATION");
		WKTReader r = new WKTReader();
		try {
			System.out.println(this.geometryString);
			this.geometry = r.read(this.geometryString);
			this.geometry.setSRID(4326);
		} catch (ParseException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		if(this.geometry instanceof Point) {
			return new PointLocation(this.id, this.task_id, this.geometry);
		} if(this.geometry instanceof Polygon) {
			return new PolygonLocation(this.id, this.task_id, this.geometry);
		} else {
			return new Location(this.id, this.task_id, this.geometry);
		}
	}
	public static String[] toLocationArray(LocationDto[] ldtos){
		String[] locations = {"vector-points", "vector-polygons"};//new Location[ldtos.length];
//		for (int i = 0; i < locations.length; i++) {
//			locations[i] = ldtos[i].toLocation();
//		}
		return locations;
	}
	
	public static String[] fromLocationArray(Location[] locs){
		String[] locDtos = {"vector-points", "vector-polygons"};//new LocationDto[locs.length];
//		for (int i=0; i < locs.length; i++){
//			locDtos[i] = new LocationDto(locs[i]);
//		}
		return locDtos;
	}

    public static String[] fromLocationLayerArray(LocationLayer[] locationLayers) {
        String[] locDtos = new String[locationLayers.length];
        for(int i = 0; i < locationLayers.length; i++) {
            System.out.println(locationLayers[i].getName());
            locDtos[i] = locationLayers[i].getName();
        }

        return locDtos;

    }
}
