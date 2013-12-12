package org.folksource.model;

import org.grouplens.common.dto.Dto;

public class Question extends Dto implements Comparable<Question> {
	public Integer id;

	public String question;
	public String type;
	public Boolean required;
	public String options;
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
	
	@Exclude(ExcludeType.EXPORT)
	public Answer answer;

	public String getQuestion() {
		return question;
	}

	public void setQuestion(String text) {
		this.question = text;
	}

	public Answer getAnswer() {
		return answer;
	}

	public void setAnswer(Answer answer) {
		this.answer = answer;
	}

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


	@Override
	public int compareTo(Question o) {
		if(this.getId() < o.getId())
			return -1;
		if(this.getId() > o.getId())
			return 1;
		
		return 0;
	}
	
}
