package org.folksource.model;

import com.vividsolutions.jts.geom.Geometry;
import com.vividsolutions.jts.geom.Point;

public class OSMPointLocation extends Location {
	private Point geometry;

	public OSMPointLocation() {
		super();
	}

	public OSMPointLocation(Integer id, Integer task_id, Geometry read) {
		super(id, task_id, read);
		this.setGeometry((Point) read);
	}

	@Override
	public Geometry getGeometry() {
		return geometry;
	}

	@Override
	public void setGeometry(Geometry geometry) {
		if(geometry instanceof Point)
			this.geometry = (Point)geometry;
	}

}