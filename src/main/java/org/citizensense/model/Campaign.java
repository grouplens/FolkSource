package org.citizensense.model;
import java.util.Arrays;
import java.util.Date;
import java.util.List;

import org.grouplens.common.dto.Dto;

public class Campaign extends Dto{

	public Long id;
	public String title;
	public String description;
	public String location;
	public Date start_date;
	public Date end_date;
	//private String times; //figure out if this is actually how we want to represent this
	public Integer owner_id;
	public Integer task_id;

	public Task[] tasks;
	
	/**
	 * @param args
	 */
	public Campaign() {
	
	}
	public static void main(String[] args) {
		// TODO Auto-generated method stub

	}
	public Long getId() {
		return id;
	}
	public void setId(Long id) {
		this.id = id;
	}
	public List<Task> getTasks() {
		return Arrays.asList(tasks);
	}
	public void setTasks(List<Task> tasks) {
		this.tasks = tasks.toArray(new Task[tasks.size()]);
	}
	public String getDescription() {
		return description;
	}
	public void setDescription(String description) {
		this.description = description;
	}
	public Date getStart_date() {
		return start_date;
	}
	public void setStart_date(Date start_date) {
		this.start_date = start_date;
	}
	public Date getEnd_date() {
		return end_date;
	}
	public void setEnd_date(Date end_date) {
		this.end_date = end_date;
	}
//	public User getOwner() {
//		return owner;
//	}
//	public void setOwner(User owner) {
//		this.owner = owner;
//	}
	public int getOwner_id() {
		return owner_id;
	}
	public void setOwner_id(int owner_id) {
		this.owner_id = owner_id;
	}
	public Integer getTask_id() {
		return task_id;
	}
	public void setTask_id(int task_id) {
		this.task_id = task_id;
	}
	public String getTitle() {
		return title;
	}
	public void setTitle(String title) {
		this.title = title;
	}
	public void setLocation(String location) {
		this.location = location;
	}
	public String getLocation() {
		return location;
	}

}
