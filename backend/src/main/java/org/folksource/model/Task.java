package org.folksource.model;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

public class Task {
	public Integer id;
	public String name;
	public String instructions;
	public Boolean required;
	public Integer campaign_id;
// private String requirements; // possibly wrong datatype, but for now
// private Form form;
// private Location loc;
// public Set<String> locations;
	public Set<Submission> submissions;
	public Set<Question> questions;
	public Set<LocationLayer> locations;
	public String type;
	private Integer decision_q_id;

	public Task(){
		super();
	}
	//used by the TaskDto
	public Task(Integer id, String name, String instructions, Boolean required, Set<Submission> subs, Set<Question> qs, Set<LocationLayer> locs, String type, Integer vQID){
		super();
		this.id = id;
		this.name = name;
		this.instructions = instructions;
		this.required = required;
		//this.submissions = subs;
		this.questions = qs;
		this.locations = locs;
		this.type = type;
		this.decision_q_id = vQID;
	}

	public Integer getCampaign_id() {
		return campaign_id;
	}
	public void setCampaign_id(Integer campaign_id) {
		this.campaign_id = campaign_id;
	}
	public Boolean getRequired() {
		return required;
	}
	public void setLocations(Set<LocationLayer> locations) {
		this.locations = locations;
	}
	public void setSubmissions(Set<Submission> submissions) {
		this.submissions = submissions;
	}
	public void setQuestions(Set<Question> questions) {
		this.questions = questions;
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
		this.questions = new HashSet<Question>(questions);
	}

	public Set<LocationLayer> getLocations() {
		return locations;
	}

	public void setLocations(List<LocationLayer> locations) {
		this.locations = new HashSet<LocationLayer>(locations);
	}

	public String getType() {
		return type;
	}

	public void setType(String type) {
		this.type = type;
	}

	public Integer getDecision_q_id() {
		return decision_q_id;
	}

	public void setDecision_q_id(Integer decision_q_id) {
		this.decision_q_id = decision_q_id;
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
