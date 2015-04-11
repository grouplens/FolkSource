package org.folksource.model;

import org.folksource.entities.Location;

import com.vividsolutions.jts.geom.Geometry;
import com.vividsolutions.jts.geom.Point;
import com.vividsolutions.jts.geom.Polygon;
import com.vividsolutions.jts.geom.Polygonal;

public class OSMWayLocation extends Location {
	private Polygon geometry;

	public OSMWayLocation() {
		super();
	}

	public OSMWayLocation(Integer id, Integer task_id, Geometry read) {
		super(id, task_id, read);
		this.setGeometry(read);
	}

	@Override
	public Geometry getGeometry() {
		return geometry;
	}

	@Override
	public void setGeometry(Geometry geometry) {
//		System.out.println(geometry.getClass());
		if(geometry instanceof Polygon) {
			this.geometry = (Polygon) geometry;
			System.out.println(this.geometry);
		}
	}

}