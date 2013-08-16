package org.citizensense.model;

import java.util.ArrayList;
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
	
	public SubmissionDto(){
		super();
		System.out.println("[LOG] A submissionDto has been initialized!");
	}
	
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
	
	public Submission toSubmission(){
		
		//Convert AnswerDtos to Answers
		System.out.println("[ME] In toSubmission - length of answers is "+answers.length);
		Answer[] newAnswers = new Answer[answers.length];
		for (int i=0; i < answers.length; i++){
			newAnswers[i] = answers[i].toAnswer();
		}
		return new Submission(id, task_id, user_id, gps_location, newAnswers, timestamp, img_path);
	}
	
	public void setAnswers(List<AnswerDto> answers){
		System.out.println("[MEEE] calling setAnswers");
		this.answers = (AnswerDto[]) answers.toArray();
	}
	
	
}
