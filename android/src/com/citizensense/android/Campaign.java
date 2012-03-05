/* Copyright (c) 2006-2011 Regents of the University of Minnesota.
   For licensing terms, see the file LICENSE.
 */

package com.citizensense.android;

import java.util.ArrayList;
import java.util.Date;

import org.json.JSONArray;
import org.json.JSONObject;
import org.w3c.dom.Document;
import org.xml.sax.SAXException;

import android.os.Parcel;
import android.os.Parcelable;
import android.util.Xml;

import com.citizensense.android.parsers.CampaignParser;

/** 
 * Campaign Object
 * @author Phil Brown
 */
public class Campaign implements Item, Comparable<Campaign> {

	ArrayList<String> user_tokens;
	/*The tokens associated with participating users.
	TODO - Should this not be a string - but some object that can track a 
	user's participation and incentives for a specific campaign???*/
	/** This campaign's unique ID.*/
	private String id;
	/** The times when this campaign's tasks can be performed*/
	private String[] times;
	/** The locations where this campaign's tasks can be performed*/
	private String[]locations;
	/** Name of the campaign*/
	private String name;
	/** Description of the campaign. */
	private String description;
	/** The campaign organizer. This should later be a new Object, not a String.*/
	private String owner;
	/** The task defined by this campaign*/
	private Task task;
	/** Whether this campaign is complete (false if still open)*/
	public boolean isComplete;
	/** Date the campaign begins*/
	private Date startDate;
	/** Date the campaign ends.*/
	private Date endDate;
	/** Id of task*/
	private String taskId;
	/** Started or not*/
	public boolean started = false;
	
	/** This CREATOR is used to parcel this Object. */
	public static final Parcelable.Creator<Campaign> CREATOR =
        new Parcelable.Creator<Campaign>() {
     
		/** Construct and return an Ad from a Parcel*/
		@Override
		public Campaign createFromParcel(Parcel in) {
			return new Campaign(in);
		}//createFromParcel

		/**
		 * Creates a new array of Adds
		 */
		@Override
		public Campaign[] newArray(int size) {
			return new Campaign[size];
		}//newArray
	};
	
	/** Create a new campaign from the given Parcel. */
	public Campaign(Parcel in) {
		this.id = in.readString();
		this.times = in.createStringArray();
		this.locations = in.createStringArray();
		this.name = in.readString();
		this.description = in.readString();
		this.owner = in.readString();
		this.task = in.readParcelable(Task.class.getClassLoader());
		this.isComplete = in.readByte() == 1;
		this.startDate = new Date(in.readLong());
		this.endDate = new Date(in.readLong());
		this.taskId = task.getId();
	}//Campaign
	
	/** An empty constructor is used by the XML Parser and by the Database.*/
	public Campaign() {}//Campaign
	
	@Override
	public int describeContents() {
		return 0;
	}//describeContents

	@Override
	public void writeToParcel(Parcel out, int flags) {
		out.writeString(this.id);
		out.writeStringArray(this.times);
		out.writeStringArray(this.locations);
		out.writeString(this.name);
		out.writeString(this.description);
		out.writeString(this.owner);
		out.writeParcelable(this.task, 0);
		out.writeByte((byte) (isComplete ? 1 : 0));
		out.writeLong(this.startDate.getTime());
		out.writeLong(this.endDate.getTime());
	}//writeToParcel
	
	/** This should request campaign incentives from the server.*/
	public String[]getIncentives() {
		//TODO get Campaign Incentives from the server.
		return new String[0];
	}//getIncentives
	
	/** This should request campaign qualifications from the server.*/
	public String[]getQualifications() {
		//TODO get Campaign Qualifications from the server.
		return new String[0];
	}//getQualifications
	
	/** Return the ID of this campaign*/
	public String getId() {
		return id;
	}//getId

	/** Sets the ID of this campaign
	 * @param id new ID*/
	public void setId(String id) {
		this.id = id;
	}//setId

	/** Gets task times*/
	public String[] getTimes() {
		return times;
	}//getTimes

	/** Set the times for this campaign
	 * @param times new times (army time ranges, such as "13:30-15:00")*/
	public void setTimes(String[] times) {
		this.times = times;
	}//setTimes

	/** Return the locations where this campaign can be tasked.*/
	public String[] getLocations() {
		return locations;
	}//getLocations

	/** Set the locations where this campaign can be tasked.
	 * @param locations Must be represented as a region, a city/state (ex.
	 * "Minneapolis, MN"), or GPS coordinates*/
	public void setLocations(String[] locations) {
		this.locations = locations;
	}//setLocations

	/** Gets the name of this campaign*/
	public String getName() {
		return name;
	}//getName

	/** Sets the name of this campaign
	 * @param name new name*/
	public void setName(String name) {
		this.name = name;
	}//setName

	/** Get the campaign description*/
	public String getDescription() {
		return description;
	}//getDescription

	/** Sets the campaign description
	 * @param description new description*/
	public void setDescription(String description) {
		this.description = description;
	}//setDescription

	/** Gets the campaign owner*/
	public String getOwner() {
		return owner;
	}//getOwner

	/** Sets the campaign owner
	 * @param owner new owner. This should be changed later to accept a User 
	 * Object.*/
	public void setOwner(String owner) {
		this.owner = owner;
	}//setOwner

	/** Gets this campaign's task*/
	public Task getTask() {
		return task;
	}//getTask

	/** Sets this campaign's task
	 * @param task new task*/
	public void setTask(Task task) {
		this.task = task;
	}//setTask

	/** Gets the start date*/
	public Date getStartDate() {
		return startDate;
	}//getStartDate

	/** Sets the start date
	 * @param startDate new Start Date*/
	public void setStartDate(Date startDate) {
		this.startDate = startDate;
	}//setStartDate

	/** Get the end date*/
	public Date getEndDate() {
		return endDate;
	}//getEndDate

	/** Set the end date
	 * @param endDate new End Date*/
	public void setEndDate(Date endDate) {
		this.endDate = endDate;
	}//setEndDate
	
	/** Set the image contained in this campaign. */
	public void setImage() {
		//TODO
	}//setImage
	
	/** Get this campaign's image
	 * FIXME */
	public int getImage() {
		if (this.getId().equals("1")) {
			return R.drawable.potholes;
		}
		else if (this.getId().equals("2")) {
			return R.drawable.busrack;
		}
		else {
			return R.drawable.profile_default;
		}
	}//getImage
		
	@Override
	public String buildXML() {
		StringBuilder campaign = new StringBuilder();
		campaign.append("<org.citizensense.model.Campaign>");
		campaign.append("<id>" + this.getId() + "</id>");
		campaign.append("<start__date class=\"sql-timestamp\">" 
				        + this.getStartDate() + "</start__date>");
		campaign.append("<end__date class=\"sql-timestamp\">"
				        + this.getEndDate() + "</end__date>");
		//FIXME campaign owner...
		campaign.append("<owner__id></owner__id>");
		//Task ID is the same as the campaign ID.
		//FIXME Why do we need any of the below attributes?
		campaign.append("<task__id>" + this.getTask().getId()/*getId()*/ + "</task__id>");
		campaign.append("<tasks class=\"org.hibernate.collection.PersistentBag\">");
		campaign.append("<bag/>");
		campaign.append("<initialized>true</initialized>");
		campaign.append("<owner class=\"org.citizensense.model.Campaign\" reference=\"../..\"/>");
		campaign.append("<cachedSize>-1</cachedSize>");
		campaign.append("<role>org.citizensense.model.Campaign.tasks</role>");
		campaign.append("<key class=\"long\">1</key>");
		campaign.append("<dirty>false</dirty>");
		campaign.append("<storedSnapshot class=\"list\"/>");
		campaign.append("</tasks>");
		campaign.append("</org.citizensense.model.Campaign>");
		return campaign.toString();
	}//buildXML

	@Override
	public void createFromXML(Document document) {
		// Required by Item, but not implemented		
	}//createFromXML
	
	@Override
	public void createFromXML(String xml) {
		try {
			Xml.parse(xml, new CampaignParser(new CampaignParser.Callback() {
				
				@Override
				public void invoke(Campaign campaign) {
					Campaign.this.setId(campaign.getId());
					Campaign.this.setName(campaign.getName());
					Campaign.this.setDescription(campaign.getDescription());
					Campaign.this.setStartDate(campaign.getStartDate());
					Campaign.this.setEndDate(campaign.getEndDate());
					//ADDED by jts
					Campaign.this.setTaskId(campaign.getTask().getId());
					//FIXME Campaign.this.setImage()
					Campaign.this.setLocations(campaign.getLocations());
					Campaign.this.setOwner(campaign.getOwner());
					Campaign.this.setTask(campaign.getTask());
					Campaign.this.setTimes(campaign.getTimes());
					//FIXME Campaign.this.setIncentives(campaign.getIncentives());
				}
			}));
		} catch (SAXException e) {
			e.printStackTrace();
		}
	}//createFromXML

	@Override
	public String buildJSON() {
		StringBuilder campaign = new StringBuilder();
		campaign.append("{\"id\":" + this.getId() + ",");
		campaign.append("\"end_date\":{\"nanos\":0,");
		campaign.append("\"time\":" + this.getEndDate().getTime() + ",");
		campaign.append("\"minutes\":" + this.getEndDate().getMinutes() + ",");
		campaign.append("\"seconds\":" + this.getEndDate().getSeconds() + ",");
		campaign.append("\"hours\":" + this.getEndDate().getHours() + ",");
		campaign.append("\"month\":" + this.getEndDate().getMonth() + ",");
		campaign.append("\"timezoneOffset\":" + this.getEndDate().getTimezoneOffset() + ",");
		campaign.append("\"year\":" + this.getEndDate().getYear() + ",");
		campaign.append("\"day\":" + this.getEndDate().getDay() + ",");
		campaign.append("\"date\":" + this.getEndDate().getDate() + "},");
		campaign.append("\"description\":\"" + this.getDescription() + "\",");
		campaign.append("\"owner_id\":" + 0 + ",");//TODO implement owner id
		campaign.append("\"task_id\":" + this.getTask().getId()/*getId()*/ + ",");
		campaign.append("\"tasks\":[");
		if (this.getTask() == null) {
			campaign.append("],");
		}
		else {
			campaign.append("{\"id\":" + this.getId() + ",");
			campaign.append("\"instructions\":\"" + this.getTask().getInstructions() + "\",");
			campaign.append("\"name\":\"" + this.getTask().getName() + "\",");
			campaign.append("\"submissions\":[]}],");//Submissions aren't stored locally
		}
		campaign.append("\"start_date\":{\"nanos\":0,\"time\":" + this.getStartDate().getTime() + ",");
		campaign.append("\"minutes\":" + this.getStartDate().getMinutes() + ",");
		campaign.append("\"seconds\":" + this.getStartDate().getSeconds() + ",");
		campaign.append("\"hours\":" + this.getStartDate().getHours() + ",");
		campaign.append("\"month\":" + this.getStartDate().getMonth() + ",");
		campaign.append("\"timezoneOffset\":" + this.getStartDate().getTimezoneOffset() + ",");
		campaign.append("\"year\":" + this.getStartDate().getYear() + ",");
		campaign.append("\"day\":" + this.getStartDate().getDay() + ",");
		campaign.append("\"date\":" + this.getStartDate().getDate() + "}}");
		return campaign.toString();
	}//buildJSON

	@Override
	public void createFromJSON(JSONObject object) {
		//Iterator iterator = object.keys();
		this.id = object.optString("id");
		JSONObject end_date = object.optJSONObject("end_date");
		this.endDate = new Date(Long.parseLong(end_date.optString("time")));
		this.description = object.optString("description");
		//TODO this.owner = object.getString("owner_id");
		JSONArray tasks = object.optJSONArray("tasks");
		JSONObject task = tasks.optJSONObject(0);
		this.task = new Task();
		this.task.setInstructions(task.optString("instructions"));
		this.task.setName(task.optString("name"));
		JSONObject start_date = object.optJSONObject("start_date");
		this.startDate = new Date(Long.parseLong(start_date.optString("time")));
	}//createFromJSON

	@Override
	public String getItemName() {
		return "campaign";
	}//getItemName

	public void setTaskId(String taskId) {
		this.taskId = taskId;
	}

	public String getTaskId() {
		return taskId;
	}

	@Override
	public int compareTo(Campaign another) {
		Date now = new Date();
		
		String other = now.after(another.getStartDate()) && now.before(another.getEndDate()) ? "Open" : "Closed";
		String us = now.after(this.getStartDate()) && now.before(this.getEndDate()) ? "Open" : "Closed";
		
		if(us.equals("Open") && other.equals("Closed"))
			return -1;
		if(us.equals("Closed") && other.equals("Open"))
			return 1;
		return 0;
	}
		
}//Campaign
