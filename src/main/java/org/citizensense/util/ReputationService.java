package org.citizensense.util;

import java.util.ArrayList;
import java.util.Collection;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.citizensense.model.Answer;
import org.citizensense.model.Locations;
import org.citizensense.model.Stats;
import org.citizensense.model.Submission;
import org.citizensense.model.Task;
import org.citizensense.model.User;

/**
 * A service to perform reputation related computations.
 * The single public method updates reputations following 
 * completion of a task at a given location as well as updates
 * stats
 * @author nick
 *
 */
public class ReputationService {
	
	/**
	 * Update reputation of all users that made a submission to a task
	 * Following completion of the task.  This can be extended to compute
	 * in a rolling fashion...This would require additional columns in the stats
	 * table to track partially computed values.
	 * 
	 * Right now, not doing anything with processed in submissions table.  This
	 * will likely be a necessary property to incorporate rolling updates rather than 
	 * just a final update.
	 * @param task-the completed task
	 * @param location-the location 
	 */
	public static void updateReputation(Task task, Locations location) {
		final List<Submission> submissions;
		Stats stat;
		
		final Map<User, Double> usersToReputation;
		final Map<Integer, List<Double>> usersToAnswers;
		
		final Integer taskId = task.getId();
		final Integer locId = location.getId();
		final Double normalizer;
		
		// Estimated correct answers will have no direct mapping to 
		// actual answers without significant rounding/processing
		final List<Double> estimatedAnswers;
		final List<Double> stdDeviations;
		final List<Pair<Double,Double>> minMaxAnswers;
		final List<Answer> finalEstimatedAnswers;
		
		final Map<User, Double> newReputations = new HashMap<User,Double>();
		/* DISK HITS BEGIN HERE */
		// Get submissions to process
		submissions = SubmissionService.getSubmissionsForTaskLoc(taskId, locId);
		
		usersToReputation = ReputationService.getUserToReputation(submissions);
		
		// Get answers converted to numeric format		
		usersToAnswers = ReputationService.convertAnswersToNumeric(ReputationService.getUserToAnswers(submissions));
		
		// Get stat object to update :: I'm assuming that this is created when the task/location
		// pair is set up...Otherwise, a new object should be created and saved.
		stat = StatsService.getTaskStatByLocation(taskId, locId);	
		/* DISK HITS END HERE */
		
		// Computed quantities
		normalizer = ReputationService.getNormalizer(usersToReputation);	
		estimatedAnswers = ReputationService.computeEstimatedValues(usersToReputation, usersToAnswers, normalizer);		
		stdDeviations = ReputationService.getReputationIncreaseDecreaseCutoff(estimatedAnswers, usersToReputation, usersToAnswers, normalizer);		
		minMaxAnswers = ReputationService.getMinMaxNumericAns(usersToAnswers, estimatedAnswers.size());
		
		// Update the reputations
		for (User u : usersToReputation.keySet()) {
			List<Double> answer = usersToAnswers.get(u.getId());			
			List<Double> updateVector = ReputationService.computeUserReputationUpdateVector(estimatedAnswers, answer, minMaxAnswers, stdDeviations);
			newReputations.put(u, ReputationService.getNewReputation(u.getReputation(), updateVector, null));		
		}
		
		// Convert Estimated Numeric answers back to Answers
		finalEstimatedAnswers = AnswerStructureService.convertToEstimateAnswer(estimatedAnswers);
		
		// Done computing....save the results
		ReputationService.updateReputations(newReputations);
		ReputationService.updateStat(stat, finalEstimatedAnswers, submissions.size());		
	}
	/*
	 * Convert a map, <user_id, List<Answer> to a map of <user_id, List<Double>>
	 * This hooks into AnswerStructure service, which should implement the logic of
	 * conversion of answer type to double value, dropping answers not required for
	 * reputation computation, etc.
	 * @param answers
	 * @return
	 */
	private static Map<Integer, List<Double>> convertAnswersToNumeric(Map<Integer, List<Answer>> answers) {
		final Map<Integer,List<Double>> convertedAnswers;
		convertedAnswers = AnswerStructureService.convertAnswersToNumeric(answers);
		return convertedAnswers;
	}
	
	/*
	 * Compute the estimated vector of numerically valued answers
	 */
	private static List<Double> computeEstimatedValues(Map<User, Double> userToReps, Map<Integer,List<Double>> userToAns, Double normalizer) {
		final List<Double> runningEstimate = new ArrayList<Double>();
		final List<Double> finalEstimate;
		
		assert (userToReps.keySet().size() == userToAns.keySet().size());
		int len = userToReps.keySet().size();
		
		for (User user : userToReps.keySet()) {
			Double weight = userToReps.get(user) / normalizer;
			List<Double> scaledAnswers = scalarListMult(userToAns.get(user.getId()), weight);
			addIntoList(runningEstimate, scaledAnswers);	
		}
		finalEstimate = scalarListMult(runningEstimate, (1.0 / len));
		return finalEstimate;
	}
	
	/*
	 * Get the std deviation for each vector element in the answers
	 */
	private static List<Double> getReputationIncreaseDecreaseCutoff(List<Double> weightedMean, 
						Map<User,Double> userToReps, 
						Map<Integer,List<Double>> userToAns, 
						Double normalizer) {
		// For now at least...return a single standard deviation for each vector component
		// Separate method for this forces more computation but decouples from weighted mean
		// Computation for easier modification
		final List<Double> stdDev = new ArrayList<Double>();
		final List<Double> runningEstimate = new ArrayList<Double>();
		final List<Double> expectedSquared;
		final List<Double> meanSquared;
		
		// compute E(X^2)
		assert (userToReps.keySet().size() == userToAns.keySet().size());
		int len = userToReps.keySet().size();
		
		for (User user : userToReps.keySet()) {
			Double weight = userToReps.get(user) / normalizer;
			List<Double> scaledAnswers = scalarListMult(userToAns.get(user.getId()), weight);
			List<Double> squared = squareListValues(scaledAnswers);
			addIntoList(runningEstimate, squared);	
		}
		expectedSquared = scalarListMult(runningEstimate, (1.0 / len));
		meanSquared = squareListValues(weightedMean);
		// Compute stdDev
		int index = 0;
		for (Double val: expectedSquared) {
			stdDev.add(Math.sqrt(val - meanSquared.get(index)));
		}
		return stdDev;
	}
	
	/*
	 * Get map of users to reputations
	 * @param submissions
	 * @return
	 */
	private static Map<User, Double> getUserToReputation(List<Submission> submissions) {
		final Map<User,Double> usersToRep = new HashMap<User, Double>();
		
		for (Submission s : submissions) {
			User user = UserService.getUserById(s.getUser_id());
			Double reputation = user.getReputation();
			usersToRep.put(user, reputation);
		}
		return usersToRep;
	}
	
	/*
	 * Get a normalizing constant for weighted mean
	 * @param reps 
	 * @return 
	 */
	// This should take user to rep map
	private static Double getNormalizer(Map<User,Double> map) {
		Double norm = 0.0;
		for(Double r : map.values()) {
			norm += r;
		}	
		assert(!norm.equals(0));
		return norm;
	}
	
	/*
	 * Get map of answers indexed by user id;
	 * @param submissions - the list of submissions
	 * @return - the list (ArrayList) of answers
	 */
	private static Map<Integer,List<Answer>> getUserToAnswers(List<Submission> submissions) {
		Map<Integer, List<Answer>> answers = new HashMap<Integer, List<Answer>>();
		for (Submission s : submissions) {
			List<Answer> answer = s.getAnswers();
			answers.put(s.getUser_id(), answer);	
		}		
		assert(answers.size() == submissions.size());
		return answers;
	}
	
	/*
	 * Update Stats object by adding new estimate for 'correct' answers
	 * and increasing the number of submissions processed field
	 * @param s - the Stats object to update
	 * @param estimate - the new estimated answer
	 * @param subs-the list of all processed submissions
	 */
	private static void updateStat(Stats s, List<Answer> estimate, int numSubmissions) {
		s.setEstimate(estimate);
		//num_submissions should only be updated by incoming submissions
		s.setNum_sbs_processed(numSubmissions);
		// Set confidence once that is defined
		StatsService.update(s);	
	}
	
	/*
	 * Update reputations of a list of users
	 * Order of users and reputations in argument lists must be the same
	 * i.e. user[i] gets newRep[i]
	 * @param users - array of users
	 * @param newReps - array of reputations
	 */
	// make this a map of users to reps
	private static void updateReputations(Map<User, Double> newUserToRep) {
		for (User u : newUserToRep.keySet()) {
			u.setReputation(newUserToRep.get(u));
			UserService.update(u);
		}
	}
	
	/*
	 * This is a really inefficient way of computing this...fortunately, we just need to compute it 
	 * once.  Minor modifications to the algorithm could make this unnecessary but require assumptions
	 * I'm not currently willing to make.
	 */
	private static List<Pair<Double,Double>> getMinMaxNumericAns(Map<Integer,List<Double>> idToAnsNumeric, int len) {
		List<Pair<Double, Double>> minMax = new ArrayList<Pair<Double, Double>>();
		Collection<List<Double>> vals = idToAnsNumeric.values();
		// Set initial values
		for (int i = 0; i < len ; i++) {
			minMax.add(new Pair<Double,Double>(Double.POSITIVE_INFINITY, Double.NEGATIVE_INFINITY));
			
		}
		
		int numAnswers = idToAnsNumeric.size();
		
		for (int i = 0; i < len; i++) {
			Pair<Double,Double> mm = minMax.get(i);
			for (List<Double> ans : vals) {
				mm.setZero(Math.min(mm.getZero(), ans.get(i)));
				mm.setOne(Math.max(mm.getOne(), ans.get(i)));
			}
		}
		return minMax;
	}
	
	/*
	 * Get the update percentages along each vector component
	 */
	private static List<Double> computeUserReputationUpdateVector(List<Double> estimated, 
			List<Double> answers, 
			List<Pair<Double, Double>> minMax, 
			List<Double> stdDev) {
		final List<Double> repUpdateVector = new ArrayList<Double>();

		int numAnswers = answers.size();

		for (int i = 0; i < numAnswers; i++) {
			Double estimate = estimated.get(i);
			Double actual = answers.get(i);
			Double dev = stdDev.get(i);
			Double maxDiff = Math.max(Math.abs(minMax.get(i).getZero()), Math.abs(minMax.get(i).getOne()));
			Double maxFromStdDev = Math.abs(maxDiff - dev);
			Double actDiffFromEst = Math.abs(estimate - actual);

			if (maxFromStdDev.equals(0)) {
				repUpdateVector.add(.5);
			} else {

				Double actualDiffFromEst = Math.abs(estimate - actual);
				Double updatePercent = -.5 / maxFromStdDev * (actDiffFromEst - dev);
			}
		}
		return repUpdateVector;
	}
	
	/*
	 * For now, we just call this with answerWeights as null in the public method. This
	 * should be changed.
	 * To implement weighting (certain answers more important than others), pass in a
	 * predefined weight vector and weight/normalize with that.
	 */
	private static Double getNewReputation(Double currentRep, List<Double> updateVector, List<Double> answerWeights) {
		// Compute reputation update
		// This is the average of the computed update for each vector component
		Double sum = 0.0;
		int numAns = updateVector.size();
		
		if (answerWeights == null) {
			answerWeights = new ArrayList<Double>();
			for (int i = 0; i < numAns; i++) {
				answerWeights.add(1.0);
			}
		}
		
		Double normalizer = 0.0;
		for (int i = 0; i < numAns; i++) {
			normalizer += answerWeights.get(i);
		}
				
		for (int i = 0; i < numAns; i++) {
			sum += updateVector.get(i) * answerWeights.get(i) / normalizer;
		}
		return (numAns == 0) ? currentRep : sum * currentRep / numAns + currentRep;
	}
	
	/* Vector Arithmetic Helper Methods */
	private static List<Double> squareRootListValues(List<Double> list) {
		final List<Double> roots = new ArrayList<Double>();
		for (Double val : list) {
			roots.add(Math.sqrt(val));
		}
		return roots;
	}
	
	private static List<Double> squareListValues(List<Double> list) {
		final List<Double> squared = new ArrayList<Double>();
		for (Double d : list) {
			squared.add(Math.pow(d, 2));
		}
		return squared;
	}
	
	private static List<Double> scalarListMult(List<Double> list, Double scalar) {
		final List<Double> newList = new ArrayList<Double>();
		for (Double val : list) { 
			newList.add(val * scalar);
		}
		return newList;
	}
	
	private static void addIntoList(List<Double> list1, List<Double> list2) {
		int index = 0;
		
		for (Double val : list1) {
			val = val + list2.get(index);
			index++;
		}
	}
	
	
	/* CURRENTLY UNUSED METHODS */
	
	/*
	 * Mark submissions as processed
	 * This is not currently necessary...but likely will become so.
	 * @param submissions - submissions to update
	 */
	private static void setToProcessed(List<Submission> submissions) {
		for (Submission s : submissions) {
			s.setProcessed(true);
			SubmissionService.update(s);
		}
	}
}


/**
 * Simple implementation of a Pair<T,R> class with 
 * getters and setters
 * @author nick
 *
 * @param <T>
 * @param <R>
 */
class Pair<T, R> {
	private T val0;
	private R val1;
	
	public Pair(T val0, R val1) {
		this.val0 = val0;
		this.val1 = val1;
	}
	
	public T getZero() {
		return this.val0;
	}
	
	public R getOne() {
		return this.val1;
	}
	
	public void setZero(T val) {
		this.val0 = val;
	}
	
	public void setOne(R val) {
		this.val1 = val;
	}
}
