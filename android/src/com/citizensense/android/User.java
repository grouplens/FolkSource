/* Copyright (c) 2006-2011 Regents of the University of Minnesota.
   For licensing terms, see the file LICENSE.
 */

package com.citizensense.android;

import java.util.ArrayList;

import org.json.JSONObject;
import org.w3c.dom.Document;

import android.content.Context;
import android.os.Parcel;
import android.util.Log;

import com.citizensense.android.net.AuthenticationResponseHandler;
import com.citizensense.android.net.PostRequest;
import com.citizensense.android.net.Request;

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

	/** Cookie get from server after successfully login or register */
	private String cookie;
	/** Request Type */
	private static final int LOGIN = 2, REGISTER = 3;

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
	public void login(Context context, String username, String password) {
		this.username = username;
		CitizenSense.username.setText(username);
		// TODO save login across sessions (include Token)
		// Editor e = G.memory.edit();
		// e.putString("username", username);
		// e.commit();
		campaign_ids.add("1");
		campaign_ids.add("2");

		AuthenticationResponseHandler loginHandler = new AuthenticationResponseHandler(
				context, LOGIN);
		new PostRequest(context, null, LOGIN, loginHandler, true).execute(
				username, password);
	}// login

	/**
	 * Register a new account for the user.
	 */
	public void register(Context context, String username, String password) {
		this.username = username;
		CitizenSense.username.setText(username);
		campaign_ids.add("1");
		campaign_ids.add("2");

		AuthenticationResponseHandler registerHandler = new AuthenticationResponseHandler(
				context,REGISTER);
		new PostRequest(context, null, REGISTER, registerHandler, true)
				.execute(username, password);
	}// register

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
