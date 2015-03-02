package org.folksource.service.impl;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.folksource.service.WikimediaService;
import org.forksource.entities.User;
import org.glassfish.jersey.client.oauth1.AccessToken;
import org.glassfish.jersey.client.oauth1.ConsumerCredentials;
import org.glassfish.jersey.client.oauth1.OAuth1AuthorizationFlow;
import org.glassfish.jersey.client.oauth1.OAuth1ClientSupport;

public class WikimediaServiceImpl implements WikimediaService {
	final static Logger logger = LoggerFactory.getLogger(WikimediaServiceImpl.class);
	private OAuth1AuthorizationFlow authFlow;
	
	public String getAuthUri() {
		String consumerKey = "1048fb96026e256cb6efa76d7ab198b3";
		String consumerSecret = "d62c6c875d7c501dc90301fde56c982a84463e9c";
		
		ConsumerCredentials consumerCredentials = new ConsumerCredentials(consumerKey, consumerSecret);
		authFlow = OAuth1ClientSupport.builder(consumerCredentials)
			    .authorizationFlow(
			        "http://localhost:5555/mediawiki/index.php?title=Special%3AOAuth%2Finitiate",
			        "http://localhost:5555/mediawiki/index.php?title=Special%3AOAuth%2Ftoken",
			        "http://localhost:5555/mediawiki/index.php?title=Special%3AOAuth%2Fauthorize")
			    .build();
		String authorizationUri = authFlow.start();
		this.setAuthFlow(authFlow);
		
		return authorizationUri + "&oauth_consumer_key=" + consumerKey;
	}
	
	public String verify(String verifier){

		AccessToken accessToken = this.getAuthFlow().finish(verifier);
		User user = new User();
		
		
		return accessToken.getAccessTokenSecret();
		
	}
	
	public OAuth1AuthorizationFlow getAuthFlow() {
		return authFlow;
	}

	public void setAuthFlow(OAuth1AuthorizationFlow authFlow) {
		this.authFlow = authFlow;
	}
}
