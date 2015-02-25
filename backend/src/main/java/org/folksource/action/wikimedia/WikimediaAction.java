package org.folksource.action.wikimedia;

import org.apache.struts2.convention.annotation.Action;
import org.apache.struts2.convention.annotation.ParentPackage;
import org.apache.struts2.convention.annotation.Result;
import org.folksource.service.WikimediaService;

import com.opensymphony.xwork2.ActionSupport;

/*
 * Would be nice to have a base abstract class for all actions.
 */

@ParentPackage("folksource-norest-pkg")
public class WikimediaAction extends ActionSupport /*implements SessionAware */{

	protected String partial;
	
	private Message response;
	private WikimediaService wikimediaService;
	private String verifier;

	private static final long serialVersionUID = 1L;

	@Action(value = "app", results = { @Result(name = SUCCESS, location = "oauth.jsp") })
	public String home() {
		return SUCCESS;
	}
	
	@Action(value="authuri", results = {
		@Result(name = SUCCESS, type="json", params = {"root","response"})
	})
	public String connect() {
		Message resp = new Message();
		resp.setMessage(wikimediaService.getAuthUri());
		response = resp;
		return SUCCESS;
	}

	@Action(value="callback/verified", results = {
		@Result(name = SUCCESS, type="json", params = {"root","response"})
	})
	public String callback() {
		//Response resp = new Response();
		wikimediaService.verify(verifier);
		return SUCCESS;
	}
	
	@Action(value = "partial", results = { @Result(name = SUCCESS, location = "${partial}") })
	public String partial() {
		partial = "partials/" + partialsMapper(getPartial());
		return SUCCESS;
	}
	
	public String getPartial() {
		return partial;
	}
	
	public void setPartial(String partial) {
		this.partial = partial;
	}

	protected String partialsMapper(String source) {
		return source;
	}

	public Message getResponse() {
		return response;
	}

	public void setResponse(Message response) {
		this.response = response;
	}

	public WikimediaService getWikimediaService() {
		return wikimediaService;
	}

	public void setWikimediaService(WikimediaService wikimediaService) {
		this.wikimediaService = wikimediaService;
	}

	public String getVerifier() {
		return verifier;
	}

	public void setVerifier(String verifier) {
		this.verifier = verifier;
	}
	
}
