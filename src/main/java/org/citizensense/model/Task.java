package org.citizensense.model;

import java.util.Arrays;
import java.util.List;

import org.grouplens.common.dto.Dto;

public class Task extends Dto{
	public Integer id;
	public String name;
	public String instructions;
	public Boolean required;
//	private String requirements; // possibly wrong datatype, but for now
//	private Form form;
//	private Location loc;

	public Submission[] submissions;
	public Question[] questions;
	public Location[] locations;
	
	//	public Location getLocation() {
//		return loc;
//	}
//
//	public void setLocation(Location loc) {
//		this.loc = loc;
//	}
	
	public Location[] getLocations() {
		return locations;
	}
	
	public void setLocations(Location[] locations) {
		this.locations = locations;
	}

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
		return Arrays.asList(submissions);
	}

	public void setSubmissions(List<Submission> submissions) {
		this.submissions = submissions.toArray(new Submission[submissions.size()]);
	}

	public Integer getId() {
		return id;
	}

	public void setId(Integer id) {
		this.id = id;
	}

	public Boolean isRequired() {
		return required;
	}

	public void setRequired(Boolean required) {
		this.required = required;
	}

	public List<Question> getQuestions() {
		return Arrays.asList(questions);
	}

	public void setQuestions(List<Question> questions) {
		this.questions = questions.toArray(new Question[questions.size()]);
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
