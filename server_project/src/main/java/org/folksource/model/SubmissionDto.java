package org.folksource.model;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Date;
import java.util.List;

import org.grouplens.common.dto.Dto;

public class SubmissionDto extends Dto{

	public Integer id;
	public Integer task_id;
	public Integer user_id;
	
	public String gps_location;
	public AnswerDto[] answers;
	public Date timestamp;
	public String img_path;
	
	
	
	
	public SubmissionDto(){
		super();
	}
	/**
	 * Creates a new SubmissionDto object from the given Submission.
	 * @param s
	 */
	public SubmissionDto(Submission s){
		super();
		this.id = s.id;
		this.task_id = s.task_id;
		this.user_id = s.user_id;
		this.gps_location = s.gps_location;
		this.timestamp = s.timestamp;
		this.img_path = s.img_path;
		
		AnswerDto[] newAnswers = new AnswerDto[s.answers.length]; 
		for (int i=0; i < s.answers.length; i++){
			newAnswers[i] = new AnswerDto(s.answers[i]);
		}
		this.answers = newAnswers;
	}


	
	
	
	/**
	 * Returns a list of SubmissionDto objects given a list of Submission objects.
	 * @param submissions
	 * @return
	 */
	public static List<SubmissionDto> fromSubmissionList(List<Submission> submissions){
		List<SubmissionDto> submissionDtos = new ArrayList<SubmissionDto>();
		for (Submission s : submissions){
			submissionDtos.add(new SubmissionDto(s));
		}
		return submissionDtos;
	}
	public static SubmissionDto[] fromSubmissionArray(Submission[] subs){
		SubmissionDto[] subDtos = new SubmissionDto[subs.length];
		for (int i=0; i < subs.length; i++){
			subDtos[i] = new SubmissionDto(subs[i]);
		}
		return subDtos;
	}
	


	
	/**
	 * Returns a new Submission object from this SubmissionDto.
	 * @return
	 */
	public Submission toSubmission(){
		
		//Convert AnswerDtos to Answers
		Answer[] newAnswers = new Answer[answers.length];
		for (int i=0; i < answers.length; i++){
			newAnswers[i] = answers[i].toAnswer();
		}
		return new Submission(id, task_id, user_id, gps_location, newAnswers, timestamp, img_path);
	}
	
	// Is the name of this method clear? Should it even be here? I guess I put it here instead of in
	// the Submission class because I didn't want to clutter the Submission class with any transfer
	// logic.
	public static Submission[] toSubmissionArray(SubmissionDto[] subDtos){
		Submission[] subs = new Submission[subDtos.length];
		for (int i=0; i < subDtos.length; i++){
			subs[i] = subDtos[i].toSubmission();
		}
		return subs;
	}
	
	
	
	
	
	
	//TODO: Does this method ever get called?
	public void setAnswers(List<AnswerDto> answers){
		this.answers = (AnswerDto[]) answers.toArray();
	}
	
	
}
