package org.citizensense.model;

import java.util.Arrays;
import java.util.Date;
import java.util.List;

import org.grouplens.common.dto.Dto;

public class Submission extends Dto {
	public Integer id;
	public Integer task_id;
	public Integer user_id;
//	private String notes;
	public String gps_location;
	public Answer[] answers;
	public Date timestamp;
	public String img_path;
	public Boolean  processed;
	public Boolean in_range;
	
	public Boolean getProcessed() {
		return processed;
	}
	
	public void setProcessed(Boolean processed) {
		this.processed = processed;
	}
	
	public Boolean getInRange() {
		return in_range;
	}
	
	public void setInRange(Boolean in_range) {
		this.in_range = in_range;
	}	

	public Integer getId() {
		return id;
	}
	public void setId(int id) {
		this.id = id;
	}
	public Integer getTask_id() {
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
		return Arrays.asList(answers);
	}
	public void setAnswers(List<Answer> answers) {
//		System.out.println(answers);
//		for(Object o : answers) {
//			if(o instanceof Answer)
//				this.answers.add((Answer)o);
//		}
		this.answers = answers.toArray(new Answer[answers.size()]);
	}
	public Integer getUser_id() {
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
