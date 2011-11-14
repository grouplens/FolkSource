/* Copyright (c) 2006-2011 Regents of the University of Minnesota.
   For licensing terms, see the file LICENSE.
 */

package com.citizensense.android;

import java.util.ArrayList;

import org.json.JSONObject;
import org.w3c.dom.Document;

import android.os.Parcel;

/**
 * This class defines the logged in user. Not sure yet what to do with
 * anonymous users. Login credentials should be received from the server and
 * handled safely, similar to how Cyclopath works - with tokens, etc.
 * @author Phil Brown
 */
public class User implements Item {
	/** The user's username*/
	private String username;
	/** The token retrieved from the server*/
	private String token;
	/** A list of the ids associated with campaigns in which this user is
	 * participating. */
	private ArrayList<String> campaign_ids;
	
	/** The empty constructor creates a new, empty user and initializes 
	 * variables.*/
	public User() {
		username = "";
		token = "";
		campaign_ids = new ArrayList<String>();
	}//User
	
	/** Login to the App. For now, this simply sets some static variables, but
	 * should instead interact with the server*/
	public void login(String username, String password) {
		//TODO login with server, get info, etc.
		this.username = "Phil";
		campaign_ids.add("1");
		campaign_ids.add("2");
	}//login
	
	/** gets the username*/
	public String getUsername() {
		return username;
	}//getUsername
	
	/** Get the campaign ids for the campaigns this user participates in.*/
	public ArrayList<String> getCampaignIDs() {
		return campaign_ids;
	}//getCampaignIDs

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
	
}//User
