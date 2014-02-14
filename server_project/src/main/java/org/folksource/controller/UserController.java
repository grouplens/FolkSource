package org.folksource.controller;

import java.security.SecureRandom;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.struts2.ServletActionContext;
import org.apache.struts2.convention.annotation.Action;
import org.folksource.model.Token;
import org.folksource.model.User;
import org.folksource.model.UserDto;
import org.folksource.util.PasswordHashAndSalt;
import org.folksource.util.TokenService;
import org.folksource.util.UserService;
import org.grouplens.common.dto.DtoContainer;

import com.opensymphony.xwork2.ActionSupport;
import com.opensymphony.xwork2.ModelDriven;

//@Namespace("/")
public class UserController extends ActionSupport implements ModelDriven<DtoContainer<UserDto>> {

	private String id;
	private DtoContainer<UserDto> content = new DtoContainer<UserDto>(UserDto.class, false);

	@Override
	public DtoContainer<UserDto> getModel() {
		return content;
	}


	public String show() {//get
		HttpServletResponse res = ServletActionContext.getResponse();
//		res.addHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
		res.addHeader("Access-Control-Allow-Origin", "http://localhost:8000");
		content = new DtoContainer<UserDto>(UserDto.class, false);
		User user = UserService.getUserByName(id);
		UserDto u = new UserDto(user);
		content.set(u);
		
		return "show";
	}

	public String index() {
		HttpServletResponse res = ServletActionContext.getResponse();
//		res.addHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
		res.addHeader("Access-Control-Allow-Origin", "*");
		content = new DtoContainer<UserDto>(UserDto.class, true);
		content.set(UserDto.fromUserList(UserService.getUsers()));

		return "index";

	}

	public String create() {// deal with register
		HttpServletResponse response = ServletActionContext.getResponse();
		HttpServletRequest req = ServletActionContext.getRequest();
		response.addHeader("Access-Control-Allow-Origin", "*");
		User inUser = content.getSingle().toUser();
		User u = UserService.getUserByName(inUser.getName());
		if (u == null) {// user name doesn't exist, could register

			// hash the password and set Salt
			String pwWithoutHash = inUser.getPassword();
			SecureRandom rng = new SecureRandom();
			PasswordHashAndSalt pw = UserService.getPasswordHash(pwWithoutHash,
					rng);
			inUser.setPassword(pw.getPasswordHash());
			inUser.setSalt(pw.getSalt());
			inUser.setPoints(0);

			UserService.save(inUser);
			content.set(new UserDto(inUser));
			return "create";
		} else {
			// user name does exist, couldn't register
			response.setStatus(HttpServletResponse.SC_NOT_ACCEPTABLE);
			return "register_fail";
		}
	}

	@Action("token")
	public String token() {
		HttpServletResponse res = ServletActionContext.getResponse();
//		res.addHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
		res.addHeader("Access-Control-Allow-Origin", "http://localhost:8000");
		res.addHeader("Access-Control-Allow-Headers", "Authorization, AuthToken");
		content = new DtoContainer<UserDto>(UserDto.class, false);
		User user = UserService.getUserByName(id);
		if(user.getToken() == null) {
			Token t = TokenService.getNewToken();
			System.out.println(t.getId());
			user.setToken(t);	
		}
		
		res.setIntHeader("AuthToken", user.getToken().getToken());
		TokenService.updateTtl(user.getToken());
		
		UserService.save(user);
		System.out.println(user.getToken().getId());
		content.set(new UserDto(user));
		
		return "success";
	}

	public String options() {
		HttpServletResponse res = ServletActionContext.getResponse();
//		res.addHeader("Allow", "*");
		res.addHeader("Access-Control-Allow-Origin", "http://localhost:8000");
		res.addHeader("Access-Control-Allow-Headers", "Authorization, AuthToken");
		return "options_success";
	}

	public void setId(String id) {
		this.id = id;
	}
	public String getId() {
		return this.id;
	}

}
