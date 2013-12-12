package org.folksource.struts;

import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.struts2.ServletActionContext;
import org.apache.struts2.interceptor.ServletRequestAware;
import org.folksource.model.User;
import org.folksource.util.Base64;
import org.folksource.util.UserService;
import org.hibernate.StaleStateException;

import com.opensymphony.xwork2.ActionContext;
import com.opensymphony.xwork2.ActionInvocation;
import com.opensymphony.xwork2.interceptor.AbstractInterceptor;
import com.opensymphony.xwork2.interceptor.MethodFilterInterceptor;
import com.opensymphony.xwork2.interceptor.PreResultListener;

@SuppressWarnings("serial")
public class AuthInterceptor extends MethodFilterInterceptor/*AbstractInterceptor /*implements ServletRequestAware*/ {
	
	@Override
	public String doIntercept(ActionInvocation invocation) throws Exception {
		try {
			HttpServletRequest req = ServletActionContext.getRequest();
			System.out.println(req.getHeader("Authorization"));
			String header = new String(req.getHeader("Authorization")).split(" ", 2)[1];
			System.out.println(header);
			byte[] arr = Base64.decode(header);
			String[] whole = new String(arr).split(":");
			System.out.println(whole[0] + " " + whole[1]);
			String username = whole[0];
			String password = whole[1];
			
			User u = UserService.getUserByName(username);
			
			if (u == null || !UserService.isPasswordValid(u, password)) //fail
				return "login_fail";
			else
				return invocation.invoke();
		} catch (Exception e) {
			// close this now instead of waiting for the result listener
			throw e;
		}
	}

//	@Override
//	public void setServletRequest(HttpServletRequest request) {
//		this.req = request;
//	}

//	private static class CommitResultListener implements PreResultListener {
//		@Override
//		public void beforeResult(ActionInvocation invocation, String resultCode) {
//			try {
//				if (HibernateUtil.isOpen())
//					HibernateUtil.commit();
//			} catch (StaleStateException sse) {
//				throw sse;
//			} finally {
//				HibernateUtil.closeSession();
//			}
//		}
//	}
}
