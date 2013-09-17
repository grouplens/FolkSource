package org.citizensense.util;

import org.citizensense.model.*;

import org.hibernate.Session;


public class AnswerService {

	public static void save(Answer a) {
		Session session = HibernateUtil.getSession(true);
		//System.out.println("[LOG] AnswerService before the save");
		if (a instanceof CompassAnswer){
			System.out.println("[LOG] Heading: " + ((CompassAnswer) a).heading);
		}
		session.save(a);
		//System.out.println("[LOG] AnswerService after the save");
	}

}
