package org.citizensense.model;

import java.util.List;

public class Submission {
	private int id;
	private int task_id;
	private String notes;
	private String gps_location;
	private List<Answer> answers;

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
	public String getNotes() {
		return notes;
	}
	public void setNotes(String notes) {
		this.notes = notes;
	}
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
}
