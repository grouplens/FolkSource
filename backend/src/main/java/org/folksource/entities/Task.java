package org.folksource.entities;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;

//import org.folksource.model.LocationLayer;
//import org.folksource.model.Question;
//import org.folksource.model.Submission;

@Entity
@Table(name="tasks", schema="public")
public class Task {
	
	@Id
	@Column(name = "id")
	public Integer id;
	
	//@Column(name = "name")
	//public String name;
	
	@Column(name = "instructions")
	public String instructions;
	
	@Column(name = "required")
	public Boolean required;
	
//	@Column(name = "camp_id")
//	public Integer campaign_id;
//	private String requirements; // possibly wrong datatype, but for now
//	private Form form;
//	private Location loc;
//    public Set<String> locations;
    //public Set<Submission> submissions;
    //public Set<Question> questions;
    //public Set<LocationLayer> locations;

    public Task(){
        super();
    }
    //used by the TaskDto
    public Task(Integer id, String name, String instructions, Boolean required/*, Set<Submission> subs, Set<Question> qs, Set<LocationLayer> locs*/){
        super();
        this.id = id;
        //this.name = name;
        this.instructions = instructions;
        this.required = required;
        //this.submissions = subs;
        //this.questions = qs;
        //this.locations = locs;
    }

//    public Integer getCampaign_id() {
//		return campaign_id;
//	}
//	public void setCampaign_id(Integer campaign_id) {
//		this.campaign_id = campaign_id;
//	}
	public Boolean getRequired() {
		return required;
	}
//	public void setLocations(Set<LocationLayer> locations) {
//		this.locations = locations;
//	}
//	public void setSubmissions(Set<Submission> submissions) {
//		this.submissions = submissions;
//	}
//	public void setQuestions(Set<Question> questions) {
//		this.questions = questions;
//	}
	
//	public String getName() {
//		return name;
//	}
//	public void setName(String name) {
//		this.name = name;
//	}
	public String getInstructions() {
		return instructions;
	}
	public void setInstructions(String instructions) {
		this.instructions = instructions;
	}
//	public Set<Submission> getSubmissions() {
//		if (submissions == null){
//			return null;
//		}
//		return submissions;
//	}
//
//	public void setSubmissions(List<Submission> subs) {
//		if(subs == null) 
//			this.submissions = new HashSet<Submission>();
//		else 
//			this.submissions = new HashSet<Submission>(subs);
//	}

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

//	public Set<Question> getQuestions() {
//		if (questions == null) return null;
//		return questions;
//	}
//
//	public void setQuestions(List<Question> questions) {
//		this.questions = new HashSet<Question>(questions);
//	}
//	
//	public Set<LocationLayer> getLocations() {
//		return locations;
//	}
//
//	public void setLocations(List<LocationLayer> locations) {
//		this.locations = new HashSet<LocationLayer>(locations);
//	}


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
