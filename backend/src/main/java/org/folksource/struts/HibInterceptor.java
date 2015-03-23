package org.folksource.struts;


import org.folksource.util.HibernateUtil;
import org.hibernate.StaleStateException;

import com.opensymphony.xwork2.ActionInvocation;
import com.opensymphony.xwork2.interceptor.AbstractInterceptor;
import com.opensymphony.xwork2.interceptor.PreResultListener;

@SuppressWarnings("serial")
public class HibInterceptor extends AbstractInterceptor {
	@Override
	public String intercept(ActionInvocation invocation) throws Exception {
		try {
			invocation.addPreResultListener(new CommitResultListener());
			return invocation.invoke();
		} catch (Exception e) {
			// close this now instead of waiting for the result listener
			HibernateUtil.rollback();
			HibernateUtil.closeSession();
			throw e;
		}
	}

	private static class CommitResultListener implements PreResultListener {
		@Override
		public void beforeResult(ActionInvocation invocation, String resultCode) {
			try {
				if (HibernateUtil.isOpen())
					HibernateUtil.commit();
			} catch (StaleStateException sse) {
				throw sse;
			} finally {
				HibernateUtil.closeSession();
			}
		}
	}
}
