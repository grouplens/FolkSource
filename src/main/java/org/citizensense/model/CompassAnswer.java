package org.citizensense.model;

public class CompassAnswer extends Answer {

	
	public Float heading;
	
	
	public CompassAnswer(){
		super();
	}
	
	public CompassAnswer(Integer id, String answer_type, Integer q_id, Integer sub_id, Float heading) {
		super(id, answer_type, q_id, sub_id);
		this.heading = heading;
	}
	
	
	public void setHeading(float h){
		this.heading = h;
	}
	public Float getHeading(){
		return heading;
	}
	
}
