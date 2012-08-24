package org.citizensense.model;

import org.grouplens.common.dto.Dto;

public class Answer extends Dto {
	public Integer id;
	public String answer;
	public String type;
	public Integer q_id;
	public Integer sub_id;
	
	@Exclude(ExcludeType.EXPORT)
	public Submission submission;
	
	public Integer getId() {
		return id;
	}
	public void setId(int id) {
		this.id = id;
	}
	public String getAnswer() {
		return answer;
	}
	public void setAnswer(String answer) {
		this.answer = answer;
	}
	public String getType() {
		return type;
	}
	public void setType(String type) {
		this.type = type;
	}
	public Integer getQ_id() {
		return q_id;
	}
	public void setQ_id(int q_id) {
		this.q_id = q_id;
	}
	public Integer getSub_id() {
		return sub_id;
	}
	public void setSub_id(int sub_id) {
		this.sub_id = sub_id;
	}
	public Submission getSubmission() {
		return submission;
	}
	public void setSubmission(Submission submission) {
		this.submission = submission;
	}
	
	
//	
//public String getType();
//public void setType(String type);
//public String getResponse();
//public void setResponse(String res);
//public Integer getTaskId();
//public void setTaskId(Integer id);
}
