package org.folksource.model;

import com.vividsolutions.jts.geom.Geometry;
import com.vividsolutions.jts.geom.Point;
import com.vividsolutions.jts.io.ParseException;
import com.vividsolutions.jts.io.WKTReader;

public class PointLocation extends Location {
	private Point geometry;
	
	public PointLocation() {
		super();
	}

	public PointLocation(Integer id, Integer task_id, Geometry read) {
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