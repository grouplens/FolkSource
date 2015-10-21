package org.folksource.action.user;

import java.util.List;

import org.apache.struts2.convention.annotation.Action;
import org.apache.struts2.convention.annotation.ParentPackage;
import org.apache.struts2.convention.annotation.Result;
import org.folksource.action.BaseAction;
import org.folksource.entities.User;
import org.folksource.service.UserService;

@ParentPackage("folksource-secured-pkg")
public class UserAction extends BaseAction{
	
	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	private User user;
	private List<User> users;
	private UserService userService;
	
	private String username;

	@Action(value="anonymous/token", results = {
		@Result(name = SUCCESS, type="json", params = {"root","user"})
	})
	public String index() {
		//user = userService
		return SUCCESS;
	}
	
	@Action(value="{username}/token", results = {
		@Result(name = SUCCESS, type="json", params = {"root","user"}),
		@Result(name = ERROR, type = "httpheader", params = { "status", "500" })
	})
	public String sendToken() {
		user = userService.getUserByName(username);
		if(user == null) {
			return ERROR;
		}
		return SUCCESS;
	}
	
	@Action(value="leaderboard", results = {
		@Result(name = SUCCESS, type="json", params = {"root","users"})
	})
	public String leaderboard() {
		users = userService.userLeaderboard();
		return SUCCESS;
	}

	public User getUser() {
		return user;
	}

	public void setUser(User user) {
		this.user = user;
	}

	public List<User> getUsers() {
		return users;
	}

	public void setUsers(List<User> users) {
		this.users = users;
	}

	public UserService getUserService() {
		return userService;
	}

	public void setUserService(UserService userService) {
		this.userService = userService;
	}

	public String getUsername() {
		return username;
	}

	public void setUsername(String username) {
		this.username = username;
	}
}
