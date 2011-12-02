package org.citizensense.util;

import java.util.List;
import org.citizensense.model.*;
import org.citizensense.util.*;
import org.hibernate.Session;


public class UserService {

	
	public static List<User> getUsers() {
		List<User> users;
		Session session = HibernateFactory.getSessionFactory().getCurrentSession();
		//Session session = HibernateFactory.getSessionFactory().getCurrentSession();
		session.beginTransaction();
		
		users = session.createQuery("from User").list();
		session.getTransaction().commit();
		
		for(User u : users) {
			getIncentives(u);
		}
		return users;
	}
	
	private static void getIncentives(User u) {
//		List<User> users;
//		Session session = HibernateFactory.getSessionFactory().getCurrentSession();
//		//Session session = HibernateFactory.getSessionFactory().getCurrentSession();
//		session.beginTransaction();
//		
//		users = session.createQuery("from Incentives").list();
//		session.getTransaction().commit();
		
	}

	public static User findUser(int id) {
		List<User> users = getUsers();
		User u = null;
		for(User tmp : users) {
			if(tmp.getId() == id)
				u = tmp;
		}
		
		return u;
	}
	
	public static void save(User u) {
		Session session = HibernateFactory.getSessionFactory().getCurrentSession();
		session.beginTransaction();
		session.save(u);
		session.getTransaction().commit();
	}

}
