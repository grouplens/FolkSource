package org.citizensense.model;

import java.util.Date;
import java.util.List;

public class Submission {
	private int id;
	private int task_id;
	private int user_id;
//	private String notes;
	private String gps_location;
	private List<Answer> answers;
	private Date timestamp;
	private String img_path;

	public int getId() {
		return id;
	}
	public void setId(int id) {
		this.id = id;
	}
	public int getTask_id() {
		return task_id;
	}
	public void setTask_id(int task_id) {
		this.task_id = task_id;
	}
//	public String getNotes() {
//		return notes;
//	}
//	public void setNotes(String notes) {
//		this.notes = notes;
//	}
	public String getGps_location() {
		return gps_location;
	}
	public void setGps_location(String gps_location) {
		this.gps_location = gps_location;
	}
	public List<Answer> getAnswers() {
		return answers;
	}
	public void setAnswers(List<Answer> answers) {
		this.answers = answers;
	}
	public int getUser_id() {
		return user_id;
	}
	public void setUser_id(int user_id) {
		this.user_id = user_id;
	}
	public Date getTimestamp() {
		return timestamp;
	}
	public void setTimestamp(Date timestamp) {
		this.timestamp = timestamp;
	}
	public String getImg_path() {
		return img_path;
	}
	public void setImg_path(String img_path) {
		this.img_path = img_path;
	}
}
