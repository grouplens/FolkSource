package org.folksource.struts;

import java.sql.Timestamp;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.struts2.ServletActionContext;
import org.folksource.model.User;
import org.folksource.util.Base64;
import org.folksource.util.TokenService;
import org.folksource.util.UserService;

import com.opensymphony.xwork2.ActionInvocation;
import com.opensymphony.xwork2.ModelDriven;
import com.opensymphony.xwork2.interceptor.MethodFilterInterceptor;

@SuppressWarnings("serial")
public class AuthInterceptor extends MethodFilterInterceptor/*AbstractInterceptor /*implements ServletRequestAware*/ {
	
	@Override
	public String doIntercept(ActionInvocation invocation) throws Exception {
		try {
			HttpServletRequest req = ServletActionContext.getRequest();
			HttpServletResponse res = ServletActionContext.getResponse();
			User u;
			
			String controllerName = invocation.getAction().getClass().getSimpleName();
			String methodName = ServletActionContext.getActionMapping().getMethod();
			if((controllerName.equalsIgnoreCase("usercontroller") && methodName.equalsIgnoreCase ("create")) || req.getMethod().equalsIgnoreCase("options")) {
					System.out.println("RAWR");
					return invocation.invoke();
			}
			
			String token = req.getHeader("AuthToken");
			res.setHeader("Access-Control-Allow-Origin", "*");
			res.addHeader("Access-Control-Expose-Headers", "Authorization, AuthToken");
			res.addHeader("Access-Control-Allow-Headers", "Authorization, AuthToken");
			
			//try login token first
			if(token != null && TokenService.checkTokenExists(token)) {
				u = UserService.getUserByToken(Integer.parseInt(token));
				if(u != null)
					TokenService.updateTtl(u.getToken());
			} else {
				String tmp = req.getHeader("Authorization");
				
				//try Basic HTTP Auth
				if(tmp != null) {
					String header = tmp.split(" ", 2)[1];
					String[] whole = new String(Base64.decode(header)).split(":");
					String username = whole[0];
					String password = whole[1];
					u = UserService.getUserByName(username);
					
					//user doesn't exist or wrong password
					if (u == null || !UserService.isPasswordValid(u, password)) {
						System.out.println("WRONG PASSWORD");
                        System.out.println(u);
						return "login_fail";
					} if(u.getToken() == null)
						u.setToken(TokenService.getNewToken());
						
				} else {
					//none of the required headers
					System.out.println("NO HEADERS");
					return "login_fail";	
				}
			}
			//one of the two cases succeeded, save updated state
			UserService.save(u);
			
			//add the token to the response header
			res.addHeader("AuthToken", u.getToken().getToken().toString());
			
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
