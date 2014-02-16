package org.citizensense.model;

public class TextQuestion extends Question{

	public Integer word_limit;//if 0, no word limit
	
	public TextQuestion(){
		super();
		this.type = "text";
		this.word_limit = 0;
	}
	public TextQuestion(Integer id, Integer task_id, String question, Boolean required, Boolean revisable,
			Integer time_limit, Answer answer, Integer word_limit) {
		super(id, task_id, question, "text", required, revisable, time_limit, answer);
		this.word_limit = word_limit;
	} 
	
	public Integer getWord_limit(){
		return word_limit;
	}
	
	public void setWord_limit(Integer word_limit){
		this.word_limit = word_limit;
	}
}