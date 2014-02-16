package org.citizensense.model;

public class CompassQuestion extends Question {
	
	public CompassQuestion(){
		super();
		this.type = "compass";
	}
	
	public CompassQuestion(Integer id, Integer task_id, String question, Boolean required, Boolean revisable,
			Integer time_limit, Answer answer) {
		super(id, task_id, question, "compass", required, revisable, time_limit, answer);
	}
	
}