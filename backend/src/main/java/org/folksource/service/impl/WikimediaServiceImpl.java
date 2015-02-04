package org.folksource.service.impl;

import java.io.BufferedReader;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.util.ArrayList;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import net.sourceforge.jwbf.core.contentRep.Userinfo;
import net.sourceforge.jwbf.mediawiki.bots.MediaWikiBot;

import org.apache.http.HttpEntity;
import org.apache.http.HttpResponse;
import org.apache.http.NameValuePair;
import org.apache.http.client.HttpClient;
import org.apache.http.client.entity.UrlEncodedFormEntity;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.impl.client.HttpClients;
import org.apache.http.message.BasicNameValuePair;
import org.folksource.service.WikimediaService;

public class WikimediaServiceImpl implements WikimediaService{
	final static Logger logger = LoggerFactory.getLogger(WikimediaServiceImpl.class);
	private final String USER_AGENT = "Mozilla/5.0";
	
	public String connect() {
		String response1 = null;
		try {
			MediaWikiBot wikiBot = new MediaWikiBot("http://localhost:8888/");
			wikiBot.login("tdanielson", "Mfk8r8r9");
			Userinfo userinfo = wikiBot.getUserinfo();
			
			
			HttpClient httpclient = HttpClients.createDefault();
			HttpPost httppost = new HttpPost("http://localhost:8888/index.php");
			HttpGet httpget = new HttpGet("http://localhost:8888/index.php?title=Special:OAuth/initiate");
			//httpget.addHeader("Authorization","88320f3468b142e03be0f01a0ba2a4b4");

			// Request parameters and other properties.
			List<NameValuePair> params = new ArrayList<NameValuePair>(2);
			params.add(new BasicNameValuePair("Authorization", "88320f3468b142e03be0f01a0ba2a4b4"));
			//httpget.setEntity(new UrlEncodedFormEntity(params, "UTF-8"));

			//Execute and get the response.
			HttpResponse response = httpclient.execute(httpget);
			HttpEntity entity = response.getEntity();

			if (entity != null) {
			    //InputStream instream = entity.getContent();
			    String inputLine ;
		    	BufferedReader in = new BufferedReader(new InputStreamReader(entity.getContent()));
			    try {

	    	       while ((inputLine = in.readLine()) != null) {
	    	              System.out.println(inputLine);
	    	       }
	    	       
			    } finally {
			    	in.close();
			    }
			}
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		return response1;
	}
}
