package org.folksource.model;

import java.util.ArrayList;
import java.util.List;

import org.grouplens.common.dto.Dto;

public class QuestionDto extends Dto{
	
	public Integer id;
	public String question;
	public String type;
	public Boolean required;
	public String options;
	public Integer task_id;

	
	
	//// Methods that create TaskDtos or collections of TaskDtos
	public QuestionDto(){
		super();
	}
	public QuestionDto(Question q){
		super();
		id = q.id;
		question = q.question;
		type = q.type;
		required = q.required;
		options = q.options;
		task_id = q.task_id;
	}
	public static List<QuestionDto> fromList(List<Question> questions){
		List<QuestionDto> tdtos = new ArrayList<QuestionDto>();
		for (Question q : questions){
			tdtos.add(new QuestionDto(q));
		}
		return tdtos;
	}
	//TODO: the naming of this method and the previous are inconsistent
	public static QuestionDto[] fromQuestionArray(Question[] questions){
		QuestionDto[] qdtos = new QuestionDto[questions.length];
		for (int i = 0; i < questions.length; i++) {
			qdtos[i] = new QuestionDto(questions[i]);
		}
		return qdtos;
	}
	
	
	//// Methods that create Tasks or collections of Tasks
	public Question toQuestion(){
		return new Question(id, question, type, required, options, task_id);
	}
	public static Question[] toQuestionArray(QuestionDto[] tdtos){
		Question[] questions = new Question[tdtos.length];
		for (int i = 0; i < questions.length; i++) {
			questions[i] = tdtos[i].toQuestion();
		}
		return questions;
	}
}
