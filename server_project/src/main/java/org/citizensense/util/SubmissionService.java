package org.citizensense.util;

import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.Arrays;
import java.util.Date;
import java.util.List;
import org.citizensense.model.*;

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
