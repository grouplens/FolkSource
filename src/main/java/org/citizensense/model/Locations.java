package org.citizensense.model;

import org.grouplens.common.dto.Dto;

public class Locations extends Dto{
	public Integer id;
	public Location location;
	public Integer task_id;
	public Integer stat_id;
	
	public Integer getId() {
		return id;
	}
	public void setId(Integer id) {
		this.id = id;
	}
	public Location getLocation() {
		return location;
	}
	public void setLocation(Location location) {
		this.location = location;
	}
	public Integer getTask_id() {
		return task_id;
	}
	public void setTask_id(Integer task_id) {
		this.task_id = task_id;
	}
	
	public Integer getStat_id() {
		return stat_id;
	}
	
	public void setStat_id(Integer stat_id) {
		this.stat_id = stat_id;
	}
}
