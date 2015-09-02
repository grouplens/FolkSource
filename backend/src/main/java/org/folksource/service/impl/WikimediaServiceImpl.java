package org.folksource.service.impl;

import java.io.IOException;
import java.io.InputStream;
import java.io.StringWriter;
import java.security.Key;

import javax.crypto.SecretKeyFactory;
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
import org.jose4j.jwe.JsonWebEncryption;
import org.jose4j.jwt.JwtClaims;
import org.jose4j.jwt.consumer.InvalidJwtException;
import org.jose4j.jwt.consumer.JwtConsumer;
import org.jose4j.jwt.consumer.JwtConsumerBuilder;
import org.jose4j.lang.JoseException;

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
		String wikiUrl = serviceHelper.getAppProperties().getProperty("wiki.url");
		String consumerKey = serviceHelper.getAppProperties().getProperty("wiki.key");
		
		AccessToken accessToken = authFlow.finish(verifier);
		Feature feature = authFlow.getOAuth1Feature();
		Client client = ClientBuilder.newBuilder().register(feature).build();
		
		Response resp = client.target(wikiUrl + "index.php?title=Special%3AOAuth%2Fidentify").request().get();
		
		
		StringWriter writer = new StringWriter();
		try {
			IOUtils.copy((InputStream) resp.getEntity(), writer, "UTF-8");
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		String thestring = writer.toString();
		
		JwtConsumer jwtConsumer = new JwtConsumerBuilder()
	            .setRequireExpirationTime() // the JWT must have an expiration time
	            .setAllowedClockSkewInSeconds(30) // allow some leeway in validating time based claims to account for clock skew
	            .setRequireSubject() // the JWT must have a subject claim
	            .setExpectedIssuer("Issuer") // whom the JWT needs to have been issued by
	            .setExpectedAudience("Audience") // to whom the JWT is intended for
	            //.setVerificationKey(factory) // verify the signature with the public key
	            .build(); 
		
		try
	    {
	        //  Validate the JWT and process it to the Claims
	        JwtClaims jwtClaims = jwtConsumer.processToClaims(thestring);
	        System.out.println("JWT validation succeeded! " + jwtClaims);
	    }
	    catch (InvalidJwtException e)
	    {
	        // InvalidJwtException will be thrown, if the JWT failed processing or validation in anyway.
	        // Hopefully with meaningful explanations(s) about what went wrong.
	        System.out.println("Invalid JWT! " + e);
	    }
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
