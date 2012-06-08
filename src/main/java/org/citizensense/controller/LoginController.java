package org.citizensense.controller;

import javax.servlet.http.HttpServletResponse;

import org.apache.struts2.ServletActionContext;
import org.citizensense.model.User;
import org.citizensense.util.UserService;
import org.grouplens.common.dto.DtoContainer;

import com.opensymphony.xwork2.ModelDriven;

public class LoginController implements ModelDriven<DtoContainer<User>>{
	
	//User user = new User();
	DtoContainer<User> content = new DtoContainer<User>(User.class, false);
	
	private String name;
	private String password;
	private String salt;

	@Override
	public DtoContainer<User> getModel() {
		return content;
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
	
	public void setSalt(String salt) {
		this.salt = salt;
	}
	public String getSalt() {
		return salt;
	}
	
	
	public String create()// deal with login  /Login/user_id
	{	
		HttpServletResponse response = ServletActionContext.getResponse();
		User u = UserService.getUserByName(name);
		
		if (u == null) {//fail
			response.setStatus(HttpServletResponse.SC_NOT_ACCEPTABLE);
			return "login_no_user";
		}
		if (UserService.isPasswordValid(u, content.getSingle().getPassword())) {// success
			//FIXME
//			if (user is already logged in )
//				return doing nothing
//			else
//				store user in session
			response.setStatus(HttpServletResponse.SC_OK);
			response.addIntHeader("points", u.getPoints());
			response.addIntHeader("uid", u.getId());
			return "login_success";
		} else {
			// bad password
			response.setStatus(HttpServletResponse.SC_EXPECTATION_FAILED);
			return "login_wrong_password";
		}
	}
}
