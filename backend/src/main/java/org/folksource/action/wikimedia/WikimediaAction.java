package org.folksource.action.wikimedia;

import java.io.File;

import org.apache.struts2.convention.annotation.Action;
import org.apache.struts2.convention.annotation.ParentPackage;
import org.apache.struts2.convention.annotation.Result;
import org.folksource.action.BaseAction;
import org.folksource.service.WikimediaService;

/*
 * Would be nice to have a base abstract class for all actions.
 */


public class WikimediaAction extends BaseAction /*implements SessionAware */{

	protected String partial;
	
	private String response;
	private WikimediaService wikimediaService;
	private String oauth_verifier;
	private String oauth_token;
	private String username;
	private File upload;

	private static final long serialVersionUID = 1L;

	@Action(value = "app", results = { @Result(name = SUCCESS, location = "oauth.jsp") })
	public String home() {
		return SUCCESS;
	}
	
	@Action(value="authuri", results = {
		@Result(name = SUCCESS, type="json", params = {"root","response"})
	})
	public String connect() {
		response = wikimediaService.getAuthUri(username);
		return SUCCESS;
	}

	@Action(value="callback/verified", results = {
		@Result(name = SUCCESS, location="${response}", type="redirect")
	})
	public String callback() {
		wikimediaService.verify(oauth_verifier, oauth_token);
		//response = "http://69.164.193.47/bootplate/debug.html";
		response = "http://localhost:8081/bootplate/debug.html";
		return SUCCESS;
	}
	
	@Action(value="upload", results = {
		@Result(name = SUCCESS, type="json", params = {"root","response"})
	})
	public String photoupload() {
		wikimediaService.uploadPhoto("jts_test", upload);
		return SUCCESS;
	}
	
	public String getResponse() {
		return response;
	}

	public void setResponse(String response) {
		this.response = response;
	}

	public WikimediaService getWikimediaService() {
		return wikimediaService;
	}

	public void setWikimediaService(WikimediaService wikimediaService) {
		this.wikimediaService = wikimediaService;
	}

	public String getOauth_verifier() {
		return oauth_verifier;
	}

	public void setOauth_verifier(String oauth_verifier) {
		this.oauth_verifier = oauth_verifier;
	}

	public String getOauth_token() {
		return oauth_token;
	}

	public void setOauth_token(String oauth_token) {
		this.oauth_token = oauth_token;
	}

	public String getUsername() {
		return username;
	}

	public void setUsername(String username) {
		this.username = username;
	}

	public File getUpload() {
		return upload;
	}

	public void setUpload(File upload) {
		this.upload = upload;
	}
	
}
