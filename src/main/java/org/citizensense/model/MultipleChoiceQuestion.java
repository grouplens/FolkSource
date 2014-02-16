package org.citizensense.model;

public class MultipleChoiceQuestion extends Question{
	
	public Integer max_choices;//If 1, "radio" choices; if 2+, "checkboxes". No 0 or negative numbers
	public String choices; //Separated by a '|' character to indicate additional choices.
	
	public MultipleChoiceQuestion(){
		super();
		this.type = "multipleChoice";
		this.max_choices = 1;
		this.choices = "";
	}
	
	public MultipleChoiceQuestion(Integer id, Integer task_id, String question, Boolean required, Boolean revisable,
			Integer time_limit, Answer answer, Integer max_choices, String choices) {
		super(id, task_id, question, "multipleChoice", required, revisable, time_limit, answer);
		this.max_choices = max_choices;
		this.choices = choices;
	} 
	
	public Integer getMax_choices(){
		return max_choices;
	}
	
	public void setMax_choices(Integer max_choices){
		this.max_choices = max_choices;
	}
	
	public String getChoices(){
		return choices;
	}
	
	public void setChoices(String choices){
		this.choices = choices;
	}
	
}