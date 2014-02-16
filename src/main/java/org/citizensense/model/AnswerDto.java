package org.citizensense.model;

import java.sql.Time;
import java.util.Date;

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
	public Float heading;
	
	//Stopwatch class fields:
	public Integer milliseconds;
	
	//DateTimeAnswer class fields:
	public String timestamp;
	
	//MediaAnswer class fields:
	public String path;
	public String mimeType;
	
	//AccelerometerAnswer class fields:
	public Float x;
	public Float y;
	public Float z;
	
	//MultipleChoiceAnswer class fields:
	public String choices;
	
	//ComplexCounterAnswer class fields:
	public String counts;
	
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
		} else if (answerIn.answer_type.equals("media")){
			path = ((MediaAnswer)answerIn).path;
			mimeType = ((MediaAnswer)answerIn).mimeType;
		} else if(answerIn.answer_type.equals("stopwatch")){
			milliseconds = ((StopwatchAnswer)answerIn).milliseconds;
		} else if(answerIn.answer_type.equals("accelerometer")){
			AccelerometerAnswer a = (AccelerometerAnswer) answerIn;
			x = a.x;
			y = a.y;
			z = a.z;
		} else if(answerIn.answer_type.equals("multipleChoice")){
			choices = ((MultipleChoiceAnswer)answerIn).choices;
		} else if(answerIn.answer_type.equals("complexCounter")){
			counts = ((ComplexCounterAnswer)answerIn).counts;
		} else if(answerIn.answer_type.equals("dateTime")){
			timestamp = ((DateTimeAnswer)answerIn).timestamp;
		}
	}

	/**
	 * Returns a new Answer object (or child class of Answer object) based on the answer_type of this AnswerDto.
	 * @return
	 */
	public Answer toAnswer(){
		if (answer_type.equals("text")){
			return new TextAnswer(id, q_id, sub_id, answer);
		} else if (answer_type.equals("compass")){
			return new CompassAnswer(id, q_id, sub_id, heading);
		}else if (answer_type.equals("media")){
			return new MediaAnswer(id, q_id, sub_id, path, mimeType);
		}else if (answer_type.equals("stopwatch")){
			return new StopwatchAnswer(id, q_id, sub_id, milliseconds);
		}else if (answer_type.equals("answer")){
			return new Answer(id, answer_type, q_id, sub_id);
		}else if (answer_type.equals("accelerometer")){
			return new AccelerometerAnswer(id, q_id, sub_id, x, y, z);
		} else if (answer_type.equals("multipleChoice")){
			return new MultipleChoiceAnswer(id, q_id, sub_id, choices);
		} else if (answer_type.equals("complexCounter")){
			return new ComplexCounterAnswer(id, q_id, sub_id, counts);
		} else if (answer_type.equals("dateTime")){
			return new DateTimeAnswer(id, q_id, sub_id, timestamp);
		} else {
			//TODO: throw an exception
			return null;
		}
	}

	
}