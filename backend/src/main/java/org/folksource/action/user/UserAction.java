package org.folksource.action.user;

import org.apache.struts2.convention.annotation.Action;
import org.apache.struts2.convention.annotation.ParentPackage;
import org.apache.struts2.convention.annotation.Result;
import org.folksource.action.BaseAction;
import org.folksource.entities.User;
import org.folksource.service.UserService;

@ParentPackage("folksource-norest-pkg")
public class UserAction extends BaseAction{
	
	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	private User user;
	private UserService userService;

	@Action(value="anonymous/token", results = {
		@Result(name = SUCCESS, type="json", params = {"root","user"})
	})
	public String index() {
		//user = userService
		return SUCCESS;
	}

	public User getUser() {
		return user;
	}

	public void setUser(User user) {
		this.user = user;
	}

	public UserService getUserService() {
		return userService;
	}

	public void setUserService(UserService userService) {
		this.userService = userService;
	}
}
