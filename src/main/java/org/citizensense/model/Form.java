package org.citizensense.model;

import java.util.ArrayList;

public class Form {
private ArrayList<Old_Question> questions;

public ArrayList<Old_Question> getFields() {
	return questions;
}

public void setFields(ArrayList<Old_Question> fields) {
	this.questions = fields;
}
}
