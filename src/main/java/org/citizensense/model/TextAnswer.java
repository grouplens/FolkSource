package org.citizensense.model;

public class TextAnswer extends Answer {

	public String answer;
	
	public TextAnswer(){
		super();
	}
	
	public TextAnswer(Integer id, Integer q_id, Integer sub_id, String answer) {
		super(id, "text", q_id, sub_id);
		this.answer = answer;
	}
	
	public void setAnswer(String ans){
		this.answer = ans;
	}
	
	public String getAnswer(){
		return answer;
	}
	
}
