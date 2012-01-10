package org.citizensense.util;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import org.citizensense.model.*;
import org.hibernate.HibernateException;
import org.hibernate.Session;


public class AnswerService {

	
//	public static List<Answer> getLeaderboard() {
//		List<Answer> answers = new ArrayList<Answer>();
//		
//		Session session = HibernateFactory.getSessionFactory().getCurrentSession();
//		//Session session = HibernateFactory.getSessionFactory().getCurrentSession();
//		session.beginTransaction();
//		
//		answers = session.createQuery("from Answer").list();
//		
//		session.getTransaction().commit();
//		
//		for(Answer a : answers) {
//			answers.add(a);
//		}
//		Collections.sort(answers);
//		return answers;
//	}

	public static void save(Answer a) {
		Session session = HibernateFactory.getSessionFactory().getCurrentSession();
		session.beginTransaction();
		session.save(a);
//		try {
//			session.getTransaction().commit();
//		} catch (HibernateException e) {
//			session.getTransaction().rollback();
//		}
		
	}

}
