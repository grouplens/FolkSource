package org.citizensense.util;

import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.Arrays;
import java.util.Date;
import java.util.List;
import org.citizensense.model.*;
import org.citizensense.model.Question;

import org.hibernate.Criteria;
import org.hibernate.Session;
import org.hibernate.criterion.Restrictions;

public class QuestionService {

	public static List<Question> getQuestions() {
		List<Question> questions;

		Session session = HibernateUtil.getSession(true);

		questions = session.createQuery("from Question").list(); 
		
		return questions;
	}
	
	public static Question getQuestion(int id){
		Session session = HibernateUtil.getSession(true);
		Object obj = session.createCriteria(Question.class)
							.add(Restrictions.idEq(id))
							.list().get(0);
		Question ques = null;
		if(obj instanceof Question){
			ques = (Question) obj;
		}
		return ques;
		
	}
	
//	public static List<Question> getQuestionAfter(String date) {             //don't think I need this because Question has no date aspect within it.
//		//date should be a string representation of the milliseconds since the unix epoch
//		List<Question> questions;
//		Session session = HibernateUtil.getSession(true);
//		questions = session.createCriteria(Question.class)
//						.add(Restrictions.gt("timestamp", new Date(Long.parseLong(date))))
//						.list();
//		return questions;
//	}

	public static boolean save(Question q) {
		Session session = HibernateUtil.getSession(true);
//		q.setTimestamp(new Date());
		
		session.save(q);

//		if (s.getAnswers() != null) {
//			for (Answer a : s.getAnswers()) {
//
//				a.setSub_id(s.getId());
//				AnswerService.save(a);
//			}
//		}
//		List<User> users = session.createQuery("from User where id=" + s.getUser_id()).list(); 
//		users.get(0).setPoints(users.get(0).getPoints() + 1);
		return true;
	}

//	public static User getQuesUser(Question question) {
//		Session session = HibernateUtil.getSession(false);
//		List<User> users = session.createQuery("from User where id=" + question.getUser_id()).list();
//		return users.get(0);
//	}


}
