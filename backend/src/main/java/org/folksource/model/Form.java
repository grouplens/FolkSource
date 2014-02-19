package org.folksource.model;

import java.util.ArrayList;

public class Form {
private ArrayList<Question> questions;

public ArrayList<Question> getFields() {
	return questions;
}

public void setFields(ArrayList<Question> fields) {
	this.questions = fields;
}
}
