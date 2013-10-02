package org.citizensense.model;

import com.vividsolutions.jts.geom.Geometry;

public class Location{
	public Integer id;
	public Integer task_id;
//	@Exclude(ExcludeType.EXPORT)
	private Geometry geometry;
	
	public Location() {
		
	}
	
	public Location(Integer id2, Integer task_id2, Geometry geometry2) {
		this.id = id2;
		this.task_id = task_id2;
		this.geometry = geometry2;
	}
	public Integer getId() {
		return this.id;
	}
	public void setId(Integer id) {
		this.id = id;
	}
	public Integer getTask_id() {
		return this.task_id;
	}
	public void setTask_id(Integer task_id){
		this.task_id = task_id;
	}
	
	public Geometry getGeometry() {
		return geometry;
	}

	public void setGeometry(Geometry geometry) {
		this.geometry = geometry;
	}
}


