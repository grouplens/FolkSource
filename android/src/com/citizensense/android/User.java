/* Copyright (c) 2006-2011 Regents of the University of Minnesota.
   For licensing terms, see the file LICENSE.
 */

package com.citizensense.android;

import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.util.ArrayList;
import java.util.List;

import org.apache.http.Header;
import org.apache.http.HttpResponse;
import org.apache.http.NameValuePair;
import org.apache.http.client.entity.UrlEncodedFormEntity;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.impl.client.DefaultHttpClient;
import org.apache.http.message.BasicNameValuePair;
import org.json.JSONObject;
import org.w3c.dom.Document;

import android.os.Parcel;

import com.citizensense.android.conf.Constants;

/**
 * This class defines the logged in user. Not sure yet what to do with anonymous
 * users. Login credentials should be received from the server and handled
 * safely, similar to how Cyclopath works - with tokens, etc.
 * 
 * @author Phil Brown
 * @author Renji Yu
 */
public class User implements Item {
	/** The user's username */
	private String username;
	/** The token retrieved from the server */
	private String token;
	
	/** Cookie get from server after successfully login or register*/
	private String cookie;
	
	/** The root URL of the server. */
	private String base_url = "http://134.84.74.107:9080";
	
	/** The URL for login post. */
	private String login_url = base_url+"/citizensense/login";
	
	/** The URL for register post. */
	private String register_url = base_url+"/citizensense/user";
	
	/**
	 * A list of the ids associated with campaigns in which this user is
	 * participating.
	 */
	private ArrayList<String> campaign_ids;
	/** this user's incentives */
	private Incentive incentive;
	/** this user's id */
	public int id;
	/** This is used with the {@link Incentive#LEADERBOARD leaderboard}. */
	public int score;

	/**
	 * The empty constructor creates a new, empty user and initializes
	 * variables.
	 */
	public User() {
		// username = "";
		token = "";
		campaign_ids = new ArrayList<String>();
	}// User

	/**
	 * Login to the App. For now, this simply sets some static variables, but
	 * should instead interact with the server
	 */
	public int login(String username, String password) {
		this.username = username;
		CitizenSense.username.setText(username);
		// TODO save login across sessions (include Token)
		// Editor e = G.memory.edit();
		// e.putString("username", username);
		// e.commit();
		campaign_ids.add("1");
		campaign_ids.add("2");

		return loginCheck(username,password);

	}// login
	
	/**
	 * Register a new account for the user.
	 */
	public int register(String username, String password) {
		this.username = username;
		CitizenSense.username.setText(username);
		campaign_ids.add("1");
		campaign_ids.add("2");

		return registerCheck(username,password);
	}// login
	
	/** 
	 * Check the login status
	 */
	private int loginCheck(String username, String password) {
		DefaultHttpClient mHttpClient = new DefaultHttpClient();
		HttpPost httpPost = new HttpPost(login_url);
		List<NameValuePair> pairs = new ArrayList<NameValuePair>();
		pairs.add(new BasicNameValuePair("id", null));
		pairs.add(new BasicNameValuePair("name", username));
		pairs.add(new BasicNameValuePair("password", password));
		try {
			httpPost.setEntity(new UrlEncodedFormEntity(pairs));
		} catch (UnsupportedEncodingException e1) {
			e1.printStackTrace();
		}
		try {
			HttpResponse response = mHttpClient.execute(httpPost);
			int res = response.getStatusLine().getStatusCode();
			if (res == 200) {//HttpServletResponse.SC_OK
				Header[] headers = response.getAllHeaders();
				for(Header header : headers ){
					if(header.getName().contains("Cookie")){
						this.setCookie(header.getValue());
					}
				}
				 return Constants.LOGIN_SUCCESS;
			} else if(res == 417){//HttpServletResponse.SC_EXPECTATION_FAILED
					return Constants.LOGIN_WRONG_PASSWORD;
			}
		} catch (IOException e) {
			e.printStackTrace();
		}
		return Constants.LOGIN_NO_USERNAME;
	}
	
	/**
	 * Check the register status
	 */
	private int registerCheck(String username, String password) {
		DefaultHttpClient mHttpClient = new DefaultHttpClient();
		HttpPost httpPost = new HttpPost(register_url);
		List<NameValuePair> pairs = new ArrayList<NameValuePair>();
		pairs.add(new BasicNameValuePair("id", null));
		pairs.add(new BasicNameValuePair("name", username));
		pairs.add(new BasicNameValuePair("password", password));
		try {
			httpPost.setEntity(new UrlEncodedFormEntity(pairs));
		} catch (UnsupportedEncodingException e1) {
			e1.printStackTrace();
		}
		try {
			HttpResponse response = mHttpClient.execute(httpPost);
			int res = response.getStatusLine().getStatusCode();
			if (res == 200) {
				Header[] headers = response.getAllHeaders();
				for(Header header : headers ){
					if(header.getName().contains("Cookie")){
						this.setCookie(header.getValue());
					}
				}
				return Constants.REGISTRATION_SUCCESS;
			}
		} catch (IOException e) {
			e.printStackTrace();
		}
		return Constants.REGISTRATION_FAILURE;
	}

	/** gets the username */
	public String getUsername() {
		return username;
	}// getUsername

	public void setUsername(String username) {
		this.username = username;
	}// setUsername

	public void setScore(int score) {
		this.score = score;
	}// setScore

	public void setId(int id) {
		this.id = id;
	}// setId

	/** Get the campaign ids for the campaigns this user participates in. */
	public ArrayList<String> getCampaignIDs() {
		return campaign_ids;
	}// getCampaignIDs

	@Override
	public int describeContents() {
		// TODO Auto-generated method stub
		return 0;
	}

	@Override
	public void writeToParcel(Parcel dest, int flags) {
		// TODO Auto-generated method stub

	}

	@Override
	public String buildXML() {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public void createFromXML(Document document) {
		// TODO Auto-generated method stub

	}

	@Override
	public void createFromXML(String string) {

	}

	@Override
	public String buildJSON() {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public void createFromJSON(JSONObject object) {
		// TODO Auto-generated method stub

	}

	@Override
	public String getItemName() {
		return "user";
	}// getItemName

	public void setCookie(String cookie) {
		this.cookie = cookie;
	}

	public String getCookie() {
		return cookie;
	}

}// User
