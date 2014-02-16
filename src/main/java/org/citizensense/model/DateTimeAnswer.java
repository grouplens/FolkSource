package org.citizensense.model;

public class DateTimeAnswer extends Answer {

	public String timestamp;
	
	public DateTimeAnswer(){
		super();
	}
	
	public DateTimeAnswer(Integer id, Integer q_id, Integer sub_id, String timestamp){
		super(id, "dateTime", q_id, sub_id);
		this.timestamp = timestamp;
	}
	
	public String getTimestamp(){
		return timestamp;
	}
	public void setTimestamp(String t){
		timestamp = t;
	}
}
