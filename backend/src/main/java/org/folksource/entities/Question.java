package org.folksource.entities;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name="questions", schema="public")
public class Question {
	
	@Id
	@Column(name = "id")
	public Integer id;
	
	@Column(name = "question")
	public String question;
	
	@Column(name = "type")
	public String type;
	
	@Column(name = "required")
	public Boolean required;
	
	@Column(name = "options")
	public String options;
	
	@Column(name = "task_id")
	public Integer task_id;
	
	public Question() {
		super();
	}
	
	public Question(Integer id, String question, String type, Boolean required, String options, Integer task_id) {
		super();
		this.id = id;
		this.question = question;
		this.type = type;
		this.required = required;
		this.options = options;
		this.task_id = task_id;
	}
	
//	@Exclude(ExcludeType.EXPORT)
//	public Answer answer;

	public String getQuestion() {
		return question;
	}

	public void setQuestion(String text) {
		this.question = text;
	}

//	public Answer getAnswer() {
//		return answer;
//	}
//
//	public void setAnswer(Answer answer) {
//		this.answer = answer;
//	}

	public String getType() {
		return type;
	}

	public void setType(String type) {
		this.type = type;
	}

	public Boolean isRequired() {
		return required;
	}

	public void setRequired(Boolean required) {
		this.required = required;
	}

	public String getOptions() {
		return options;
	}
	
	

	public void setOptions(String options) {
		this.options = options;
	}

	public Integer getTask_id() {
		return task_id;
	}

	public void setTask_id(Integer task_id) {
		this.task_id = task_id;
	}

	public Integer getId() {
		return id;
	}

	public void setId(Integer id) {
		this.id = id;
	}


//	@Override
//	public int compareTo(Question o) {
//		if(this.getId() < o.getId())
//			return -1;
//		if(this.getId() > o.getId())
//			return 1;
//		
//		return 0;
//	}
}
