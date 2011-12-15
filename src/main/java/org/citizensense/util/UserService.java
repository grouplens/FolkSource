package org.citizensense.util;

import java.security.SecureRandom;
import java.util.List;

import org.apache.commons.codec.binary.Base64;
import org.citizensense.model.User;
import org.grouplens.common.util.HashUtil;
import org.hibernate.Query;
import org.hibernate.Session;

public class UserService {
	
	// 8 bytes should be a good enough salt for our purposes.
    private static final int SALT_LENGTH = 8;
	
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
	
	private static void getIncentives(User u) {
		List<User> users;
		Session session = HibernateFactory.getSessionFactory().getCurrentSession();
		//Session session = HibernateFactory.getSessionFactory().getCurrentSession();
		session.beginTransaction();
		
		users = session.createQuery("from Incentives").list();
		session.getTransaction().commit();
		
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
		Session session = HibernateFactory.getSessionFactory().getCurrentSession();
		session.beginTransaction();
		Query q = session.createQuery("from User where name=:username");
		q.setParameter("username", name);
		return (User) q.uniqueResult();
	}
	
	
	/** User u should be the user stored in db,
	 *  String password is a pw not hashed yet.*/
	public static boolean isPasswordValid(User u, String pwWithoutHash) {
		// get the hashed value for the password
		String saltedPassword = HashUtil.getSaltedPassword(pwWithoutHash,u.getSalt());
		return u.getPassword().equals(saltedPassword);
	}
	
    public static PasswordHashAndSalt getPasswordHash(String pwWithoutHash, SecureRandom rng) {
        byte[] saltb = new byte[SALT_LENGTH]; 
        rng.nextBytes(saltb);
        
        String salt = Base64.encodeBase64String(saltb);
        String passwordHash = HashUtil.getSaltedPassword(pwWithoutHash, salt);
        return new PasswordHashAndSalt(passwordHash, salt);
    }
}
