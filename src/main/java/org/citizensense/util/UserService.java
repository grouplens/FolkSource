package org.citizensense.util;

import java.util.List;

import org.apache.commons.logging.Log;
import org.citizensense.model.User;
import org.hibernate.Query;
import org.hibernate.Session;

public class UserService {
	
	@SuppressWarnings("unchecked")
	public static List<User> getUsers() {
		List<User> users;
		Session session = HibernateFactory.getSessionFactory().getCurrentSession();
		session.beginTransaction();
		
		users = session.createQuery("from User").list();
		session.getTransaction().commit();
		
		for(User u : users) {
			getIncentives(u);
		}
		return users;
	}
	
	@SuppressWarnings("unchecked")
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
	

	
	public static User getUser(String name) {
		System.out.println(name);//test
		Session session = HibernateFactory.getSessionFactory().getCurrentSession();
		session.beginTransaction();
		Query q = session.createQuery("from User where name=:username");
		q.setParameter("username", name);
		return (User) q.uniqueResult();
//		List<User> users = (List<User>) session.createQuery("from User").list();
//		if(users!=null) return users.get(0);
//		else return null;
	}
	
	public static boolean isPasswordValid(User u, String password) {
		// FIXME: implement password hashes
		return u.getPassword().equals(password);
	}
	

}
