package org.citizensense.model;

public class MultipleChoiceAnswer extends Answer {

	public String choices; //pipe separated answers
	
	public MultipleChoiceAnswer(){
		super();
	}
	public MultipleChoiceAnswer(Integer id, Integer q_id, Integer sub_id, String choices) {
		super(id, "multipleChoice", q_id, sub_id);
		this.choices = choices;
	}
	public String getChoices(){
		return choices;
	}
	public void setChoices(String c){
		choices = c;
	}
}
