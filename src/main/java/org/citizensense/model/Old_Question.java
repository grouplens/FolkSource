 package org.citizensense.model;

import org.grouplens.common.dto.Dto;

public class Old_Question extends Dto implements Comparable<Old_Question> {
	public Integer id;

	public String question;
	public String type; //probably will not need once subclasses implemented
	public Boolean required;
	public String options;
	public Integer task_id;
	
	@Exclude(ExcludeType.EXPORT)
	public Answer answer;

	public String getbit() {
		return question;
	}

	public void setQuestion(String text) {
		this.question = text;
	}
	
	public String getQuestion() {
		return this.question;
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
	public int compareTo(Old_Question o) {
		if(this.getId() < o.getId())
			return -1;
		if(this.getId() > o.getId())
			return 1;
		
		return 0;
	}
	
}
