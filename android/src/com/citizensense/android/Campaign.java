/* Copyright (c) 2006-2011 Regents of the University of Minnesota.
   For licensing terms, see the file LICENSE.
 */

package com.citizensense.android;

import java.util.ArrayList;
import java.util.Date;

import android.R.drawable;
import android.util.Log;

import android.os.Parcel;
import android.os.Parcelable;

/** 
 * Campaign Object
 * @author Phil Brown
 */
public class Campaign implements Parcelable {

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
		
		
}//Campaign
