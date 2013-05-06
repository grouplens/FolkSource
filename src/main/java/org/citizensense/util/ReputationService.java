package org.citizensense.util;

import java.util.ArrayList;
import java.util.List;
import org.citizensense.model.*;
import org.hibernate.Session;

public class ReputationService {

	
	// NOTES: EACH TIME A SUBMISSION IS MADE, WE NEED AN UPDATE IN STAT
	// ALSO, MAY WANT TO CHANGE STAT TO ONLY HAVE A 'INTEGER NEW_SUBS' AND
	// UPDATE WHEN THAT REACHES A VALUE
	// ALSO NOTE THAT WHEN THE SUBMISSIONS COMES IN (TO THE SERVER), WE 
	// NEED TO UPDATE AND THEN CALL UPDATEREPUTATION IF NEEDED.
	public static void updateReputation(Submission t) {
		List<Submission> submissions;
		Stats stat;
		Task task;
		Locations loc;
		
		// Get location and task ids
		Integer loc_id = t.getLoc_id();
		Integer task_id = t.getTask_id();
		
		// Get task and location
		task = TaskService.getTaskById(task_id);
		loc = LocationsService.getLocationById(loc_id);
		
		// Get submissions to process
		submissions = SubmissionService.getSubmissions(task_id, loc_id);

		// Get stat object for (task, location)
		stat = StatsService.getTaskStatByLocation(task, loc);
		
		
		
	}
	
	
	// Get array of users who submitted to (task,location)
	// Note that Users will be in the same order as submissions
	// I.e. Submission[i] made by users[i]
	private static User[] getUsersWhoSubmitted(List<Submission> submissions) {
		
		User[] users = new User[submissions.size()];
		
		int i = 0;
		
		for (Submission s : submissions) {
			users[i] = UserService.getUserById(s.getUser_id());
			i++;
		}
		
		return users;
	}
	
	// Get array of reputations
	// Order of reputations corresponds to order of users
	// i.e. reputations[i] is the reputation of users[i]
	private static Double[] getReputationArray(User[] users) {
		int len = users.length;
		
		Double[] reputations = new Double[len];
		for (int i = 0; i < len; i++) {
			reputations[i] = users[i].getReputation();
		}
		
		return reputations;		
	}
	
	private static Double getNormalizer(Double[] reps) {
		Double norm = 0.0;
		for(Double r : reps) {
			norm += r;
		}
		return norm;
	}
	
	// Get array of answers IN SAME ORDER AS SUBMISSIONS, USERS, REPUTATIONS;
	private static ArrayList<List<Answer>> getAnswers(List<Submission> submissions) {
		ArrayList<List<Answer>> answers = new ArrayList<List<Answer>>();
		
		for (Submission s : submissions) {
			List<Answer> answer = s.getAnswers();
			answers.add(answer);		
		}
		return answers;
	}
	
	/* AFTER COMPUTATION OF REPUTATION */
	// Update stats object and save to db
	private static void updateStat(Stats s, List<Answer> estimate, List<Submission> subs) {
		int num_submissions = subs.size();
		s.setEstimate(estimate);
		s.setNum_submissions(num_submissions);
		s.setNum_sbs_processed(num_submissions);
		// Set confidence once that is defined
		StatsService.save(s);	
	}
	
	private static void setToProcessed(List<Submission> submissions) {
		for (Submission s : submissions) {
			s.setProcessed(true);
			SubmissionService.save(s);
		}
	}
	
	private static void updateReputations(User[] users, Double[] newReps) {
		int len = users.length;
		
		for (int i = 0; i < len; i++) {
			users[i].setReputation(newReps[i]);
			UserService.save(users[i]);
		}
	}
	
}
