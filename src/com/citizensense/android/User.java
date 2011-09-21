package com.citizensense.android;

import java.util.ArrayList;

/**
 * This class defines the logged in user. Not sure yet what to do with
 * anonymous users. Login credentials should be received from the server and
 * handled safely, similar to how Cyclopath works - with tokens, etc.
 * @author Phil Brown
 */
public class User {
	private String username;
	private String token;
	/** A list of the ids associated with campaigns in which this user is
	 * participating. */
	private ArrayList<String> campaign_ids;
	
	public User() {
		username = "";
		token = "";
		campaign_ids = new ArrayList<String>();
	}
	
	public void login(String username, String password) {
		//TODO login with server, get info, etc.
		this.username = "Phil";
		campaign_ids.add("unique_server_id_01");
	}
	
	public String getUsername(String token) {//Should this method exist? Do we need to get the token?
		return username;
	}
	
	public ArrayList<String> getCampaignIDs() {
		return campaign_ids;
	}
	
	//public ArrayList<Campaign> getCampaigns() {
		//TODO get campaignById - from the databse.
	//}
	
	
}
