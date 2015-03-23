package org.folksource.service;

import java.util.Properties;

public class ServiceHelper {

	private Properties appProperties;

	public void setAppProperties(Properties props) {
		appProperties = props;
	}
	
	public Properties getAppProperties() {
		return appProperties;
	}
}
