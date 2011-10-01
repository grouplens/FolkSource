/* Copyright (c) 2006-2011 Regents of the University of Minnesota.
   For licensing terms, see the file LICENSE.
 */

package com.citizensense.android;

import java.util.ArrayList;
import java.util.Date;

import android.util.Log;

/** 
 * Campaign Object
 * @author Phil Brown
 */
public class Campaign {

	/*
	 * These new objects need more thought, and getters and setters, modifiers, etc
	 * 
	 */
	ArrayList<String> user_tokens;//The tokens associated with participating users.
	//TODO - Should this not be a string - but some object that can track a user's participation
	//and incentives for a specific campaign???
	/* Done*/
	private String id;
	private String[] times;
	private String[]locations;
	/** Name of the campaign*/
	private String name;
	/** Description of the campaign. It seems like if there was a paragraph Object,
	 * it would be really nice here...*/
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
	
	public Campaign() {
		
	}
	
	public Campaign(String id, String name) {
		this.id = id;
		this.name = name;
	}
	
	public Campaign(String id, String name,String[] locations) {
		this.id = id;
		this.name = name;
		this.locations = locations;
	}
	
	
	//TODO get Campaign Incentives from the server.
	public String[]getIncentives() {
		return new String[0];
	}
	
	//TODO get Campaign Qualifications from the server.
	public String[]getQualifications() {
		return new String[0];
	}
	
	public String getId() {
		return id;
	}



	public void setId(String id) {
		this.id = id;
	}



	public String[] getTimes() {
		return times;
	}



	public void setTimes(String[] times) {
		this.times = times;
	}



	public String[] getLocations() {
		return locations;
	}



	public void setLocations(String[] locations) {
		this.locations = locations;
	}



	public String getName() {
		return name;
	}



	public void setName(String name) {
		this.name = name;
	}



	public String getDescription() {
		return description;
	}



	public void setDescription(String description) {
		this.description = description;
	}



	public String getOwner() {
		return owner;
	}



	public void setOwner(String owner) {
		this.owner = owner;
	}



	public Task getTask() {
		return task;
	}



	public void setTask(Task task) {
		this.task = task;
	}



	public Date getStartDate() {
		return startDate;
	}



	public void setStartDate(Date startDate) {
		this.startDate = startDate;
	}



	public Date getEndDate() {
		return endDate;
	}



	public void setEndDate(Date endDate) {
		this.endDate = endDate;
	}
	
	public class Task {

		/*
		 * Define task
	  - Text instructions
	  - Photo?
	  - Form
	- Declare task complete for specified location(s)
		 */
		public String instructions;
		public String name;
		/** I'm not sure it's good practice to make the user's form specifically a view.*/
		public String[] requirements;
		private Form form;
		//public boolean requiresPhoto;
		//public boolean requiresLocation;
		/*
		public boolean requiresVideo;
		public boolean requiresSoundClip;
		public boolean requiresAccelerometerData;
		*/
		/**
		 * Constructor
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
		
		public void setForm(Form f) {
			this.form = f;
		}
		
		public Form getForm() {
			return this.form;
		}
		
		/** 
		 * This is the form object associated with this task. A Form is merely an
		 * ArrayList of Question Objects.
		 */
		public class Form {
			private ArrayList<Question> questions;
			public Form() {
				questions = new ArrayList<Question>();
				Campaign.Task.this.setForm(this);
			}
			public void addQuestion(Question q) {
				questions.add(q);
			}
			public Question[] getQuestions() {
				Log.i("CAMPAIGN", "Number of Questions: " + questions.size());
				Question[] q = new Question[questions.size()];
				for (int i=0; i<questions.size(); i++) {
					q[i] = questions.get(i);
				}
				return q;
			}
			
		}
	}//Task
	
}
