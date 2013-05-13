package org.citizensense.model;

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
		if(o[3] instanceof Integer)
			this.sub_timestamp = (String) o[3];
		if(o[4] instanceof Integer)
			this.question_id = (Integer) o[4];
		if(o[5] instanceof String)
			this.question = (String) o[5];
		if(o[6] instanceof String)
			this.answer = (String) o[6];
	}

//	public Integer getT_id() {
//		return t_id;
//	}
//
//	public void setT_id(Integer t_id) {
//		this.t_id = t_id;
//	}

	public String getT_desc() {
		return task_desc;
	}

	public void setT_desc(String t_desc) {
		this.task_desc = t_desc;
	}

	public Integer getS_id() {
		return sub_id;
	}

	public void setS_id(Integer s_id) {
		this.sub_id = s_id;
	}

	public String getLoc() {
		return location;
	}

	public void setLoc(String loc) {
		this.location = loc;
	}

	public Integer getQ_id() {
		return question_id;
	}

	public void setQ_id(Integer q_id) {
		this.question_id = q_id;
	}

	public String getQ() {
		return question;
	}

	public void setQ(String q) {
		this.question = q;
	}

	public String getA() {
		return answer;
	}

	public void setA(String a) {
		this.answer = a;
	}
	
	
}
