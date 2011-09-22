package org.citizensense.model;

public class Question {
	private String text;
	private Answer answer;

	public String getText() {
		return text;
	}

	public void setText(String text) {
		this.text = text;
	}

	public Answer getAnswer() {
		return answer;
	}

	public void setAnswer(Answer answer) {
		this.answer = answer;
	}
	
}
