/* Copyright (c) 2006-2011 Regents of the University of Minnesota.
   For licensing terms, see the file LICENSE.
 */

package com.citizensense.android;

import java.util.ArrayList;
import java.util.Date;

import android.os.Parcel;
import android.os.Parcelable;
import android.util.Log;

/** 
 * Campaign Object
 * @author Phil Brown
 */
public class Campaign implements Parcelable{

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
	
	/** An empty constructor is used by the XML Parser and by the Database.*/
	public Campaign() {}//Campaign
	
	/** Constructor to use when re-constructing object from a parcel.*/
	public Campaign(Parcel in) {
		readFromParcel(in);
	}
	
	/** Called from the constructor to create this object from a parcel.*/
	private void readFromParcel(Parcel in) {
		id = in.readString();
		in.readStringArray(times);
		in.readStringArray(locations);
		name = in.readString();
		description = in.readString();
		//TODO: read Task
		
		owner = in.readString();
		//read boolean value isComplete
		boolean[]  booleanArray = new boolean[1];
		in.readBooleanArray(booleanArray);
		isComplete = booleanArray[0];
		//read startDate
		int[] startDateArray = new int[3];
		int[] endDateArray = new int[3];
		in.readIntArray(startDateArray);
		in.readIntArray(endDateArray);
		startDate = new Date(startDateArray[2],startDateArray[0],startDateArray[1]);
		endDate = new Date(endDateArray[2],endDateArray[0],endDateArray[1]);
	}
	
	
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
	
	@Override
	public int describeContents() {
		return 0;
	}

	@Override
	public void writeToParcel(Parcel dest, int flags) {
	      dest.writeString(id);
	      dest.writeStringArray(times);
	      dest.writeStringArray(locations);
	      dest.writeString(name);
	      dest.writeString(description);
	      //TODO: write Task
	      
	      dest.writeString(owner);
	      //There is no function for writing a single boolean
	      dest.writeBooleanArray(new boolean[]{isComplete});
	      //Write Date as an integer array
	      dest.writeIntArray(new int[]{startDate.getMonth(),startDate.getDay(),startDate.getYear()});
	      dest.writeIntArray(new int[]{endDate.getMonth(),endDate.getDay(),endDate.getYear()});
		
	}
	
	public class CampaignCreator implements Parcelable.Creator<Campaign> {
	      public Campaign createFromParcel(Parcel source) {
	            return new Campaign(source);
	      }
	      public Campaign[] newArray(int size) {
	            return new Campaign[size];
	      }
	}
	
	
	/** This defines the task associated with the exclusive campaign object.*/
	public class Task{
		/** Provides a description of how to complete this task*/
		public String instructions;
		/** This task's name*/
		public String name;
		/** The requirements for this task (such as gps, photo, etc)*/
		public String[] requirements;
		/** The form associated with this task*/
		private Form form;
		//public boolean requiresPhoto;
		//public boolean requiresLocation;
		/*
		public boolean requiresVideo;
		public boolean requiresSoundClip;
		public boolean requiresAccelerometerData;
		*/
		/**
		 * Constructor. Initiates variables and assigns this task to this
		 * campaign.
		 * @param name The name of the Task
		 * @param instructions The instructions for performing the task
		 * @param v The View associated with this Task's form.
		 */
		public Task(String name, String instructions, String[] requirements) {
			this.name = name;
			this.instructions = instructions;
			this.requirements = requirements;
			Campaign.this.setTask(this);
		}//Task	

		/** Sets the form
		 * @param f the new form*/
		public void setForm(Form f) {
			this.form = f;
		}//setForm
		
		/** gets the form*/
		public Form getForm() {
			return this.form;
		}//getForm
		
		/** 
		 * This is the form object associated with this task. A Form merely 
		 * contains an ArrayList of Question Objects.
		 */
		public class Form {
			/** Holds the questions*/
			private ArrayList<Question> questions;
			
			/** Constructor. Initializes the questions and sets the form as this
			 * task's form.*/
			public Form() {
				questions = new ArrayList<Question>();
				Campaign.Task.this.setForm(this);
			}//Form
			
			/** Add a new Question to this form
			 * @param q new Question*/
			public void addQuestion(Question q) {
				questions.add(q);
			}//addQuestion
			
			/** get this form's questions*/
			public Question[] getQuestions() {
				Log.i("CAMPAIGN", "Number of Questions: " + questions.size());
				Question[] q = new Question[questions.size()];
				for (int i=0; i<questions.size(); i++) {
					q[i] = questions.get(i);
				}
				return q;
			}//getQuestions
		}//Form
	}//Task
}//Campaign
