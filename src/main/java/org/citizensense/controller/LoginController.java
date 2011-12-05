package org.citizensense.controller;

import javax.servlet.http.HttpServletResponse;

import org.apache.struts2.ServletActionContext;
import org.citizensense.model.User;
import org.citizensense.util.UserService;

import com.opensymphony.xwork2.ModelDriven;

public class LoginController implements ModelDriven<User>{
	
	User user = new User();
	
	private String name;
	private String password;

	@Override
	public User getModel() {
		return user;
	}
	
	public void setName(String name) {
		this.name = name;
	}

	public String getName(){
		return this.name;
	}
	
	public void setPassword(String pw) {
		this.password = pw;
	}
	public String getPassword(){
		return this.password;
	}
	
	
	public String create()// deal with login  /Login/user_id
	{	
		HttpServletResponse response = ServletActionContext.getResponse();
		User u = UserService.getUser(user.getName());
		
		if (u == null) {//fail
			response.setStatus(HttpServletResponse.SC_NOT_ACCEPTABLE);
			return "login_no_user";
		}
		if (UserService.isPasswordValid(u, user.getPassword())) {// success
			//FIXME
//			if (user is already logged in )
//				return doing nothing
//			else
//					store user in session
			response.setStatus(HttpServletResponse.SC_OK);
			return "login_success";
		} else {
			// bad password
			response.setStatus(HttpServletResponse.SC_EXPECTATION_FAILED);
			return "login_wrong_password";
		}
	}
}
