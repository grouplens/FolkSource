package org.folksource.model;

import com.vividsolutions.jts.geom.*;

public class OSMWayLocation extends Location {
	private LineString geometry;
	public Integer version;

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
		this.geometry = (LineString) geometry;
	}

	public Integer getVersion() {
		return version;
	}

	public void setVersion(Integer version) {
		this.version = version;
	}
}