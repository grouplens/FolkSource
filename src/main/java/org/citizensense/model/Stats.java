package org.citizensense.model;

import java.util.List;

import org.grouplens.common.dto.Dto;

public class Stats extends Dto{
	public Integer id;
	public Integer task_id;
	public Integer loc_id;
	public Integer num_submissions;
	public Integer num_sbs_processed;
	public Double curr_confidence;
	
	/* Should this be in here...do I need to update db */
	public List<Answer> estimate;
	
	public List<Answer> getEstimate() {
		return estimate;
	}
	
	public void setEstimate(List<Answer> estimate) {
		this.estimate = estimate;
	}
	/* And above */
	public Integer getId() {
		return id;
	}
	public void setId(Integer id) {
		this.id = id;
	}
	public Integer getTask_id() {
		return task_id;
	}
	public void setTask_id(Integer task_id) {
		this.task_id = task_id;
	}
	public Integer getLoc_id() {
		return loc_id;
	}
	public void setLoc_id(Integer loc_id) {
		this.loc_id = loc_id;
	}
	public Integer getNum_submissions() {
		return num_submissions;
	}
	public void setNum_submissions(Integer num_submissions) {
		this.num_submissions = num_submissions;
	}
	public Integer getNum_sbs_processed() {
		return num_sbs_processed;
	}
	public void setNum_sbs_processed(Integer num_sbs_processed) {
		this.num_sbs_processed = num_sbs_processed;
	}
	public Double getCurr_confidence() {
		return curr_confidence;
	}
	public void setCurr_confidence(Double curr_confidence) {
		this.curr_confidence = curr_confidence;
	}
}
