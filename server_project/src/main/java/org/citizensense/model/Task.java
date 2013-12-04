package org.citizensense.model;

import java.util.Arrays;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import org.grouplens.common.dto.Dto;

public class Task{
	public Integer id;
	public String name;
	public String instructions;
	public Boolean required;
	public Integer camp_id;
//	private String requirements; // possibly wrong datatype, but for now
//	private Form form;
//	private Location loc;

	public Integer getCamp_id() {
		return camp_id;
	}
	public void setCamp_id(Integer camp_id) {
		this.camp_id = camp_id;
	}
	public Boolean getRequired() {
		return required;
	}
	public void setLocations(Set<Location> locations) {
		this.locations = locations;
	}
	public void setSubmissions(Set<Submission> submissions) {
		this.submissions = submissions;
	}
	public void setQuestions(Set<Question> questions) {
		this.questions = questions;
	}

	public Set<Location> locations;
	public Set<Submission> submissions;
	public Set<Question> questions;	
	
	public Task(){
		super();
	}
	//used by the TaskDto
	public Task(Integer id, String name, String instructions, Boolean required, Set<Submission> subs, Set<Question> qs, Set<Location> locs){
		super();
		this.id = id;
		this.name = name;
		this.instructions = instructions;
		this.required = required;
		//this.submissions = subs;
		this.questions = qs;
		this.locations = locs;
	}
	
	
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
	public Set<Submission> getSubmissions() {
		if (submissions == null){
			return null;
		}
		return submissions;
	}

	public void setSubmissions(List<Submission> subs) {
		if(subs == null) 
			this.submissions = new HashSet<Submission>();
		else 
			this.submissions = new HashSet<Submission>(subs);
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

	public Set<Question> getQuestions() {
		if (questions == null) return null;
		return questions;
	}

	public void setQuestions(List<Question> questions) {
		this.questions = new HashSet(questions);
	}
	
	public Set<Location> getLocations() {
		return locations;
	}

	public void setLocations(List<Location> locations) {
		this.locations = new HashSet(locations);
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
