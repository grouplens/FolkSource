package org.citizensense.model;

public class AccelerometerQuestion extends Question {
	
	public AccelerometerQuestion(){
		super();
		this.type = "accelerometer";
	}
	
	public AccelerometerQuestion(Integer id, Integer task_id, String question, Boolean required, Boolean revisable,
			Integer time_limit, Answer answer) {
		super(id, task_id, question, "accelerometer", required, revisable, time_limit, answer);
	}
	
}