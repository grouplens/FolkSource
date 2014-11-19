package org.folksource.action.wikimedia;

import org.apache.struts2.convention.annotation.Action;
import org.apache.struts2.convention.annotation.ParentPackage;
import org.apache.struts2.convention.annotation.Result;
import org.folksource.service.WikimediaService;

import com.opensymphony.xwork2.ActionSupport;

/*
 * Would be nice to have a base abstract class for all actions.
 */

@ParentPackage("unsecured-pkg")
public class WikimediaAction extends ActionSupport /*implements SessionAware */{

	/**
	 * 
	 */
	private String token;
	private WikimediaService wikimediaService;
	
	private static final long serialVersionUID = 1L;

	@Action(value="connect", results = {
		@Result(name = SUCCESS, type="json", params = {"root","token"})
	})
	public String connect() {
		token = wikimediaService
		return SUCCESS;
	}

	public String getToken() {
		return token;
	}

	public void setToken(String token) {
		this.token = token;
	}

	public WikimediaService getWikimediaService() {
		return wikimediaService;
	}

	public void setWikimediaService(WikimediaService wikimediaService) {
		this.wikimediaService = wikimediaService;
	}
	
}
