package org.folksource.util;

import javax.servlet.http.HttpServletRequest;
import org.apache.struts2.dispatcher.mapper.ActionMapper;
import org.apache.struts2.dispatcher.mapper.ActionMapping;
import org.apache.struts2.dispatcher.mapper.DefaultActionMapper;
import com.opensymphony.xwork2.config.ConfigurationManager;

public class CustomActionMapper extends DefaultActionMapper {

	public ActionMapping getMapping(HttpServletRequest request, ConfigurationManager configManager) {
		return getActionMapper(request, configManager).getMapping(request, configManager);
	}

	private ActionMapper getActionMapper(HttpServletRequest request, ConfigurationManager configManager) {

		ActionMapping actionMapping = new ActionMapping();  
		parseNameAndNamespace(request.getRequestURI(), actionMapping, configManager);

		if (!(actionMapping.getNamespace()).contains("/rest")) {

			return container.getInstance(ActionMapper.class, "struts");
		} else {
			return container.getInstance(ActionMapper.class, "rest");
		}
	}
}


