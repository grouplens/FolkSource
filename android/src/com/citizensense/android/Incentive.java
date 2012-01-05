/* Copyright (c) 2006-2011 Regents of the University of Minnesota.
   For licensing terms, see the file LICENSE.
 */

package com.citizensense.android;

import java.util.ArrayList;

import org.json.JSONObject;
import org.w3c.dom.Document;

import android.os.Parcel;

/**
 * Incentive Item
 * @author Phil Brown
 *
 */
public class Incentive implements Item {
	
	/** Describes the type of incentive */
	public static final int LEADERBOARD = 0, POINTS = 1, BADGES = 2;

	/** The leaderboard*/
	public ArrayList<User> leaderboard;
	/** 
	 * Specifies the incentive type
	 * @see #LEADERBOARD
	 * @see #POINTS
	 * @see #BADGES 
	 */
	private int type;
	/** If this incentive is associated with a campaign, this attribute specifies which one*/
	private int task_id;
	/** This Incentive's value (abstract) */
	private int value;
	/** This Incentive's ID, which is retrieved from the server */
	private int id;
	
	@Override
	public int describeContents() {
		// TODO Auto-generated method stub
		return 0;
	}//describeContents

	@Override
	public void writeToParcel(Parcel dest, int flags) {
		// TODO Auto-generated method stub
		
	}//writeToParcel

	@Override
	public String buildXML() {
		switch(this.type) {
			case (LEADERBOARD) : {
				break;
			}
			case (POINTS) : { 
				break;
			}
			case (BADGES) : {
				break;
			}
			default: {
				
			}
		}
		// TODO Auto-generated method stub
		return null;
	}//buildXML

	@Override
	public void createFromXML(Document document) {
		// TODO Auto-generated method stub
		
	}//createFromXML

	@Override
	public void createFromXML(String string) {
		
	}//createFromXML

	@Override
	public String buildJSON() {
		// TODO Auto-generated method stub
		return null;
	}//buildJSON

	@Override
	public void createFromJSON(JSONObject object) {
		// TODO Auto-generated method stub
		
	}//createFromJSON

	@Override
	public String getItemName() {
		return "incentive";
	}//getItemName

	public ArrayList<User> getLeaderbaord() {
		return leaderboard;
	}//getLeaderbaord

	public void setLeaderbaord(ArrayList<User> leaderbaord) {
		this.leaderboard = leaderbaord;
	}//setLeaderbaord

	public int getType() {
		return type;
	}//getType

	public void setType(int type) {
		this.type = type;
	}//setType

	public int getTask_id() {
		return task_id;
	}//getTask_id

	public void setTask_id(int task_id) {
		this.task_id = task_id;
	}//setTask_id

	public int getValue() {
		return value;
	}//getValue

	public void setValue(int value) {
		this.value = value;
	}//setValue
	
	public int getId() {
		return id;
	}//getId
	
	public void setId(int id) {
		this.id = id;
	}//setId
}//Incentive
