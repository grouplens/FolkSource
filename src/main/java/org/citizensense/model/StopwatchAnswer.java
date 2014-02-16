package org.citizensense.model;

import java.sql.Time;
/**
 * An answer type representing a stopwatch time capture
 *
 */
public class StopwatchAnswer extends Answer {
	
	
	public Integer milliseconds;
	
	
	public StopwatchAnswer(){
		super();
	}
	
	public StopwatchAnswer(Integer id, Integer q_id, Integer sub_id, Integer milliseconds) {
		super(id, "stopwatch", q_id, sub_id); 
		this.milliseconds = milliseconds;
	}
	
	public Integer getMilliseconds(){
		return milliseconds;
	}
	
	public void setMilliseconds(Integer milliseconds){
		this.milliseconds = milliseconds;
	}
	
}
