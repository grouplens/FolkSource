package org.folksource.action.controller;

import java.security.SecureRandom;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.struts2.ServletActionContext;
import org.folksource.action.BaseAction;
//import org.folksource.controller.User;
import org.folksource.util.PasswordHashAndSalt;
import org.folksource.util.UserService;

public class LoginAction extends BaseAction{
	private String name;
	private String password;
	private String salt;

	
	
//	public void setName(String name) {
//		this.name = name;
//	}
//
//	public String getName(){
//		return this.name;
//	}
//	
//	public void setPassword(String pw) {
//		this.password = pw;
//	}
//	public String getPassword(){
//		return this.password;
//	}
//	
//	public void setSalt(String salt) {
//		this.salt = salt;
//	}
//	public String getSalt() {
//		return salt;
//	}
	
	
	public String create()// deal with login  /Login/user_id
	{	
		HttpServletResponse response = ServletActionContext.getResponse();
		//user = content.getSingle();
		//User u = UserService.getUserByName(user.getName());
		
		//if (u == null) {//fail
		//	response.setStatus(HttpServletResponse.SC_NOT_ACCEPTABLE);
		//	return "login_no_user";
		//}
		//if (UserService.isPasswordValid(u, user.getPassword())) {// success
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
			//req.setAttribute("uid", u.getId());
			//req.setAttribute("points", u.getPoints());
			//req.setAttribute("name", u.getName());
			//req.setAttribute("email", u.getEmail());
			
			//content.set(u);
			return "login_success";
		//} else {
			// bad password
		//	response.setStatus(HttpServletResponse.SC_EXPECTATION_FAILED);
		//	return "login_wrong_password";
		//}
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
	
	//add the password reset stuff here... 
	public String index() {// GET request, find password
		//if (!password2.equals(password)) {
		//	return "password_not_match";
		//}

		HttpServletResponse response = ServletActionContext.getResponse();
		//User u = UserService.getUserByFindpwid(findpwid);
		//if (u == null) {// findpwid not exist
		//	return "findpwid_not_exist";
		//}

		SimpleDateFormat dateFormat = new SimpleDateFormat(
				"yyyy-MM-dd HH:mm:ss");
		//Date findpwtime = dateFormat.parse(u.getFindpwtime());
		Date current = new Date();
		//long interval = current.getTime() - findpwtime.getTime();
		//if (interval > 60 * 60 * 1000) {// greater than 1 hour, the link is
										// invalid
			//return "findpw_link_expired";
		//}
		// reset the password
		String pwWithoutHash = password;
		SecureRandom rng = new SecureRandom();
		PasswordHashAndSalt pw = UserService
				.getPasswordHash(pwWithoutHash, rng);
		//u.setPassword(pw.getPasswordHash());
		//u.setSalt(pw.getSalt());
		//UserService.save(u);

		return "reset_password_success";
	}

	public String getPassword() {
		return password;
	}

	public void setPassword(String password) {
		this.password = password;
	}

//	public String getPassword2() {
//		return password2;
//	}
//
//	public void setPassword2(String password2) {
//		this.password2 = password2;
//	}
//
//	public String getFindpwid() {
//		return findpwid;
//	}
//
//	public void setFindpwid(String findpwid) {
//		this.findpwid = findpwid;
//	}
}
