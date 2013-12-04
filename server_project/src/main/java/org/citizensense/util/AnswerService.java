package org.citizensense.util;

import org.citizensense.model.*;

import org.hibernate.Session;


public class AnswerService {

	public static void save(Answer a) {
		Session session = HibernateUtil.getSession(true);
		session.save(a);
	}

}
