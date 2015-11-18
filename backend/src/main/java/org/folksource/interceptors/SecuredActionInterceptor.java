package org.folksource.interceptors;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

import org.apache.commons.codec.binary.Base64;
import org.apache.struts2.ServletActionContext;
import org.folksource.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;

import com.opensymphony.xwork2.ActionContext;
import com.opensymphony.xwork2.ActionInvocation;
import com.opensymphony.xwork2.interceptor.AbstractInterceptor;

public class SecuredActionInterceptor extends AbstractInterceptor{

	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	
	@Autowired
	private UserService userService;

	@Override
	public String intercept(ActionInvocation invocation) throws Exception {
		// TODO Auto-generated method stub
		System.out.println("Secured");
		
		final ActionContext context = invocation.getInvocationContext();
	    HttpServletRequest request = (HttpServletRequest) context.get(ServletActionContext.HTTP_REQUEST);
	    HttpSession session = request.getSession(true);
	    session.setAttribute("username", "jts_test");
	    String basicAuth = request.getHeader("Authorization");
	    if(basicAuth == null){
	    	System.out.println("Not logged in");
	    	return invocation.invoke();
	    }
	    byte[] decodedBytes = Base64.decodeBase64(basicAuth.getBytes());
	    String pair = new String(decodedBytes);
	    String namepass[] = pair.split(":");

	    if(userService.verifyUser(namepass[0], namepass[1])){
	    	try {
	    		return invocation.invoke();
	    	} catch(Exception e) {
				System.out.println("Error " + e);
				return null;
			}
	    } else {
	    	return null;
	    }
	}

	public UserService getUserService() {
		return userService;
	}

	public void setUserService(UserService userService) {
		this.userService = userService;
	}

}
