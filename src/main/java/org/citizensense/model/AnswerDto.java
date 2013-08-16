package org.citizensense.model;

import org.grouplens.common.dto.Dto;

/**
 * The AnswerDto transfers data for all Answer instances, and children of Answer instances. 
 *
 *
 */
public class AnswerDto extends Dto{
	
	//Answer class fields:
	public Integer id;
	public String answer_type;
	public Integer q_id;
	public Integer sub_id;
	
	//TextAnswer class fields:
	public String answer;
	
	//CompassAnswer class fields:
	public Integer heading;
	
	//PhotoAnswer class fields:
	public String path;
	
	public AnswerDto(){
		super();
	}
	
	/**
	 * Constructs a new AnswerDto from the given Answer, setting all fields in the AnswerDto appropriately.
	 * @param answerIn
	 */
	public AnswerDto(Answer answerIn) {
		super();
		this.id = answerIn.id;
		this.answer_type = answerIn.answer_type;
		this.q_id = answerIn.q_id;
		this.sub_id = answerIn.sub_id;
		
		if (answerIn.answer_type.equals("text")){
			answer = ((TextAnswer)answerIn).answer;
		} else if (answerIn.answer_type.equals("compass")){
			heading = ((CompassAnswer)answerIn).heading;
		} else if (answerIn.answer_type.equals("photo")){
			path = ((PhotoAnswer)answerIn).path;
		}
	}

	/**
	 * Returns a new Answer object (or child class of Answer object) based on the answer_type of this AnswerDto.
	 * @return
	 */
	public Answer toAnswer(){
		if (answer_type.equals("text")){
			return new TextAnswer(id, answer_type, q_id, sub_id, answer);
		} else if (answer_type.equals("compass")){
			System.out.println("[LOG] in toAnswer. Heading: "+ heading);
			return new CompassAnswer(id, answer_type, q_id, sub_id, heading);
		}else if (answer_type.equals("photo")){
			return new PhotoAnswer(id, answer_type, q_id, sub_id, path);
		}else if (answer_type.equals("answer")){
			return new Answer(id, answer_type, q_id, sub_id);
		} else {
			//TODO: throw an exception
			return null;
		}
	}
	
}