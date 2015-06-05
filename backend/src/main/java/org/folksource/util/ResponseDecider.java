package org.folksource.util;

import org.folksource.model.*;
import org.hibernate.Session;
import org.hibernate.criterion.Restrictions;

import java.util.Iterator;
import java.util.List;
import java.util.Set;

public class ResponseDecider {

    public static void newSubmission(Submission sub) {
        Session session = HibernateUtil.getSession(true);
        Task task = TaskService.getTaskById(sub.getTask_id());
        Location l = LocationService.getLocationById(sub.getLocation_id());
        List<Submission> locationSubmissions = l.getSubmissions();
        ResponseOutcome response = null;
        List<ResponseOutcome> outcomeList = session.createCriteria(ResponseOutcome.class).add(Restrictions.eq("location", l)).add(Restrictions.eq("task", task)).list();
        Integer numOutcomes = outcomeList.size();
        System.out.println("RESPONSEOUTCOME SIZES: " + numOutcomes);

        if (task.getType().equalsIgnoreCase("voting") && numOutcomes < 2) {
            String votingOutcome = tallyVote(locationSubmissions, task);
            response = generateNewOrUpdateVotingResponse(outcomeList, task, l, votingOutcome);
        } /* else if (task.getType().equalsIgnoreCase("validation")) {
            // here we can built the logic for "at least 2 people need to agree"
            //Boolean validationOutcome = isValidated(locationSubmissions, task);
            ResponseOutcome response = new ValidationResponseOutcome(l, validationOutcome, task);
        } else if (task.getType.equalsIgnoreCase("datapoint") {
            // here we can build the logic for "just submit data points"
            ResponseOutcome response = new DataResponseOutcome(locationSubmissions, task);
        }*/

        session.saveOrUpdate(response);
        LocationService.invalidateAllTiles(sub.getLocation_id());

        return;
    }

    /*
     * This returns null if no update needs to be made, in order to not save back to the DB
     */
    private static ResponseOutcome generateNewOrUpdateVotingResponse(List<ResponseOutcome> outcomeList, Task task, Location l, String votingOutcome) {
        ResponseOutcome response;
        if (outcomeList.size() != 1) {
            response = new ResponseOutcome(l, task, votingOutcome);
        } else {
            response = outcomeList.get(0);
            if (!response.getOutcome().equals(votingOutcome)) {
                response.setOutcome(votingOutcome);
            }
        }

        return response;
    }

    private static String tallyVote(List<Submission> locationSubmissions, Task task) {
        Question picked = getQuestionToVoteOn(task);
        /*
         * Either there's not enough submissions
         * or something is SERIOUSLY WRONG
         */
        if (locationSubmissions.size() < 3 || picked == null) {
            return "u";
        }

        String[] options = picked.getOptions().split("\\|");
        double[] counts = countVote(locationSubmissions, task, options);

        return makeVotingDecision(options.length, counts);
    }

    private static Question getQuestionToVoteOn(Task task) {
        Integer q_id = task.getDecision_q_id();
        Set<Question> qs = task.getQuestions();
        Iterator<Question> iter = qs.iterator();
        Question picked = null;
        while (iter.hasNext()) {
            Question q = iter.next();
            if (q.getId().equals(q_id)) {
                picked = q;
                break;
            }
        }
        return picked;
    }

    private static double[] countVote(List<Submission> locationSubmissions, Task task, String[] options) {
        double[] counts;
        counts = new double[options.length];
        // This is just a simple majority for now, no requirement for > 50% (unless there's 2 options)

        for (Submission submission : locationSubmissions) {
            Answer ans = submission.getAnswerAssociatedWithQuestion(task.getDecision_q_id());
            for (int i = 0; i < options.length; i++) {
                if (ans instanceof ExclusiveMultipleChoiceAnswer) {
                    ExclusiveMultipleChoiceAnswer curAns = (ExclusiveMultipleChoiceAnswer) ans;
                    if (curAns.getChoices().equals(options[i])) {
                        counts[i] += 1.0;
                    }
                } else if (ans instanceof MultipleChoiceAnswer) {
                    MultipleChoiceAnswer curAns = (MultipleChoiceAnswer) ans;
                    if (curAns.getChoices().equals(options[i])) {
                        counts[i] += 1.0;
                    }
                }
            }
        }
        return counts;
    }

    private static String makeVotingDecision(Integer numOptions, double[] counts) {
        double ratio;
        double threshold = 1.0 / numOptions;
        Double sum = 0.0;
        for (int i = 0; i < counts.length; i++) {
            sum += counts[i];
        }

        ratio = counts[0] / sum;
        /* There has to be a simple majority, otherwise "we can't decide" */

        //TODO Handle the cases where there's more than 2 options, this is hardcoded as "if the first option won"
        if (ratio > threshold) {
            return "y";
        } else if ((1 - ratio > threshold)) {
            return "n";
        } else {
            return "u";
        }
    }

}
