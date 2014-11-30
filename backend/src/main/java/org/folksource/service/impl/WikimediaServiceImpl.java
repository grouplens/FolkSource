package org.folksource.service.impl;

import org.folksource.service.WikimediaService;
import org.springframework.beans.factory.annotation.Configurable;
import org.springframework.stereotype.Service;

import java.io.BufferedReader;
import java.io.DataOutputStream;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL; 

import javax.net.ssl.HttpsURLConnection;

@Service
@Configurable
public class WikimediaServiceImpl implements WikimediaService{
	 
	private final String USER_AGENT = "Mozilla/5.0";
	
	public String connect() {
		//return "Some message";
		String response = null;
		try {
			response = sendPost();
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		return response;
	}
 
	// HTTP GET request
	@SuppressWarnings("unused")
	private void sendGet() throws Exception {
 
		String url = "https://www.mediawiki.org/w/api.php?action=login&lgname=user&lgpassword=1234";
 
		URL obj = new URL(url);
		HttpURLConnection con = (HttpURLConnection) obj.openConnection();
 
		// optional default is GET
		con.setRequestMethod("GET");
 
		//add request header
		con.setRequestProperty("User-Agent", USER_AGENT);
 
		int responseCode = con.getResponseCode();
		System.out.println("\nSending 'GET' request to URL : " + url);
		System.out.println("Response Code : " + responseCode);
 
		BufferedReader in = new BufferedReader(
		        new InputStreamReader(con.getInputStream()));
		String inputLine;
		StringBuffer response = new StringBuffer();
 
		while ((inputLine = in.readLine()) != null) {
			response.append(inputLine);
		}
		in.close();
 
		//print result
		System.out.println(response.toString());
 
	}
 
	// HTTP POST request
	private String sendPost() throws Exception {
 
		//String url = "https://www.mediawiki.org/w/api.php";
		String url = "https://en.wikipedia.org/w/api.php";
		URL obj = new URL(url);
		HttpsURLConnection con = (HttpsURLConnection) obj.openConnection();
 
		//add request header
		con.setRequestMethod("POST");
		con.setRequestProperty("User-Agent", USER_AGENT);
		con.setRequestProperty("Accept-Language", "en-US,en;q=0.5");
 
		String urlParameters = "action=login&lgname=user&lgpassword=password&lgtoken=123ABC&format=json";
 
		// Send post request
		con.setDoOutput(true);
		DataOutputStream wr = new DataOutputStream(con.getOutputStream());
		wr.writeBytes(urlParameters);
		wr.flush();
		wr.close();
 
		int responseCode = con.getResponseCode();
		System.out.println("\nSending 'POST' request to URL : " + url);
		System.out.println("Post parameters : " + urlParameters);
		System.out.println("Response Code : " + responseCode);
 
		BufferedReader in = new BufferedReader(
		        new InputStreamReader(con.getInputStream()));
		String inputLine;
		StringBuffer response = new StringBuffer();
 
		while ((inputLine = in.readLine()) != null) {
			response.append(inputLine);
		}
		in.close();
 
		//print result
		System.out.println(response.toString());
		return response.toString();
 
	}
	 
	
}
