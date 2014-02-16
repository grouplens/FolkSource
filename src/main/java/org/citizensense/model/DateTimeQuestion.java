package org.citizensense.model;

public class DateTimeQuestion extends Question {

	public DateTimeQuestion(){
		super();
		this.type = "dateTime";
	}
	
	public DateTimeQuestion(Integer id, Integer task_id, String question, Boolean required, Boolean revisable,
			Integer time_limit, Answer answer) {
		super(id, task_id, question, "dateTime", required, revisable, time_limit, answer);
	} 
	
}