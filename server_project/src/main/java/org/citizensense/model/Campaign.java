package org.citizensense.model;
import java.text.DateFormat;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Arrays;
import java.util.Date;
import java.util.List;

import org.grouplens.common.dto.Dto;

public class Campaign{

	public Integer id;
	public String title;
	public String description;
	public String location;
	public Date start_date;
	public Date end_date;
	public String start_date_string;
	public String end_date_string;
	//private String times; //figure out if this is actually how we want to represent this
	public Integer owner_id;
	public Integer task_id;

	public Task[] tasks;
	
	/**
	 * @param args
	 */
	public Campaign() {
		super();
	}
	public Campaign(Integer id, String title, String description, String location, Date start_date, Date end_date, String start_date_string, String end_date_string, Integer owner_id, Integer task_id, Task[] tasks){
		super();
		this.id = id;
		this.title = title;
		this.description = description;
		this.location = location;
		this.start_date = start_date;
		this.end_date = end_date;
		this.start_date_string = start_date_string;
		this.end_date_string = end_date_string;
		this.owner_id = owner_id;
		this.task_id = task_id;
		this.tasks = tasks;
	}
	
	public static void main(String[] args) {
		// TODO Auto-generated method stub

	}
	public Integer getId() {
		return id;
	}
	public void setId(Integer id) {
		this.id = id;
	}
	public List<Task> getTasks() {
		if (tasks != null) { return Arrays.asList(tasks);}
		return null;
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
//		this.setStart_date_string(start_date);
	}
	public Date getEnd_date() {
		return end_date;
	}
	public void setEnd_date(Date end_date) {
		this.end_date = end_date;
//		this.setEnd_date_string(end_date);
	}
	public String getStart_date_string() {
		DateFormat df = new SimpleDateFormat("yyyy-MM-dd kk:mm:ss");
		try {
			this.setStart_date(df.parse(this.start_date_string));
		} catch (ParseException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		return this.start_date_string;
	}
	public void setStart_date_string(String d) {
		this.start_date_string = d;
	}
	public String getEnd_date_string() {
		DateFormat df = new SimpleDateFormat("yyyy-MM-dd kk:mm:ss");
		try {
			this.setEnd_date(df.parse(this.end_date_string));
		} catch (ParseException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		return this.end_date_string;
	}
	public void setEnd_date_string(String d) {
		this.end_date_string = d;
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
