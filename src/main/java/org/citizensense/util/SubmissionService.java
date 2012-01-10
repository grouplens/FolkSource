package org.citizensense.util;

import java.util.List;
import org.citizensense.model.*;
import org.hibernate.Session;

public class SubmissionService {

	public static List<Submission> getSubmissions() {
		List<Submission> submissions;

		Session session = HibernateFactory.getSessionFactory()
				.getCurrentSession();
		session.beginTransaction();

		submissions = session.createQuery("from Submission").list();

		session.getTransaction().commit();
		return submissions;
	}

	public static void save(Submission t) {
		Session session = HibernateFactory.getSessionFactory()
				.getCurrentSession();
		session.beginTransaction();
		session.save(t);
		if (t.getAnswers() != null) {
			for (Answer a : t.getAnswers()) {

				a.setSub_id(t.getId());
				AnswerService.save(a);
			}
		}
		List<User> users = session.createQuery("from User where id=" + t.getUser_id()).list();
		users.get(0).setPoints(users.get(0).getPoints() + 1);

		session.getTransaction().commit();
	}

}
