package org.citizensense.util;

import java.util.List;
import java.util.Map;

import org.citizensense.model.Answer;
import org.citizensense.model.Locations;
import org.citizensense.model.Task;

/**
 * A class to encode the structure of a set of Answers/Attributes
 * @author nick
 *
 */
public class AnswerStructureService {

	/**
	 * This should use whatever logic is defined to convert answers for a given task to
	 * to numeric values.  All values returned in the lists will be used to compute repution.
	 * @param answerMap
	 * @return
	 */
	public static Map<Integer, List<Double>> convertAnswersToNumeric(Map<Integer, List<Answer>> answerMap) {
		return null;
	}
	
	private static List<Double> convertListOfAnswers(List<Answer> answers) {
		return null;
	}
	
	/**
	 * Convert numeric list of answers to estimated answers 
	 * (i.e. convert back to 'best guess' Answer objects)
	 */
	public static List<Answer> convertToEstimateAnswer(List<Double> numericAnswers) {
		return null;
	}
	/**
	 * Get the weights of the answers.  Implement this to apply a weighting scheme
	 * to answers.
	 */
	public static List<Double> getAnswerWeightsList(Object... parameters) {
		return null;
	}
	
}
