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

	public static boolean save(Submission t) {
		Session session = HibernateUtil.getSession(true);
		// DateFormat df = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
		if (!verify(t))
			return false;
		else {
			t.setTimestamp(new Date());
			session.save(t);
			if (t.getAnswers() != null) {
				for (Answer a : t.getAnswers()) {

					a.setSub_id(t.getId());
					AnswerService.save(a);
				}
			}
			List<User> users = session.createQuery(
					"from User where id=" + t.getUser_id()).list();
			users.get(0).setPoints(users.get(0).getPoints() + 1);
			return true;
		}
	}

	private static boolean verify(Submission t) {
		Session session = HibernateUtil.getSession(false);
		List<Question> qs = session.createQuery(
				"from Question where task_id=" + t.getTask_id()).list();
		for (Question q : qs) {
			boolean test = false;
			for (Answer a : t.getAnswers()) {
				if (q.isRequired() && (a.getQ_id() == q.getId()))
					test = true;
				String tmp = q.getOptions();
				if(!q.getType().equals("text") && tmp == null)
					return false;
				if (!tmp.contains(a.getAnswer()))
					return false;
			}
			if (!test)
				return false;
		}
		return true;
	}

}
