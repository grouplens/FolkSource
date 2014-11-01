package org.folksource.util;

import java.security.SecureRandom;
import java.util.List;

import org.apache.commons.codec.binary.Base64;
import org.folksource.model.User;
import org.grouplens.common.util.HashUtil;
import org.hibernate.Query;
import org.hibernate.Session;

public class UserService {
	
	// 8 bytes should be a good enough salt for our purposes.
    private static final int SALT_LENGTH = 8;

	public static List<User> getUsers() {
		List<User> users;
		Session session = HibernateUtil.getSession(true);
		
		Query q = session.createQuery("from User");
//        q.setParameter("name", "anonymous");
        users = q.list();
		
//		for(User u : users) {
//			getIncentives(u);
//		}
		return users;
	}
	
	private static void getIncentives(User u) {
		List<User> users;
		Session session = HibernateUtil.getSession(true);
		
		users = session.createQuery("from Incentives").list();
		
	}

	public static User getUserById(int id) {
		List<User> users = getUsers();
		User u = null;
		for(User tmp : users) {
			if(tmp.getId() == id)
				u = tmp;
		}
		
		return u;
	}
	
	public static User getUserByToken(int token) {
		List<User> tmp = getUsers();
		System.out.println(token);
        System.out.println("LIST: " + tmp.size());
		
		for(User u : tmp) {
            System.out.println(u.getName());
            System.out.println(u.getToken().getId());
            System.out.println(u.getToken().getToken() + " : " + token);
            System.out.println(u.getToken() == null);
			if(u.getToken() != null && u.getToken().getToken().equals(token))
				return u;
		}
		return null;
	}
	
	public static void save(User u) {
		Session session = HibernateUtil.getSession(true);
		session.saveOrUpdate(u);
	}
	
	public static User getUserByName(String name) {
		Session session = HibernateUtil.getSession(true);
        System.out.println(name);
        Query q = session.createQuery("from User where name=:name");
        q.setParameter("name", name);
        return (User) q.uniqueResult();
	}
	
	
	public static User getUserByEmail(String email) {
		Session session = HibernateFactory.getSessionFactory().getCurrentSession();
        Query q = session.createQuery("from User where email=:email");
		q.setParameter("email", email);
		return (User) q.uniqueResult();
	}
	
	public static User getUserByFindpwid(String findpwid) {
		Session session = HibernateFactory.getSessionFactory().getCurrentSession();
		session.beginTransaction();
		Query q = session.createQuery("from User where findpwid=:findpwid");
		q.setParameter("findpwid", findpwid);
		return (User) q.uniqueResult();
	}
	
	/** User u should be the user stored in db,
	 *  String password is a pw not hashed yet.*/
	public static boolean isPasswordValid(User u, String pwWithoutHash) {
		// get the hashed value for the password
		String saltedPassword = HashUtil.getSaltedPassword(pwWithoutHash,u.getSalt());
        return u.getName().equals("anonymous") || u.getPassword().equals(saltedPassword);
	}
	
    public static PasswordHashAndSalt getPasswordHash(String pwWithoutHash, SecureRandom rng) {
        byte[] saltb = new byte[SALT_LENGTH]; 
        rng.nextBytes(saltb);
        
        String salt = Base64.encodeBase64String(saltb);
        String passwordHash = HashUtil.getSaltedPassword(pwWithoutHash, salt);
        return new PasswordHashAndSalt(passwordHash, salt);
    }
}
