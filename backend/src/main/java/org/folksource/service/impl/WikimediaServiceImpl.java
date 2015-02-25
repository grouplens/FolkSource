package org.folksource.service.impl;

import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.util.Properties;

import javax.ws.rs.core.Configuration;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.folksource.service.WikimediaService;
import org.glassfish.jersey.client.ClientRequest;
import org.glassfish.jersey.client.oauth1.AccessToken;
import org.glassfish.jersey.client.oauth1.ConsumerCredentials;
import org.glassfish.jersey.client.oauth1.OAuth1AuthorizationFlow;
import org.glassfish.jersey.client.oauth1.OAuth1ClientSupport;
import org.glassfish.jersey.oauth1.signature.OAuth1Parameters;
import org.glassfish.jersey.oauth1.signature.OAuth1SignatureMethod;

public class WikimediaServiceImpl implements WikimediaService {
	final static Logger logger = LoggerFactory.getLogger(WikimediaServiceImpl.class);
	private OAuth1AuthorizationFlow authFlow;
	 private static final Properties PROPERTIES = new Properties();
    private static final String PROPERTIES_FILE_NAME = "wikiclient.properties";
    private static final String PROPERTY_CONSUMER_KEY = "consumerKey";
    private static final String PROPERTY_CONSUMER_SECRET = "consumerSecret";
    private static final String PROPERTY_TOKEN = "token";
    private static final String PROPERTY_TOKEN_SECRET = "tokenSecret";
	
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
		OAuth1Parameters params = new OAuth1Parameters();
		params.signature(consumerKey);
		
		//PROPERTIES.getProperty(PROPERTY_CONSUMER_SECRET);
		
		
		return authorizationUri + "&oauth_consumer_key=" + consumerKey;
	}
	
	public void verify(String verifier){

		AccessToken accessToken = authFlow.finish(verifier);
	}

    private static void loadSettings() {
        FileInputStream st = null;
        try {
            st = new FileInputStream(PROPERTIES_FILE_NAME);
            PROPERTIES.load(st);
        } catch (final IOException e) {
            // ignore
        } finally {
            if (st != null) {
                try {
                    st.close();
                } catch (final IOException ex) {
                    // ignore
                }
            }
        }

        for (final String name : new String[]{PROPERTY_CONSUMER_KEY, PROPERTY_CONSUMER_SECRET,
                PROPERTY_TOKEN, PROPERTY_TOKEN_SECRET}) {
            final String value = System.getProperty(name);
            if (value != null) {
                PROPERTIES.setProperty(name, value);
            }
        }

        if (PROPERTIES.getProperty(PROPERTY_CONSUMER_KEY) == null
                || PROPERTIES.getProperty(PROPERTY_CONSUMER_SECRET) == null) {
            System.out.println("No consumerKey and/or consumerSecret found in twitterclient.properties file. "
                    + "You have to provide these as system properties. See README.html for more information.");
            System.exit(1);
        }
    }

    private static void storeSettings() {
        FileOutputStream st = null;
        try {
            st = new FileOutputStream(PROPERTIES_FILE_NAME);
            PROPERTIES.store(st, null);
        } catch (final IOException e) {
            // ignore
        } finally {
            try {
                if (st != null) {
                    st.close();
                }
            } catch (final IOException ex) {
                // ignore
            }
        }
    }
	
	public OAuth1AuthorizationFlow getAuthFlow() {
		return authFlow;
	}

	public void setAuthFlow(OAuth1AuthorizationFlow authFlow) {
		this.authFlow = authFlow;
	}
}
