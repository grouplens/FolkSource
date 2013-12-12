package org.folksource.model;

public class DateTimeAnswer extends Answer {

	public String timestamp;
	
	public DateTimeAnswer(){
		super();
	}
	
	public DateTimeAnswer(Integer id, String answer_type, Integer q_id, Integer sub_id, String timestamp){
		super(id, answer_type, q_id, sub_id);
		this.timestamp = timestamp;
	}
	
	public String getTimestamp(){
		return timestamp;
	}
	public void setTimestamp(String t){
		timestamp = t;
	}
}
