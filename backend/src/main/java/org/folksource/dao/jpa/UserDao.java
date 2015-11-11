package org.folksource.dao.jpa;

import org.folksource.entities.User;

public interface UserDao extends TypedJpaDao<User, Integer>{

	User getUserByUsername(String username);

	User getUserByWikiToken(String requestToken);

}
