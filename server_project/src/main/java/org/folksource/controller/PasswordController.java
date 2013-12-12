package org.folksource.controller;

import java.security.SecureRandom;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;

import javax.servlet.http.HttpServletResponse;

import org.apache.struts2.ServletActionContext;
import org.folksource.model.User;
import org.folksource.util.PasswordHashAndSalt;
import org.folksource.util.UserService;

/**
 * This class deals with reseting password.
 * 
 * @author Renji Yu
 * 
 * */

public class PasswordController {
	private String password;
	private String password2;
	private String findpwid;

	public String index() {// GET request, find password
		if (!password2.equals(password)) {
			return "password_not_match";
		}

		HttpServletResponse response = ServletActionContext.getResponse();
		User u = UserService.getUserByFindpwid(findpwid);
		if (u == null) {// findpwid not exist
			return "findpwid_not_exist";
		}

		SimpleDateFormat dateFormat = new SimpleDateFormat(
				"yyyy-MM-dd HH:mm:ss");
		try {
			Date findpwtime = dateFormat.parse(u.getFindpwtime());
			Date current = new Date();
			long interval = current.getTime() - findpwtime.getTime();
			if (interval > 60 * 60 * 1000) {// greater than 1 hour, the link is
											// invalid
				return "findpw_link_expired";
			}

		} catch (ParseException e) {
			e.printStackTrace();
		}
		// reset the password
		String pwWithoutHash = password;
		SecureRandom rng = new SecureRandom();
		PasswordHashAndSalt pw = UserService
				.getPasswordHash(pwWithoutHash, rng);
		u.setPassword(pw.getPasswordHash());
		u.setSalt(pw.getSalt());
		UserService.save(u);

		return "reset_password_success";
	}

	public String getPassword() {
		return password;
	}

	public void setPassword(String password) {
		this.password = password;
	}

	public String getPassword2() {
		return password2;
	}

	public void setPassword2(String password2) {
		this.password2 = password2;
	}

	public String getFindpwid() {
		return findpwid;
	}

	public void setFindpwid(String findpwid) {
		this.findpwid = findpwid;
	}

}
