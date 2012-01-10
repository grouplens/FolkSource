package org.citizensense.controller;

import java.security.SecureRandom;

import javax.servlet.http.HttpServletResponse;

import org.apache.struts2.ServletActionContext;
import org.citizensense.model.User;
import org.citizensense.util.PasswordHashAndSalt;
import org.citizensense.util.UserService;

import com.opensymphony.xwork2.ModelDriven;

public class UserController implements ModelDriven<User>{
	
	User user = new User();
//	private int id;
	private String name;
	private String password;
	private String salt;
	private String email;
//	private Collection<User> list;
	

	@Override
	public User getModel() {
		return user;
	}
	
//	public void setId(String id) {
//		if (id != null)
//			this.user = UserService.findUser(Integer.parseInt(id));
//		if(this.user != null)
//			this.id = Integer.parseInt(id);		
//	}
//	
//	public int getId() {
//		return this.id;
//	}
	
	public void setName(String name) {
		this.name = name;
	}

	public String getName() {
		return name;
	}
	
	public void setPassword(String password) {
		this.password = password;
	}

	public String getPassword() {
		return password;
	}
	
	public void setSalt(String salt) {
		this.salt = salt;
	}
	public String getSalt() {
		return salt;
	}
	
//	public HttpHeaders show() {//get 
//		return new DefaultHttpHeaders("show");
//	}
//	
//
//	
//	public HttpHeaders index() {
//		list = UserService.getUsers();
//		return new DefaultHttpHeaders("index").disableCaching();
//	}
//	public HttpHeaders create() {//deal with register
//		UserService.save(user);
//		return new DefaultHttpHeaders("create");
//	}
	
	public String create() {//deal with register
		HttpServletResponse response = ServletActionContext.getResponse();
		User u = UserService.getUser(user.getName());
		if (u == null) {//user name doesn't exist, could register 
			
			//hash the password and set Salt
			String pwWithoutHash = user.getPassword();
			SecureRandom rng = new SecureRandom();
			PasswordHashAndSalt pw = UserService.getPasswordHash(pwWithoutHash,rng);
			user.setPassword(pw.getPasswordHash());
			user.setSalt(pw.getSalt());
			
			UserService.save(user);
			response.setStatus(HttpServletResponse.SC_OK);
			return "register_success";
		}else {
			// user name does exist, couldn't register
			response.setStatus(HttpServletResponse.SC_NOT_ACCEPTABLE);
			return "register_fail";
		}
	}

	public void setEmail(String email) {
		this.email = email;
	}

	public String getEmail() {
		return email;
	}

}
