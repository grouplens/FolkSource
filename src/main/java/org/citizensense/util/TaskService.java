package org.citizensense.util;

import java.util.Collections;
import java.util.List;

import org.citizensense.model.*;
import org.hibernate.Session;


public class TaskService {

	
	public static List<Task> getTasks() {
		List<Task> tasks;

		Session session = HibernateFactory.getSessionFactory().getCurrentSession();
		//Session session = HibernateFactory.getSessionFactory().getCurrentSession();
		session.beginTransaction();
		
		tasks = session.createQuery("from Task").list();
//		for(Task t : tasks) {
//			submissions = session.createQuery("from Task as t join from ").list();
//			t.setSubmissions(submissions);
//		}
		session.getTransaction().commit();
		
		for(Task t: tasks) {
			getSubmissions(t);
			getQuestions(t);
		}
		
		return tasks;
	}
	
	public static void getSubmissions(Task t) {
		List<Submission> submissions;
		Session session = HibernateFactory.getSessionFactory().getCurrentSession();
		session.beginTransaction();
		
		submissions = session.createQuery("from Submission where task_id= " + t.getId()).list();
		
		t.setSubmissions(submissions);
		
		session.getTransaction().commit();
	}
	
	public static void getQuestions(Task t) {
		List<Question> questions;
		Session session = HibernateFactory.getSessionFactory().getCurrentSession();
		session.beginTransaction();
		
		questions = session.createQuery("from Question where task_id= " + t.getId()).list();
		
		Collections.sort(questions);
		t.setQuestions(questions);
		
		session.getTransaction().commit();
	}

	public static void save(Task t) {
		Session session = HibernateFactory.getSessionFactory().getCurrentSession();
		session.beginTransaction();
		session.save(t);
		session.getTransaction().commit();
		
	}

}
