package org.citizensense.model;

public class StopwatchQuestion extends Question{

	public StopwatchQuestion(){
		super();
		this.type = "stopwatch";
	}
	
	public StopwatchQuestion(Integer id, Integer task_id, String question, Boolean required, Boolean revisable,
			Integer time_limit, Answer answer) {
		super(id, task_id, question, "stopwatch", required, revisable, time_limit, answer);
	} 
}