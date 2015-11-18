package org.folksource.interceptors;

import java.util.Map;
import org.apache.commons.codec.binary.Base64;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

import org.apache.struts2.ServletActionContext;
import org.folksource.service.UserService;

import com.opensymphony.xwork2.ActionContext;
import com.opensymphony.xwork2.ActionInvocation;
import com.opensymphony.xwork2.interceptor.AbstractInterceptor;

import net.sourceforge.jwbf.core.contentRep.Userinfo;

import javax.xml.bind.DatatypeConverter;

public class UnSecurecdActionInterceptor extends AbstractInterceptor{
	
	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	private UserService userService;
	
	@Override
	public String intercept(ActionInvocation invocation) throws Exception {
		// TODO Auto-generated method stub
		System.out.println("UnSecured");
	    return invocation.invoke();
	}

	public UserService getUserService() {
		return userService;
	}

	public void setUserService(UserService userService) {
		this.userService = userService;
	}
}


