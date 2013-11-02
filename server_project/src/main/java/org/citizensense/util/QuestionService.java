package org.citizensense.util;

import java.util.List;

import org.citizensense.model.*;
import org.hibernate.Session;


public class QuestionService {

	
	public static List<Question> getQuestions() {
		List<Question> questions;

		Session session = HibernateUtil.getSession(true);
		
		questions = session.createQuery("from Question").list();
		
		return questions;
	}


	public static void save(Question q) {
		Session session = HibernateUtil.getSession(true);
		session.save(q);
		
	}
	
	public static Question getQuestionById(int id){
		List<Question> questions = getQuestions();
		Question q = null;
		for(Question question : questions) {
			if(question.getId() == id)
				q = question;
		}
		return q;
	}

}
