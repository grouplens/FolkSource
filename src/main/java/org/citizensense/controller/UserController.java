package org.citizensense.controller;

import java.util.Collection;

import javax.servlet.http.HttpServletResponse;

import org.apache.struts2.ServletActionContext;
import org.apache.struts2.rest.DefaultHttpHeaders;
import org.apache.struts2.rest.HttpHeaders;
import org.citizensense.model.User;
import org.citizensense.util.UserService;

import com.opensymphony.xwork2.ModelDriven;

public class UserController implements ModelDriven<User>{
	
	User user = new User();
	private int id;
	private String name;
	private String password;
	private Collection<User> list;

	@Override
	public User getModel() {
		return user;
	}
	
	public void setId(String id) {
		if (id != null)
			this.user = UserService.findUser(Integer.parseInt(id));
		if(this.user != null)
			this.id = Integer.parseInt(id);		
	}
	
	public int getId() {
		return this.id;
	}
	
	public void setPassword(String password) {
		this.password = password;
	}

	public String getPassword() {
		return password;
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
			UserService.save(user);
			response.setStatus(HttpServletResponse.SC_OK);
			return "register_success";
		}else {
			// user name does exist, couldn't register
			response.setStatus(HttpServletResponse.SC_NOT_ACCEPTABLE);
			return "register_fail";
		}
	}



}
