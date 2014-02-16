package org.citizensense.model;

public class ComplexCounterQuestion extends Question {

	public Integer max_value; //maximum value for counter, in case question asks something like "See how long it takes to count 20 bikes"
	//public ____ label //In case we want counters to have labels on them. Could be text (e.g. car, bike), could be icon
	
	public ComplexCounterQuestion(){
		super();
		this.type = "complexCounter";
		this.max_value = 0;
	}
	
	public ComplexCounterQuestion(Integer id, Integer task_id, String question, Boolean required, Boolean revisable,
			Integer time_limit, Answer answer, Integer max_value) {
		super(id, task_id, question, "complexCounter", required, revisable, time_limit, answer);
		this.max_value = max_value;
	}
	
	public Integer getMax_value(){
		return max_value;
	}
	
	public void setMax_value(Integer max_value){
		this.max_value = max_value;
	}
	
}