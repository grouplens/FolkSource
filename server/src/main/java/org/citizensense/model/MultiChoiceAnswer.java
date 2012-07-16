package org.citizensense.model;

import java.util.ArrayList;

public class MultiChoiceAnswer implements Answer {
	private String type = "multiple_choice";
	private ArrayList<String> choices = new ArrayList<String>();
	private String response;
	@Override
	public String getType() {
		// TODO Auto-generated method stub
		return this.type;
	}

	@Override
	public void setType(String type) {
		this.type = type;

	}

	@Override
	public String getResponse() {
		return this.response;
	}

	@Override
	public void setResponse(String res) {
		this.response = res;

	}

	public ArrayList<String> getChoices() {
		return this.choices;
	}

	public void setChoices(ArrayList<String> choices) {
		this.choices = choices;
	}

}
