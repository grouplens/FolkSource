package org.citizensense.model;

import java.util.List;

public class Task {
	private int id;
	private String name;
	private String instructions;
	private boolean required;
//	private String requirements; // possibly wrong datatype, but for now
//	private Form form;
//	private Location loc;

	private List<Submission> submissions;
	private List<Question> questions;
	
	//	public Location getLocation() {
//		return loc;
//	}
//
//	public void setLocation(Location loc) {
//		this.loc = loc;
//	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getInstructions() {
		return instructions;
	}

	public void setInstructions(String instructions) {
		this.instructions = instructions;
	}

	public List<Submission> getSubmissions() {
		return submissions;
	}

	public void setSubmissions(List<Submission> submissions) {
		this.submissions = submissions;
	}

	public int getId() {
		return id;
	}

	public void setId(int id) {
		this.id = id;
	}

	public boolean isRequired() {
		return required;
	}

	public void setRequired(boolean required) {
		this.required = required;
	}

	public List<Question> getQuestions() {
		return questions;
	}

	public void setQuestions(List<Question> questions) {
		this.questions = questions;
	}

//	public String getRequirements() {
//		return requirements;
//	}
//
//	public void setRequirements(String requirements) {
//		this.requirements = requirements;
//	}
//
//	public Form getForm() {
//		return form;
//	}
//
//	public void setForm(Form form) {
//		this.form = form;
//	}
}
