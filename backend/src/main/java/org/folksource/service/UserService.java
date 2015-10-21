package org.folksource.service;

import java.util.List;

import org.folksource.entities.User;

public interface UserService {

	User getUserByName(String name);

	List<User> userLeaderboard();

	boolean verifyUser(String username, String password);
	
	User createUser(User user);

}
