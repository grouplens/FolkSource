package org.folksource.controller;

import java.security.SecureRandom;
import java.text.DateFormat;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.struts2.ServletActionContext;
import org.apache.struts2.convention.annotation.Action;
import org.apache.struts2.convention.annotation.Namespace;
import org.folksource.model.LocationDto;
import org.folksource.model.User;
import org.folksource.model.UserDetailDto;
import org.folksource.util.PasswordHashAndSalt;
import org.folksource.util.UserService;
import org.grouplens.common.dto.DtoContainer;

import com.opensymphony.xwork2.ModelDriven;

//@Namespace("/")
public class _UserController implements ModelDriven<User> {

	User user = new User();
	// private int id;
	public String name;
	private String password;
	private String salt;
	public String email;
	private String findpwid;
	public String token;

	// private Collection<User> list;

	private DtoContainer<User> content = new DtoContainer<User>(User.class, true);
	
	@Override
	public User getModel() {
		return content.getSingle();
	}

	// public void setId(String id) {
	// if (id != null)
	// this.user = UserService.findUser(Integer.parseInt(id));
	// if(this.user != null)
	// this.id = Integer.parseInt(id);
	// }
	//
	// public int getId() {
	// return this.id;
	// }

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

	public void setEmail(String email) {
		this.email = email;
	}

	public String getEmail() {
		return email;
	}

	public void setFindpwid(String findpwid) {
		this.findpwid = findpwid;
	}

	public String getFindpwid() {
		return findpwid;
	}

	 public String show() {//get
		 return "show";
	 }
	//
	//
	//
	// public HttpHeaders index() {
	// list = UserService.getUsers();
	// return new DefaultHttpHeaders("index").disableCaching();
	// }
	// public HttpHeaders create() {//deal with register
	// UserService.save(user);
	// return new DefaultHttpHeaders("create");
	// }
	
	public String create() {// deal with register
		HttpServletResponse response = ServletActionContext.getResponse();
		HttpServletRequest req = ServletActionContext.getRequest();
		response.addHeader("Access-Control-Allow-Origin", "*");
		User u = UserService.getUserByName(user.getName());
		if (u == null) {// user name doesn't exist, could register

			// hash the password and set Salt
			String pwWithoutHash = user.getPassword();
			SecureRandom rng = new SecureRandom();
			PasswordHashAndSalt pw = UserService.getPasswordHash(pwWithoutHash,
					rng);
			user.setPassword(pw.getPasswordHash());
			user.setSalt(pw.getSalt());
			user.setPoints(0);

			UserService.save(user);
			response.setStatus(HttpServletResponse.SC_OK);
//			response.addIntHeader("X-Points", 0);
			//may not work
//			response.addIntHeader("X-Uid", user.getId());
			req.setAttribute("uid", user.getId());
			req.setAttribute("points", user.getPoints());
			req.setAttribute("name", user.getName());
			return "register_success";
		} else {
			// user name does exist, couldn't register
			response.setStatus(HttpServletResponse.SC_NOT_ACCEPTABLE);
			return "register_fail";
		}
	}
	
	public String update() {
		HttpServletRequest req = ServletActionContext.getRequest();

		
		
		return "update";
	}
	
	public String options() {
		HttpServletResponse res = ServletActionContext.getResponse();
		res.addHeader("Allow", "*");
		res.addHeader("Access-Control-Allow-Origin", "*");
//		res.addHeader("Access-Control-Expose-Headers", "X-Points");
//		res.addHeader("Access-Control-Expose-Headers", "X-Uid");
////		res.addHeader("Access-Control-Allow-Methods", "GET, POST");
//		res.addHeader("Access-Control-Allow-Headers", "X-Points");
//		res.addHeader("Access-Control-Allow-Headers", "X-Uid"); \\
		res.addHeader("Access-Control-Allow-Headers", "Content-Type");
		res.addHeader("Access-Control-Allow-Headers", "Cache-Control");
		return "options_success";
	}
	

}
