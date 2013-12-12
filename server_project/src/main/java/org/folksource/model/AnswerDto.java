package org.folksource.model;

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
	
	//TimeSpanAnswer class fields:
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
		//this.answer_type = answerIn.answer_type;
		this.q_id = answerIn.q_id;
		this.sub_id = answerIn.sub_id;
		this.answer = answerIn.answer_type;
		
		if (answerIn instanceof TextAnswer){
			answer_type = "text";
			answer = ((TextAnswer)answerIn).answer;
		} else if (answerIn instanceof CompassAnswer){
			answer_type = "compass";
			heading = ((CompassAnswer)answerIn).heading;
		} else if (answerIn instanceof MediaVideoAnswer){
			answer_type = "media_video";
			path = ((MediaVideoAnswer)answerIn).path;
			mimeType = ((MediaVideoAnswer)answerIn).mimeType;
		} else if (answerIn instanceof MediaAudioAnswer){
			answer_type = "media_audio";
			path = ((MediaAudioAnswer)answerIn).path;
			mimeType = ((MediaAudioAnswer)answerIn).mimeType;
		} else if (answerIn instanceof MediaPhotoAnswer){
			answer_type = "media_photo";
			path = ((MediaPhotoAnswer)answerIn).path;
			mimeType = ((MediaPhotoAnswer)answerIn).mimeType;
		} else if(answerIn instanceof TimeSpanAnswer){
			answer_type = "time_span";
			milliseconds = ((TimeSpanAnswer)answerIn).milliseconds;
		} else if(answerIn instanceof AccelerometerAnswer){
			AccelerometerAnswer a = (AccelerometerAnswer) answerIn;
			answer_type = "accelerometer";
			x = a.x;
			y = a.y;
			z = a.z;
		} else if(answerIn instanceof MultipleChoiceAnswer){
			answer_type = "multiple_choice";
			choices = ((MultipleChoiceAnswer)answerIn).choices;
		} else if(answerIn instanceof ExclusiveMultipleChoiceAnswer){
			answer_type = "exclusive_multiple_choice";
			choices = ((ExclusiveMultipleChoiceAnswer)answerIn).choices;
		} else if(answerIn instanceof ComplexCounterAnswer){
			answer_type = "complex_counter";
			counts = ((ComplexCounterAnswer)answerIn).counts;
		} else if(answerIn instanceof DateTimeAnswer){
			answer_type = "cur_time";
			timestamp = ((DateTimeAnswer)answerIn).timestamp;
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
			return new CompassAnswer(id, answer_type, q_id, sub_id, heading);
		} else if (answer_type.equals("media_video")){
			return new MediaVideoAnswer(id, answer_type, q_id, sub_id, path, mimeType);
		} else if (answer_type.equals("media_audio")){
			return new MediaAudioAnswer(id, answer_type, q_id, sub_id, path, mimeType);
		} else if (answer_type.equals("media_photo")){
			return new MediaPhotoAnswer(id, answer_type, q_id, sub_id, path, mimeType);
		} else if (answer_type.equals("time_span")){
			return new TimeSpanAnswer(id, answer_type, q_id, sub_id, milliseconds);
		} else if (answer_type.equals("answer")){
			return new Answer(id, answer_type, q_id, sub_id);
		} else if (answer_type.equals("accelerometer")){
			return new AccelerometerAnswer(id, answer_type, q_id, sub_id, x, y, z);
		} else if (answer_type.equals("exclusive_multiple_choice")){
			return new ExclusiveMultipleChoiceAnswer(id, answer_type, q_id, sub_id, choices);
		} else if (answer_type.equals("multiple_choice")){
			return new MultipleChoiceAnswer(id, answer_type, q_id, sub_id, choices);
		} else if (answer_type.equals("complex_counter")){
			return new ComplexCounterAnswer(id, answer_type, q_id, sub_id, counts);
		} else if (answer_type.equals("cur_time")){
			return new DateTimeAnswer(id, answer_type, q_id, sub_id, timestamp);
		} else {
			//TODO: throw an exception
			return null;
		}
	}

	
}