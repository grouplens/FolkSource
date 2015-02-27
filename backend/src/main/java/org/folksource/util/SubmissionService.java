package org.folksource.util;

import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.Arrays;
import java.util.Date;
import java.util.List;

import org.folksource.model.*;
import org.hibernate.Criteria;
import org.hibernate.FetchMode;
import org.hibernate.Session;
import org.hibernate.criterion.Restrictions;

public class SubmissionService {

	public static List<Submission> getSubmissions(Session session) {
		List<Submission> submissions;

		System.out.println("ANSWER IN");
		//submissions = session.createCriteria(Submission.class).setFetchMode("answers", FetchMode.JOIN).list();
		submissions = session.createQuery("from Submission").list();
		System.out.println("ANSWER OUT");

		return submissions;
	}
	
	public static Submission getSubmission(int id, Session session){
		//Session session = HibernateUtil.getSession(true);
		Object obj = session.createCriteria(Submission.class)
							.add(Restrictions.idEq(id))
							.list().get(0);
		Submission sub = null;
		if(obj instanceof Submission){
			sub = (Submission) obj;
		}
		return sub;
		
	}
	
	@SuppressWarnings("unchecked")
	public static List<Submission> getSubmissionsAfter(String date, Session session) {
		//date should be a string representation of the milliseconds since the unix epoch
		List<Submission> submissions;
		//Session session = HibernateUtil.getSession(true);
		submissions = session.createCriteria(Submission.class)
						.add(Restrictions.gt("timestamp", new Date(Long.parseLong(date))))
						.list();
		return submissions;
	}

	public static boolean save(Submission s) {
		Session session = HibernateUtil.getSession(true);
		s.setTimestamp(new Date());

		session.save(s);

        if (s.getAnswers() != null) {
            for (Answer a : s.getAnswers()) {

                a.setSub_id(s.getId());
                AnswerService.save(a);
            }
        }

        // This should only apply for the current gun-law campaign. Any of those others don't deserve it
        if(s.getTask_id() == 59) {
            Location l = LocationService.getLocationById(s.getLocation_id());
            Submission[] submissions = l.getSubmissions();
            boolean agreed = false;
            if (submissions.length > 1) {
                String firstAnswer = "";
                for (int i = 0; i < submissions.length; i++) {
                    List<Answer> answers = submissions[i].getAnswers();
                    for (int j = 0; j < answers.size(); j++) {
                        Answer a = answers.get(j);
                        if (a instanceof MultipleChoiceAnswer) {
                            if (i == 0) {
                                firstAnswer = ((MultipleChoiceAnswer) answers.get(j)).getChoices();
                            } else {
                                if (firstAnswer.equalsIgnoreCase(((MultipleChoiceAnswer) answers.get(j)).getChoices())) {
                                    agreed = false;
                                } else {
                                    agreed = true;
                                }
                            }
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
