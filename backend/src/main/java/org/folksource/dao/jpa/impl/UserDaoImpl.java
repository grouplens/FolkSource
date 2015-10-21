package org.folksource.dao.jpa.impl;

import javax.persistence.TypedQuery;

import org.folksource.dao.jpa.UserDao;
import org.folksource.entities.User;

public class UserDaoImpl extends TypedJpaDaoImpl<User, Integer> implements UserDao {

	private static final String FIND_BY_USERNAME = "select u from User u where u.name = :username";
	
	@Override
	public User getUserByUsername(String username) {
		TypedQuery<User> query = em.createQuery(FIND_BY_USERNAME,
				User.class).setParameter("username", username);
		return query.getSingleResult();
	}
}
