package org.citizensense.model;
import java.util.ArrayList;
import java.util.Date;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.OneToMany;

@Entity
public class Campaign {

	@Id
	private Long id;
	@Column(name="description")
	private String description;
	@Column(name="start_date")
	private Date start_date;
	@Column(name="end_date")
	private Date end_date;
	private String times; //figure out if this is actually how we want to represent this
	//private User owner;
	
	@OneToMany(mappedBy="task")
	private ArrayList<Task> tasks;
	
	/**
	 * @param args
	 */
	public Campaign() {
	
	}
	public static void main(String[] args) {
		// TODO Auto-generated method stub

	}
	public Long getID() {
		return id;
	}
	public void setID(Long id) {
		this.id = id;
	}
	public ArrayList<Task> getTasks() {
		return tasks;
	}
	public void setTasks(ArrayList<Task> tasks) {
		this.tasks = tasks;
	}
	public String getDescription() {
		return description;
	}
	public void setDescription(String description) {
		this.description = description;
	}
	public Date getStartDate() {
		return start_date;
	}
	public void setStartDate(Date start_date) {
		this.start_date = start_date;
	}
	public Date getEndDate() {
		return end_date;
	}
	public void setEndDate(Date end_date) {
		this.end_date = end_date;
	}
//	public User getOwner() {
//		return owner;
//	}
//	public void setOwner(User owner) {
//		this.owner = owner;
//	}

}
