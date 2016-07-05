package org.folksource.service.impl;

import java.security.SecureRandom;
import java.util.List;

import org.apache.commons.codec.binary.Base64;
import org.folksource.dao.jpa.UserDao;
import org.folksource.entities.User;
import org.folksource.service.UserService;
import org.folksource.util.HibernateFactory;
import org.folksource.util.HibernateUtil;
import org.folksource.util.PasswordHashAndSalt;
import org.grouplens.common.util.HashUtil;
import org.hibernate.Query;
import org.hibernate.Session;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.transaction.annotation.Transactional;

public class UserServiceImpl implements UserService{
	// 8 bytes should be a good enough salt for our purposes.
    private static final int SALT_LENGTH = 8; 
    
    @Autowired
    private UserDao userDao;
	

	public boolean verifyUser(String username, String password){
		
		//check if the user is available
		User user = null;
		boolean verified = false;
		try {
			//TODO not working quite right
			user = userDao.getUserByUsername(username);
			String saltedPassword = HashUtil.getSaltedPassword(password, user.getSalt());
			if (saltedPassword.equals(user.getPassword())) {
				verified = true;
			} else {
				throw new Exception("Bad user or password");
			}
			
		} catch(Exception e) {
			System.out.println("Error" + e);
			//Log the try here
		}
		return verified;
	}
    
    
	public User getUserByName(String name) {
		User user = userDao.getUserByUsername(name);
		return user;
	}
	
	public List<User> userLeaderboard() {
		return userDao.findAll();
	}

	@Override
	@Transactional
	public User createUser(User user) {
		return userDao.merge(user);
	}
	
	
	//Old methods
	private static void getIncentives(User u) {
		List<User> users;
		Session session = HibernateUtil.getSession(true);
		
		users = session.createQuery("from Incentives").list();
		
	}
	
	@SuppressWarnings("unchecked")
	public static List<User> getUsers() {
		List<User> users;
		Session session = HibernateUtil.getSession(true);
		
		users = session.createQuery("from User").list();
		
//		for(User u : users) {
//			getIncentives(u);
//		}
		return users;
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
	
	public static void save(User u) {
		Session session = HibernateUtil.getSession(true);
		session.saveOrUpdate(u);
	}
	
	public static User getUserByToken(int token) {
		List<User> tmp = getUsers();
		System.out.println(token);
		
		for(User u : tmp) {
			//not sure why it was getToken twice
			if(u.getToken() != null && u.getToken().equals(token))
				return u;
		}
		return null;
	}
	
	public static User getUserByEmail(String email) {
		Session session = HibernateFactory.getSessionFactory().getCurrentSession();
		session.beginTransaction();
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
		return u.getPassword().equals(saltedPassword);
	}
	
    public static PasswordHashAndSalt getPasswordHash(String pwWithoutHash, SecureRandom rng) {
        byte[] saltb = new byte[SALT_LENGTH]; 
        rng.nextBytes(saltb);
        
        String salt = Base64.encodeBase64String(saltb);
        String passwordHash = HashUtil.getSaltedPassword(pwWithoutHash, salt);
        return new PasswordHashAndSalt(passwordHash, salt);
    }

	public UserDao getUserDao() {
		return userDao;
	}

	public void setUserDao(UserDao userDao) {
		this.userDao = userDao;
	}



}
