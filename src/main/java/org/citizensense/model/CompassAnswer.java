package org.citizensense.model;

public class CompassAnswer extends Answer {

	
	public Integer heading;
	
	
	public CompassAnswer(){
		super();
	}
	
	public CompassAnswer(Integer id, String answer_type, Integer q_id, Integer sub_id, Integer heading) {
		super(id, answer_type, q_id, sub_id);
		this.heading = heading;
	}
	
	
	public void setHeading(Integer h){
		this.heading = h;
	}
	public Integer getHeading(){
		return heading;
	}
	
}
