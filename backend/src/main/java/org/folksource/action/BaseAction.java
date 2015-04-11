package org.folksource.action;

import org.apache.struts2.convention.annotation.Action;
import org.apache.struts2.convention.annotation.ParentPackage;
import org.apache.struts2.convention.annotation.Result;
import org.folksource.service.ServiceHelper;

import com.opensymphony.xwork2.ActionSupport;

/**
 * Abstract base class for Struts 2 actions.
 * 
 */
@ParentPackage("folksource-norest-pkg")
public abstract class BaseAction extends ActionSupport {

	private static final long serialVersionUID = 1L;

	protected String partial;
	private ServiceHelper serviceHelper;
	
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

	public void setServiceHelper(ServiceHelper serviceHelper) {
		this.serviceHelper = serviceHelper;
	}

	public ServiceHelper getServiceHelper() {
		return serviceHelper;
	}

	
}

