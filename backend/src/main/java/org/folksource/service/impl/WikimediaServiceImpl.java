package org.folksource.service.impl;

import java.io.IOException;
import java.io.InputStream;
import java.io.StringWriter;

import javax.ws.rs.client.Client;
import javax.ws.rs.client.ClientBuilder;
import javax.ws.rs.core.Feature;
import javax.ws.rs.core.Response;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.transaction.annotation.Transactional;
import org.apache.commons.io.IOUtils;
import org.folksource.service.ServiceHelper;
import org.folksource.service.WikimediaService;
import org.folksource.dao.jpa.GenericJpaDao;
import org.folksource.dao.jpa.UserDao;
import org.folksource.entities.User;
import org.glassfish.jersey.client.oauth1.AccessToken;
import org.glassfish.jersey.client.oauth1.ConsumerCredentials;
import org.glassfish.jersey.client.oauth1.OAuth1AuthorizationFlow;
import org.glassfish.jersey.client.oauth1.OAuth1ClientSupport;

public class WikimediaServiceImpl implements WikimediaService {
	final static Logger logger = LoggerFactory.getLogger(WikimediaServiceImpl.class);
	private OAuth1AuthorizationFlow authFlow;
	@Autowired
	private UserDao userDao;
	
	private ServiceHelper serviceHelper;
	
	public String getAuthUri() {
		String consumerKey = serviceHelper.getAppProperties().getProperty("wiki.key");
		String consumerSecret = serviceHelper.getAppProperties().getProperty("wiki.secret");
		String wikiUrl = serviceHelper.getAppProperties().getProperty("wiki.url");
		ConsumerCredentials consumerCredentials = new ConsumerCredentials(consumerKey, consumerSecret);
		authFlow = OAuth1ClientSupport.builder(consumerCredentials)
			    .authorizationFlow(
			    	wikiUrl + "index.php?title=Special%3AOAuth%2Finitiate",
			    	wikiUrl + "index.php?title=Special%3AOAuth%2Ftoken",
			    	wikiUrl + "index.php?title=Special%3AOAuth%2Fauthorize")
			    .build();
		String authorizationUri = authFlow.start();
		this.setAuthFlow(authFlow);
		
		return authorizationUri + "&oauth_consumer_key=" + consumerKey;
	}
	
	@Transactional
	public String verify(String verifier){
		OAuth1AuthorizationFlow authFlow = this.getAuthFlow();
		
		AccessToken accessToken = authFlow.finish(verifier);
		Feature feature = authFlow.getOAuth1Feature();
		Client client = ClientBuilder.newBuilder().register(feature).build();
		
		Response resp = client.target("http://localhost:5555/mediawiki/index.php?title=Special%3AOAuth%2Fidentify").request().get();
		
		
		StringWriter writer = new StringWriter();
		try {
			IOUtils.copy((InputStream) resp.getEntity(), writer, "UTF-8");
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		String thestring = writer.toString();
		//User user = userDao.find(1);
		//user.setName("Tyler");
		
		//User newuser = new User();
		//newuser.setName("Tyler");
		//userDao.merge(user);

		//return accessToken.getAccessTokenSecret();
		return "test";
	}
	
	public OAuth1AuthorizationFlow getAuthFlow() {
		return authFlow;
	}

	public void setAuthFlow(OAuth1AuthorizationFlow authFlow) {
		this.authFlow = authFlow;
	}

	public UserDao getUserDao() {
		return userDao;
	}

	public void setUserDao(UserDao userDao) {
		this.userDao = userDao;
	}

	public ServiceHelper getServiceHelper() {
		return serviceHelper;
	}

	public void setServiceHelper(ServiceHelper serviceHelper) {
		this.serviceHelper = serviceHelper;
	}

}
