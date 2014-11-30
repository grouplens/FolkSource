package org.folksource.action.wikimedia;

import org.apache.struts2.convention.annotation.Action;
import org.apache.struts2.convention.annotation.ParentPackage;
import org.apache.struts2.convention.annotation.Result;
import org.folksource.service.WikimediaService;
import org.folksource.service.impl.WikimediaServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;

import com.opensymphony.xwork2.ActionSupport;

/*
 * Would be nice to have a base abstract class for all actions.
 */

@ParentPackage("folksource-norest-pkg")
public class WikimediaAction extends ActionSupport /*implements SessionAware */{

	/**
	 * 
	 */
	private String token;
	//@Autowired
	//private WikimediaService wikimediaService;
	
	private static final long serialVersionUID = 1L;

	@Action(value="connect", results = {
		@Result(name = SUCCESS, type="json", params = {"root","token"})
	})
	public String connect() {
		//token = "coke-cola";
		WikimediaService wikimediaService = new WikimediaServiceImpl();
		token = wikimediaService.connect();
		return SUCCESS;
	}

	public String getToken() {
		return token;
	}

	public void setToken(String token) {
		this.token = token;
	}

//	public WikimediaService getWikimediaService() {
//		return wikimediaService;
//	}
//
//	public void setWikimediaService(WikimediaService wikimediaService) {
//		this.wikimediaService = wikimediaService;
//	}
	
}
