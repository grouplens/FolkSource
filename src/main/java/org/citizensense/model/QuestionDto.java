package org.citizensense.model;

import java.sql.Time;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import org.grouplens.common.dto.Dto;
import org.grouplens.common.dto.Dto.Exclude;
import org.grouplens.common.dto.Dto.ExcludeType;
import org.citizensense.model.Question;

/**
 * The QuestionDto transfers data for all Question instances, and children of Question instances. 
 *
 *
 */
public class QuestionDto extends Dto{
	
	//Question class fields:
	public Integer id;
	public Integer task_id;
	public String question;
	public String type; 
	public Boolean required;
	public Boolean revisable; 
	public Integer time_limit;
	@Exclude(ExcludeType.EXPORT)
	public Answer answer;
	
	//TextQuestion class fields:
	public Integer word_limit;
	
	//MediaQuestion class fields:
	public String media_type;
	public Integer size_limit; 

	//MultipleChoiceQuestion class fields:
	public Integer max_choices;
	public String choices;
	
	//ComplexCounterQuestion class fields:
	public Integer max_value;
	
	//CompassQuestion class fields: N/A
	//StopwatchQuestion class fields: N/A
	//DateTimeQuestion class fields: N/A
	//AccelerometerQuestion class fields: N/A
	
	public QuestionDto(){
		super();
	}
	/**
	 * Constructs a a new QuestionDto from the given Question, setting all fields in the QuestionDto appropriately.
	 * @param questionIn
	 */
	public QuestionDto(Question questionIn) {
		super();
		this.id = questionIn.id;
		this.task_id = questionIn.task_id;
		this.question = questionIn.question;
		this.type = questionIn.type;
		this.required = questionIn.required;
		this.revisable = questionIn.revisable;
		this.time_limit = questionIn.time_limit;
		this.answer = questionIn.answer;

		String qType = questionIn.type;
		
		if (qType.equals("compass") || qType.equals("stopwatch") || qType.equals("dateTime") ||
				qType.equals("accelerometer")){} //No additional fields for these subclasses
		else if (qType.equals("text")){
			word_limit = ((TextQuestion)questionIn).word_limit;
		} else if (qType.equals("media")){
			media_type = ((MediaQuestion)questionIn).media_type;
			size_limit = ((MediaQuestion)questionIn).size_limit;
		} else if (qType.equals("multipleChoice")){
			max_choices =((MultipleChoiceQuestion)questionIn).max_choices;
			choices = ((MultipleChoiceQuestion)questionIn).choices;
		} else if (qType.equals("complexCounter")){
			max_value = ((ComplexCounterQuestion)questionIn).max_value;
		}
	}
		
		

	/**
	 * Returns a new Question object (or child class of Question object) based on the "type" of this QuestionDto.
	 * @return
	 */
	public Question toQuestion(){
		System.out.println("#######entering toquestion#####");
		if (type.equals("accelerometer")){
			return new AccelerometerQuestion(id, task_id, question, required, revisable, time_limit, answer);
		} else if (type.equals("compass")){
			return new CompassQuestion(id, task_id, question, required, revisable, time_limit, answer);
		} else if (type.equals("complexCounter")){
			return new ComplexCounterQuestion(id, task_id, question, required, revisable, time_limit, answer,
					max_value);
		} else if (type.equals("dateTime")){
			return new DateTimeQuestion(id, task_id, question, required, revisable, time_limit, answer);
		} else if (type.equals("media")){
			return new MediaQuestion(id, task_id, question, required, revisable, time_limit, answer,
					media_type, size_limit);
		} else if (type.equals("multipleChoice")){
			return new MultipleChoiceQuestion(id, task_id, question, required, revisable, time_limit, answer,
					max_choices, choices);
		} else if (type.equals("stopwatch")){
			return new StopwatchQuestion(id, task_id, question
					, required, revisable, time_limit, answer);
		} else if (type.equals("text")){
			return new TextQuestion(id, task_id, question, required, revisable, time_limit, answer,
					word_limit);
		} else if (type.equals("question")){ //non-specific Question classes should default to their type being "question"
			System.out.println("******************"); //syso ctrl-space 
			return new Question(id, task_id, question, "question", required, revisable, time_limit, answer);
		} else{
			//TODO throw exception
			System.out.println("######Throwing null#####");
			return null;
		}
	}

	
	//Only being used for "_QuestionController")
	public static List<QuestionDto> fromQuestionList(List<Question> questions){
		List<QuestionDto> questionDtos = new ArrayList<QuestionDto>();
		for (Question q : questions){
			questionDtos.add(new QuestionDto(q));
		}
		return questionDtos;
	}
}