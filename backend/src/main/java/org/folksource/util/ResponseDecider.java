package org.folksource.util;

import org.folksource.model.*;
import org.hibernate.Session;
import org.hibernate.criterion.Restrictions;

import java.util.Date;
import java.util.List;

public class ResponseDecider {

    public static void newSubmission(Submission sub) {
        Task task = TaskService.getTaskById(sub.getTask_id());
        Location l = LocationService.getLocationById(sub.getLocation_id());
        List<Submission> locationSubmissions = l.getSubmissions();
        if(task instanceof VotingTask) {
            String votingOutcome = tallyVote(locationSubmissions, task);
            ResponseOutcome response = new VotingResponseOutcome(l, task, votingOutcome);
            save(response);
        } /* else if (task instanceof ValidationTask) {
            // here we can built the logic for "at least 2 people need to agree"
            //Boolean validationOutcome = isValidated(locationSubmissions, task);
            ResponseOutcome response = new ValidationResponseOutcome(l, validationOutcome, task);
        } else if (task instanceof DataPointTask) {
            // here we can build the logic for "just submit data points"
            ResponseOutcome response = new DataResponseOutcome(locationSubmissions, task);
        }*/ else {
            // do nothing
            return;
        }
    }

    private static String tallyVote(List<Submission> locationSubmissions, Task task) {
        Integer voting_qid = task.getVotingQuestionID();
        Double ratio = 0.0;
        Integer denominator = 1;
        Double threshold = 1.0;
        String[] options = new String[0];
        Integer[] counts = new Integer[0];

        /* have to be at least 3 submissions, otherwise we can't decide */
        if(locationSubmissions.size() < 3) {
            return "u";
        }

        for(Submission submission : locationSubmissions) {
            for(Answer ans : submission.getAnswers()) {
                if(ans.getId().equals(voting_qid)) {
                    if(ans instanceof MultipleChoiceAnswer) {
                        MultipleChoiceAnswer curAns = (MultipleChoiceAnswer)ans;
                        if (options.length == 0) {
                            options = curAns.getQuestion().getOptions().split("|");
                            counts = new Integer[options.length];
                        /* This could extensible to simple majority, not just 50%
                         * denominator = options.length;
                         */
                            denominator = 2;
                            threshold = 1.0 / denominator;
                        }
                        for (int i = 0; i < options.length; i++) {
                            if (curAns.get)
                        }
                        //figure out the voting process here
                    }
                } else {
                    continue;
                }
            }
        }

        /* There has to be a simple majority, otherwise "we can't decide" */

        if(ratio > threshold) {
            return "y";
        } else if ((1 - ratio > threshold)) {
            return "n";
        } else {
            return "u";
        }
    }


    public static void save(ResponseOutcome response) {
        Session session = HibernateUtil.getSession(true);
        session.save(response);
    }

    // This should only apply for the current gun-law campaign. Any of those others don't deserve it
        if(s.getTask_id() == 59) {
            List<Submission> submissions = l.getSubmissions();
            boolean agreed = false;
            if (submissions.size() > 1) {
                String firstAnswer = "";
                for (int i = 0; i < submissions.size(); i++) {
                    List<Answer> answers = submissions.get(i).getAnswers();
                    for (int j = 0; j < answers.size(); j++) {
                        Answer a = answers.get(j);
                        if (a instanceof MultipleChoiceAnswer) {
                            if (i == 0) {
                                firstAnswer = ((MultipleChoiceAnswer) answers.get(j)).getChoices();
                            } else
								agreed = !firstAnswer.equalsIgnoreCase(((MultipleChoiceAnswer) answers.get(j)).getChoices());
                        }
                    }
                }
            }
            if (agreed) {
                l.setAllowed("y");
                LocationService.save(l);
            }
        }


		@SuppressWarnings("unchecked")
		List<User> users = session.createQuery("from User where id=" + s.getUser_id()).list();
		users.get(0).setPoints(users.get(0).getPoints() + 1);
		return true;
	}

	public static User getSubUser(Submission submission) {
		Session session = HibernateUtil.getSession(false);
		//System.out.println("CITIZENSENSE - " + submission.getUser_id());
		@SuppressWarnings("unchecked")
		List<User> users = session.createQuery("from User where id=" + submission.getUser_id()).list();
		return users.get(0);
	}


}
