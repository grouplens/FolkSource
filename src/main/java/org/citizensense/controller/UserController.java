package org.citizensense.controller;

import java.util.Collection;

import org.citizensense.model.User;
import org.citizensense.util.*;

import com.opensymphony.xwork2.ModelDriven;
import org.apache.struts2.rest.DefaultHttpHeaders;
import org.apache.struts2.rest.HttpHeaders;

public class UserController implements ModelDriven<Object>{
	
	User user = new User();
	private Collection<User> list;
	private int id;
	/**
	 * @param args
	 */
	public static void main(String[] args) {
		// TODO Auto-generated method stub

	}

	@Override
	public Object getModel() {
		return (list != null ? list : user);
	}
	
	public HttpHeaders show() {
		return new DefaultHttpHeaders("show");
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
	
	public HttpHeaders index() {
		list = UserService.getUsers();
		return new DefaultHttpHeaders("index").disableCaching();
	}

}
