package org.citizensense.util;

import java.util.Collections;
import java.util.List;

import org.citizensense.model.*;
import org.hibernate.Session;
import org.hibernate.criterion.Restrictions;


public class TaskService {

	
	public static List<Task> getTasks() {
		List<Task> tasks;
		Session session = HibernateUtil.getSession(false);
		tasks=session.createCriteria(Task.class).list();
		//tasks = session.createQuery("from Task as t join fetch t.submissions s left join fetch s.answers").list();
		//tasks = session.createQuery("from Task").list();
		
//		for(Task t: tasks) {
//			getSubmissions(t);
//			getQuestions(t);
//		}
		
		return tasks;
	}
	
	public static void getSubmissions(Task t) {
		List<Submission> submissions;
		Session session = HibernateUtil.getSession(true);
		submissions = session.createCriteria(Submission.class).add(Restrictions.eq("task_id", t.getId())).list();
		//submissions = session.createQuery("from Submission where task_id= " + t.getId()).list();
		t.setSubmissions(submissions);
	}
	
	public static void getQuestions(Task t) {
		List<Question> questions;
		Session session = HibernateUtil.getSession(true);
		
		questions = session.createCriteria(Question.class).add(Restrictions.eq("task_id", t.getId())).list();
		//questions = session.createQuery("from Question where task_id= " + t.getId()).list();
		
		Collections.sort(questions);
		t.setQuestions(questions);
	}

	public static void save(Task t) {
		Session session = HibernateUtil.getSession(true);
		session.save(t);
		for(Question q : t.getQuestions()) {
			q.setTask_id(t.getId());
			QuestionService.save(q);
		}
		for(Location l : t.getLocations()) {
			l.setTask_id(t.getId());
			LocationService.save(l);
		}
	}
	
	public static Task getTaskById(int id, Session session){
		Task tasks=(Task)session.createCriteria(Task.class).add(Restrictions.idEq(id)).list().get(0);
		return tasks;
	}

}
