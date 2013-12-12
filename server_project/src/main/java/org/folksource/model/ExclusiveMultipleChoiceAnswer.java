package org.folksource.model;

public class ExclusiveMultipleChoiceAnswer extends Answer {

	public String choices; //pipe seperated answers
	
	public ExclusiveMultipleChoiceAnswer(){
		super();
	}
	public ExclusiveMultipleChoiceAnswer(Integer id, String answer_type, Integer q_id, Integer sub_id, String choices) {
		super(id, answer_type, q_id, sub_id);
		this.choices = choices;
	}
	public String getChoices(){
		return choices;
	}
	public void setChoices(String c){
		choices = c;
	}
}
