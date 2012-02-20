package org.citizensense.util;

import java.util.Collections;
import java.util.List;

import org.citizensense.model.*;
import org.hibernate.Query;
import org.hibernate.Session;


public class TaskService {

	
	public static List<Task> getTasks() {
		List<Task> tasks;

		Session session = HibernateUtil.getSession(true);
		
		tasks = session.createQuery("from Task").list();
		
		for(Task t: tasks) {
			getSubmissions(t);
			getQuestions(t);
		}
		
		return tasks;
	}
	
	public static void getSubmissions(Task t) {
		List<Submission> submissions;
		Session session = HibernateUtil.getSession(true);
		
		submissions = session.createQuery("from Submission where task_id= " + t.getId()).list();
		
		t.setSubmissions(submissions);
	}
	
	public static void getQuestions(Task t) {
		List<Question> questions;
		Session session = HibernateUtil.getSession(true);
		
		questions = session.createQuery("from Question where task_id= " + t.getId()).list();
		
		Collections.sort(questions);
		t.setQuestions(questions);
	}

	public static void save(Task t) {
		Session session = HibernateUtil.getSession(true);
		session.save(t);
		
	}
	
	public static Task getTaskById(int id){
		List<Task> tasks = getTasks();
		Task t = null;
		for(Task task : tasks) {
			if(task.getId() == id)
				t = task;
		}
		return t;
	}

}
