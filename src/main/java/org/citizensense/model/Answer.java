package org.citizensense.model;

import org.grouplens.common.dto.Dto;

public class Answer extends Dto {
	public Integer id;
	public String answer_type;
	public Integer q_id;
	public Integer sub_id;
	
	@Exclude(ExcludeType.EXPORT)
	public Submission submission;
	
	public Answer(){
		
	}
	
	public Answer(Integer id, String answer_type, Integer q_id, Integer sub_id){
		super();
		this.id = id;
		this.answer_type = answer_type;
		this.q_id = q_id;
		this.sub_id = sub_id;
	}
	
	public Integer getId() {
		return id;
	}
	public void setId(int id) {
		System.out.println("[MEEE] Set id called!");
		this.id = id;
	}
	
	public String getAnswer_type() {
		return answer_type;
	}
	public void setAnswer_type(String type) {
		System.out.println("[MEEE] Set answer type called!");
		this.answer_type = type;
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
