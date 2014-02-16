package org.citizensense.model;

import org.grouplens.common.dto.Dto;

public class Question extends Dto implements Comparable<Question> {
	public Integer id;
	public Integer task_id;
	
	public String question; //The "text" of the question; the "request" or "instructions".
	public String type; //Will still require subclasses have "type" string for identification purposes
	public Boolean required;
	public Boolean revisable; //Whether the question will accept "edits" after the first submission, whatever that may be
	public Integer time_limit; //If set to 0 , will not be implemented. If not, time limit is set (in seconds?) and Q becomes unavailable after.
	
//	public String options;
	
	@Exclude(ExcludeType.EXPORT)
	public Answer answer;
	
	public Question(){
		super();
		type = "question"; //default type is "question"
	}

	public Question(Integer id, Integer task_id, String question, String type, Boolean required, Boolean revisable,
			Integer time_limit, Answer answer){
		super();
		this.id = id; this.task_id = task_id; this.question = question; this.type = type; this.required = required;
		this.revisable = revisable; this.time_limit = time_limit; this.answer = answer;
	} 
	
	
	
	public Integer getId() {
		return id;
	}

	public void setId(Integer id) {
		this.id = id;
	}

	public Integer getTask_id() {
		return task_id;
	}

	public void setTask_id(Integer task_id) {
		this.task_id = task_id;
	}
	
	public String getQuestion(){
		return this.question;
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

	public Boolean isRevisable(){
		return revisable;
	}
	
	public void setRevisable(Boolean revisable){
		this.revisable = revisable;
	}
	
	public Integer getTime_limit(){
		return time_limit;
	}
	
	public void setTime_limit(Integer time_limit){
		this.time_limit = time_limit;
	}




	@Override
	public int compareTo(Question o) {
		if(this.getId() < o.getId())
			return -1;
		if(this.getId() > o.getId())
			return 1;
		
		return 0;
	}
	
//	public String getOptions() {
//	return options;
//}
//
//public void setOptions(String options) {
//	this.options = options;
//}
	
}
