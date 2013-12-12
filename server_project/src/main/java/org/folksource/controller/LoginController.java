package org.folksource.controller;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.struts2.ServletActionContext;
import org.folksource.model.SubmissionDto;
import org.folksource.model.User;
import org.folksource.util.UserService;
import org.grouplens.common.dto.DtoContainer;

import com.opensymphony.xwork2.ModelDriven;

public class LoginController implements ModelDriven<User> {
	
	private DtoContainer<User> content = new DtoContainer<User>(User.class, false);
	User user = new User();
	
	private String name;
	private String password;
	private String salt;

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
	
	public void setSalt(String salt) {
		this.salt = salt;
	}
	public String getSalt() {
		return salt;
	}
	
	
	public String create()// deal with login  /Login/user_id
	{	
		HttpServletResponse response = ServletActionContext.getResponse();
		//user = content.getSingle();
		User u = UserService.getUserByName(user.getName());
		
		if (u == null) {//fail
			response.setStatus(HttpServletResponse.SC_NOT_ACCEPTABLE);
			return "login_no_user";
		}
		if (UserService.isPasswordValid(u, user.getPassword())) {// success
			//FIXME
//			if (user is already logged in )
//				return doing nothing
//			else
//				store user in session
//			Cookie c = new Cookie("data", "points:" + u.getPoints() + "|uid:" + u.getId());
//			response.addHeader("Set-Cookie", "points="+u.getPoints()+";uid="+ u.getId());
//			response.addCookie(c);
			response.addHeader("Allow", "*");
			response.addHeader("Access-Control-Allow-Origin", "*");
//			response.addHeader("Access-Control-Expose-Headers", "X-Points");
//			response.addHeader("Access-Control-Expose-Headers", "X-Uid");
			response.addHeader("Access-Control-Expose-Headers", "Cache-Control");
			
			
//			response.addHeader("Access-Control-Allow-Headers", "X-Points");
//			response.addHeader("Access-Control-Allow-Headers", "X-Uid");
			response.addHeader("Access-Control-Allow-Headers", "Cache-Control");
			response.addHeader("Cache-Control", "no-cache");
			response.setStatus(HttpServletResponse.SC_OK);
			HttpServletRequest req = ServletActionContext.getRequest();
			req.setAttribute("uid", u.getId());
			req.setAttribute("points", u.getPoints());
			req.setAttribute("name", u.getName());
			req.setAttribute("email", u.getEmail());
			
			//content.set(u);
			return "login_success";
		} else {
			// bad password
			response.setStatus(HttpServletResponse.SC_EXPECTATION_FAILED);
			return "login_wrong_password";
		}
	}
	
	public String options() {
		HttpServletResponse res = ServletActionContext.getResponse();
		res.addHeader("Allow", "*");
		res.addHeader("Access-Control-Allow-Origin", "*");
//		res.addHeader("Access-Control-Expose-Headers", "X-Points");
//		res.addHeader("Access-Control-Expose-Headers", "X-Uid");
		res.addHeader("Access-Control-Expose-Headers", "Cache-Control");
//		res.addHeader("Access-Control-Expose-Headers", "Content-Type");
//		res.addHeader("Access-Control-Allow-Methods", "GET, POST");
//		res.addHeader("Access-Control-Allow-Headers", "X-Points");
//		res.addHeader("Access-Control-Allow-Headers", "X-Uid");
//		res.addHeader("Access-Control-Allow-Headers", "Content-Type");
		res.addHeader("Access-Control-Allow-Headers", "Cache-Control");
		res.addHeader("Cache-Control", "no-cache");
		return "options_success";
	}
}
