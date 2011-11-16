package org.citizensense.model;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Inheritance;
import javax.persistence.OneToMany;
import javax.persistence.Table;

//@Entity
//@Table(name="campaigns") //@Inheritance(strategy=SINGLE_TABLE)
public class Campaign {

	//@Id
	private Long id;
	//@Column(name="description")
	private String description;
	//@Column(name="start_date")
	private Date start_date;
//	@Column(name="end_date")
	private Date end_date;
	private String times; //figure out if this is actually how we want to represent this
	private int owner_id;
	private int task_id;
	//private User owner;
	
//	@OneToMany(mappedBy="task")
	private List<Task> tasks;
	
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
		return tasks;
	}
	public void setTasks(List<Task> tasks) {
		this.tasks = tasks;
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
	public int getTask_id() {
		return task_id;
	}
	public void setTask_id(int task_id) {
		this.task_id = task_id;
	}

}
