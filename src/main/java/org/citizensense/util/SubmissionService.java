package org.citizensense.util;

import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;
import org.citizensense.model.*;

import org.hibernate.Session;

public class SubmissionService {

	public static List<Submission> getSubmissions() {
		List<Submission> submissions;

		Session session = HibernateUtil.getSession(true);

		submissions = session.createQuery("from Submission").list();

		return submissions;
	}
	
	public static List<Submission> getSubmissions(Integer task,Integer loc) {
		List<Submission> submissions;
		Session session = HibernateUtil.getSession(true);
		submissions = session.createQuery("from Submission where task_id=" +
											task + " and loc_id=" + loc).list();
		return submissions;
	}

	public static boolean save(Submission t) {
		Session session = HibernateUtil.getSession(true);
			t.setTimestamp(new Date());
			session.save(t);
			if (t.getAnswers() != null) {
				for (Answer a : t.getAnswers()) {

					a.setSub_id(t.getId());
					AnswerService.save(a);
				}
			}
			List<User> users = session.createQuery("from User where id=" + t.getUser_id()).list();
			users.get(0).setPoints(users.get(0).getPoints() + 1);
			return true;
	}

	public static User getSubUser(Submission submission) {
		Session session = HibernateUtil.getSession(false);
		System.out.println("CITIZENSENSE - " + submission.getUser_id());
		List<User> users = session.createQuery("from User where id=" + submission.getUser_id()).list();
		return users.get(0);
	}


}
