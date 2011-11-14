/* Copyright (c) 2006-2011 Regents of the University of Minnesota.
   For licensing terms, see the file LICENSE.
 */

package com.citizensense.android;

import android.os.Parcel;
import android.os.Parcelable;

/** 
 * This defines the task associated with the exclusive campaign object.
 *  @author Phil Brown
 */
public class Task implements Parcelable {
	/** Provides a description of how to complete this task*/
	public String instructions;
	/** This task's name*/
	public String name;
	/** The requirements for this task (such as gps, photo, etc)*/
	public String[] requirements;
	/** The form associated with this task*/
	private Form form;
	
	/** This CREATOR is used to parcel this Object. */
	public static final Parcelable.Creator<Task> CREATOR =
        new Parcelable.Creator<Task>() {
     
		/** Construct and return an Ad from a Parcel*/
		@Override
		public Task createFromParcel(Parcel in) {
			return new Task(in);
		}//createFromParcel

		/**
		 * Creates a new array of Adds
		 */
		@Override
		public Task[] newArray(int size) {
			return new Task[size];
		}//newArray
	};
	
	public Task(Parcel in) {
		this.instructions = in.readString();
		this.name = in.readString();
		this.requirements = in.createStringArray();
		this.form = in.readParcelable(Form.class.getClassLoader());
	}//Task
	
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
		//Campaign.this.setTask(this);
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
	
	@Override
	public int describeContents() {
		return 0;
	}//describeContents

	@Override
	public void writeToParcel(Parcel out, int flags) {
		out.writeString(this.instructions);
		out.writeString(this.name);
		out.writeStringArray(this.requirements);
		out.writeParcelable(this.form, 0);
	}//writeToParcel
}//Task