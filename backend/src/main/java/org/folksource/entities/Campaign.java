package org.folksource.entities;

import java.math.BigInteger;
import java.text.DateFormat;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Set;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.Id;
import javax.persistence.OneToMany;
import javax.persistence.Table;

import org.folksource.entities.Task;

@Entity
@Table(name="campaigns", schema="public")
public class Campaign {
	
	@Id
	@Column(name = "id")
	public Integer id;
	
	@Column(name = "title")
	public String title;
	
	@Column(name = "description")
	public String description;
	
	@Column(name = "location")
	public String location;
	
	@Column(name = "start_date")
	public Date start_date;
	
	@Column(name = "end_date")
	public Date end_date;
	
	//@Column(name = "start_date_string")
	//public String start_date_string;
	
	//@Column(name = "end_date_string")
	//public String end_date_string;
	//private String times; //figure out if this is actually how we want to represent this
	@Column(name = "owner_id")
	public Integer owner_id;
	
//	@Column(name = "task_id")
//	public Integer task_id;

	//Join column here in the future
//	@OneToMany(mappedBy = "campaign_id", fetch=FetchType.EAGER)
//	public Set<Task> tasks;
	
	/**
	 * @param args
	 */
	public Campaign() {
		super();
	}
	public Campaign(Integer id, String title, String description, String location, Date start_date, Date end_date, String start_date_string, String end_date_string, Integer owner_id, Integer task_id, Set<Task> tasks){
		super();
		this.id = id;
		this.title = title;
		this.description = description;
		this.location = location;
		this.start_date = start_date;
		this.end_date = end_date;
		//this.start_date_string = start_date_string;
		//this.end_date_string = end_date_string;
		this.owner_id = owner_id;
		//this.task_id = task_id;
		//this.tasks = tasks;
	}
	
	public Integer getId() {
		return id;
	}
	public void setId(Integer id) {
		this.id = id;
	}
	//	public Set<Task> getTasks() {
//		if (tasks != null) { return tasks;}
//		return null;
//	}
//	public void setTasks(Set<Task> tasks) {
//		this.tasks = tasks;
//	}
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
//	public String getStart_date_string() {
//		DateFormat df = new SimpleDateFormat("yyyy-MM-dd kk:mm:ss");
//		try {
//			this.setStart_date(df.parse(this.start_date_string));
//		} catch (ParseException e) {
//			// TODO Auto-generated catch block
//			e.printStackTrace();
//		}
//		return this.start_date_string;
//	}
//	public void setStart_date_string(String d) {
//		this.start_date_string = d;
//	}
//	public String getEnd_date_string() {
//		DateFormat df = new SimpleDateFormat("yyyy-MM-dd kk:mm:ss");
//		try {
//			this.setEnd_date(df.parse(this.end_date_string));
//		} catch (ParseException e) {
//			// TODO Auto-generated catch block
//			e.printStackTrace();
//		}
//		return this.end_date_string;
//	}
//	public void setEnd_date_string(String d) {
//		this.end_date_string = d;
//	}
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
//	public Integer getTask_id() {
//		return task_id;
//	}
//	public void setTask_id(int task_id) {
//		this.task_id = task_id;
//	}
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
//	public Set<Task> getTasks() {
//		return tasks;
//	}
//	public void setTasks(Set<Task> tasks) {
//		this.tasks = tasks;
//	}
}
