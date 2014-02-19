package org.folksource.model;

public class TextAnswer extends Answer {

	public String answer;
	
	public TextAnswer(){
		super();
	}
	
	public TextAnswer(Integer id, String answer_type, Integer q_id, Integer sub_id, String answer) {
		super(id, answer_type, q_id, sub_id);
		this.answer = answer;
	}
	
	public void setAnswer(String ans){
		this.answer = ans;
	}
	
	public String getAnswer(){
		return answer;
	}
	
}
