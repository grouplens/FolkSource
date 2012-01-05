package org.citizensense.util;

import java.sql.SQLException;
import java.util.List;

import org.citizensense.model.*;
import org.hibernate.HibernateException;
import org.hibernate.Session;


public class SubmissionService {

	
	public static List<Submission> getSubmissions() {
		List<Submission> submissions;

		Session session = HibernateFactory.getSessionFactory().getCurrentSession();
		//Session session = HibernateFactory.getSessionFactory().getCurrentSession();
		session.beginTransaction();
		
		submissions = session.createQuery("from Submission").list();
//		for(Task t : tasks) {
//			submissions = session.createQuery("from Task as t join from ").list();
//			t.setSubmissions(submissions);
//		}
		session.getTransaction().commit();
		
//		for(Task t: submissions) {
//			getSubmissions(t);
//			getQuestions(t);
//		}
		
		return submissions;
	}
	
//	public static void getSubmissions(Task t) {
//		List<Submission> submissions;
//		Session session = HibernateFactory.getSessionFactory().getCurrentSession();
//		session.beginTransaction();
//		
//		submissions = session.createQuery("from Submission where task_id= " + t.getId()).list();
//		
//		t.setSubmissions(submissions);
//		
//		session.getTransaction().commit();
//	}
//	
//	public static void getQuestions(Task t) {
//		List<Question> questions;
//		Session session = HibernateFactory.getSessionFactory().getCurrentSession();
//		session.beginTransaction();
//		
//		questions = session.createQuery("from Question where task_id= " + t.getId()).list();
//		
//		Collections.sort(questions);
//		t.setQuestions(questions);
//		
//		session.getTransaction().commit();
//	}

	public static void save(Submission t) throws SQLException {
		Session session = HibernateFactory.getSessionFactory().getCurrentSession();
		session.beginTransaction();
		session.save(t);
		try {
			session.getTransaction().commit();
		} catch (HibernateException e) {
			session.getTransaction().rollback();
			Exception ex1 = (Exception) e.getCause();
			SQLException ex2 = (SQLException) e.getCause();
			throw ex2.getNextException();
			
		}
		
	}

}
