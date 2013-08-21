package org.citizensense.model;

import java.sql.Time;
/**
 * An answer type representing a given amount of accumulated time (at no specific point in time).
 *
 */
public class TimeSpanAnswer extends Answer {
	
	
	public Integer milliseconds;
	
	
	public TimeSpanAnswer(){
		super();
	}
	
	public TimeSpanAnswer(Integer id, String answer_type, Integer q_id, Integer sub_id, Integer milliseconds) {
		super(id, answer_type, q_id, sub_id);
		this.milliseconds = milliseconds;
	}
	
	public Integer getMilliseconds(){
		return milliseconds;
	}
	
	public void setMilliseconds(Integer milliseconds){
		this.milliseconds = milliseconds;
	}
	
}
