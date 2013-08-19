package org.citizensense.util;

import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.Arrays;
import java.util.Date;
import java.util.List;
import org.citizensense.model.*;

import org.hibernate.Criteria;
import org.hibernate.Session;
import org.hibernate.criterion.Restrictions;

public class SubmissionService {

	public static List<Submission> getSubmissions() {
		List<Submission> submissions;

		Session session = HibernateUtil.getSession(true);

		submissions = session.createQuery("from Submission").list();

		return submissions;
	}
	
	public static Submission getSubmission(int id){
		Session session = HibernateUtil.getSession(true);
		Object obj = session.createCriteria(Submission.class)
							.add(Restrictions.idEq(id))
							.list().get(0);
		Submission sub = null;
		if(obj instanceof Submission){
			sub = (Submission) obj;
		}
		return sub;
		
	}
	
	public static List<Submission> getSubmissionsAfter(String date) {
		//date should be a string representation of the milliseconds since the unix epoch
		List<Submission> submissions;
		Session session = HibernateUtil.getSession(true);
		submissions = session.createCriteria(Submission.class)
						.add(Restrictions.gt("timestamp", new Date(Long.parseLong(date))))
						.list();
		return submissions;
	}

	public static boolean save(Submission t) {
		Session session = HibernateUtil.getSession(true);
		t.setTimestamp(new Date());
		
		System.out.println("[ME] About to save submission");
		System.out.println("[ME] Answers: " + Arrays.toString(t.answers));
		System.out.println("[ME] id: "+ t.id);
		System.out.println("[ME] task_id: "+ t.task_id);
		System.out.println("[ME] user_id: "+ t.user_id);
		System.out.println("[ME] gps_location: "+ t.gps_location);
		System.out.println("[ME] timestamp: "+ t.timestamp);
		System.out.println("[ME] image_path: "+ t.img_path);
		
		session.save(t);
		System.out.println("[MEEE] sub id: " + t.id);
		if (t.getAnswers() != null) {
			for (Answer a : t.getAnswers()) {
				//System.out.println("[ME] About to save an answer!");
				//System.out.println("[ME] " + a.getClass().getName());
				a.setSub_id(t.getId());
				AnswerService.save(a);
			}
		}
		//System.out.println("[ME] After save admission");
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
