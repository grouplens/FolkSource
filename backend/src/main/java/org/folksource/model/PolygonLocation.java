package org.folksource.model;

import com.vividsolutions.jts.geom.Geometry;
import com.vividsolutions.jts.geom.Polygon;
import com.vividsolutions.jts.io.ParseException;
import com.vividsolutions.jts.io.WKTReader;

public class PolygonLocation extends Location {
	private Polygon geometry;
	
	public PolygonLocation() {
		super();
	}

	public PolygonLocation(Integer id, Integer task_id, Geometry read) {
		super(id, task_id, read);
		this.setGeometry(read);
	}

	@Override
	public Geometry getGeometry() {
		return geometry;
	}

	@Override
	public void setGeometry(Geometry geometry) {
		if(geometry instanceof Polygon)
			this.geometry = (Polygon)geometry;
	}
}