package org.citizensense.controller;

import java.text.SimpleDateFormat;
import java.util.Date;

import javax.servlet.http.HttpServletResponse;

import org.apache.commons.codec.digest.DigestUtils;
import org.apache.commons.mail.EmailException;
import org.apache.commons.mail.SimpleEmail;
import org.apache.struts2.ServletActionContext;
import org.citizensense.model.User;
import org.citizensense.util.UserService;

import com.opensymphony.xwork2.ModelDriven;

/**
 * This class deals with sending email.
 * 
 * @author Renji Yu
 * 
 * */
public class EmailController implements ModelDriven<User>{
	User user = new User();
	String email;
	String findpwid;
	String findpwtime;


	// FIXME: change this to ugly url
	public static String findpwURL = "http://ugly.cs.umn.edu:8080/csense/findpassword.jsp?findpwid=";

	
	@Override
	public User getModel() {
		return user;
	}
	
	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	public String getFindpwid() {
		return findpwid;
	}

	public void setFindpwid(String findpwid) {
		this.findpwid = findpwid;
	}
	
	public String getFindpwtime() {
		return findpwtime;
	}

	public void setFindpwtime(String findpwtime) {
		this.findpwtime = findpwtime;
	}
	
	/**
	 * Handles post request.
	 */
	public String create() {
		HttpServletResponse response = ServletActionContext.getResponse();
		response.addHeader("Access-Control-Allow-Origin", "*");
		User u = UserService.getUserByEmail(user.getEmail());

		if (u == null) {// if email not exist in the db
			return "email_not_exist";
		}

		String subject = "Find your password";
		String link = constructLink(u);
		String content = constructContent(u,link);
		UserService.save(u);
		
		return sendEmail(subject, content);
	}

	private String sendEmail(String subject, String content) {
		SimpleEmail email = new SimpleEmail();
		try {
			// FIXME: should be replaced by cs mail smtp
			email.setTLS(true);
			// set email server and port
			email.setHostName("smtp.gmail.com");
			email.setSmtpPort(587);
			email.addTo(user.getEmail(), "Citizen Sense user");
			//email.setFrom("yurenji@gmail.com", "Citizen Sense");
			//email.setAuthentication("", "");
			
			email.setSubject(subject);
			email.setMsg(content);
			email.send();
		} catch (EmailException e) {
			e.printStackTrace();
			return "send_email_fail";
		}
		return "send_email_success";

	}

	/** Create find password link. */
	private String constructLink(User u){
		SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
		Date now = new Date();
		findpwtime = dateFormat.format(now); //set findpwtime to current time
		u.setFindpwtime(findpwtime);
		String idPlusTime = u.getId()+" "+findpwtime;
		//hashed value of the string id+time
		findpwid = DigestUtils.md5Hex(idPlusTime);
		u.setFindpwid(findpwid);
		return findpwURL+findpwid;
	}

	
	/** Construct the email content send to the user. */
	private String constructContent(User u, String link) {
		return "Hello " + u.getName() + ":\n\n"
				+ "This is the link to reset your password:\n"
				+ link + "\n"
				+ "It will expire in 1 hour, please reset your password soon.\n"
				+ "Regards,\n\n" + "Citizen Sense";
	}


}
