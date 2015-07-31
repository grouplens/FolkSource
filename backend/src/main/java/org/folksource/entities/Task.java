package org.folksource.entities;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.Id;
import javax.persistence.OneToMany;
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
	
	@Column(name = "campaign_id")
	public Integer campaign_id;
	
	@OneToMany(mappedBy = "task_id", fetch=FetchType.EAGER)
	public List<Question> questions;

	public Boolean getRequired() {
		return required;
	}

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

	public List<Question> getQuestions() {
		return questions;
	}

	public void setQuestions(List<Question> questions) {
		this.questions = questions;
	}

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
