package org.citizensense.model;

public class Answer {
	private int id;
	private String answer;
	private String type;
	private int q_id;
	private int sub_id;
	
	public int getId() {
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
	public int getQ_id() {
		return q_id;
	}
	public void setQ_id(int q_id) {
		this.q_id = q_id;
	}
	public int getSub_id() {
		return sub_id;
	}
	public void setSub_id(int sub_id) {
		this.sub_id = sub_id;
	}
	
	
//	
//public String getType();
//public void setType(String type);
//public String getResponse();
//public void setResponse(String res);
//public Integer getTaskId();
//public void setTaskId(Integer id);
}
