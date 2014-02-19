package org.folksource.model;

import java.sql.Timestamp;

import org.hibernate.Hibernate;

public class BDObject {
//	public Integer t_id;
	public String task_desc;
	public Integer sub_id;
	public String location;
	public String sub_timestamp;
	public Integer question_id;
	public String question;
	public String answer;
	
	public BDObject(Object[] o) {
//		if(o[0] instanceof Integer)
//			this.t_id = (Integer) o[0];
		if(o[0] instanceof String)
			this.task_desc = (String) o[0];
		if(o[1] instanceof Integer)
			this.sub_id = (Integer) o[1];
		if(o[2] instanceof String)
			this.location = (String) o[2];
		if(o[3] instanceof Timestamp)
			this.sub_timestamp = o[3].toString();
		if(o[4] instanceof Integer)
			this.question_id = (Integer) o[4];
		if(o[5] instanceof String)
			this.question = (String) o[5];
		if(o[6] instanceof String)
			this.answer = (String) o[6];
	}

	public String getTask_desc() {
		return task_desc;
	}

	public void setTask_desc(String task_desc) {
		this.task_desc = task_desc;
	}

	public Integer getSub_id() {
		return sub_id;
	}

	public void setSub_id(Integer sub_id) {
		this.sub_id = sub_id;
	}

	public String getLocation() {
		return location;
	}

	public void setLocation(String location) {
		this.location = location;
	}

	public String getSub_timestamp() {
		return sub_timestamp;
	}

	public void setSub_timestamp(String sub_timestamp) {
		this.sub_timestamp = sub_timestamp;
	}

	public Integer getQuestion_id() {
		return question_id;
	}

	public void setQuestion_id(Integer question_id) {
		this.question_id = question_id;
	}

	public String getQuestion() {
		return question;
	}

	public void setQuestion(String question) {
		this.question = question;
	}

	public String getAnswer() {
		return answer;
	}

	public void setAnswer(String answer) {
		this.answer = answer;
	}

}
