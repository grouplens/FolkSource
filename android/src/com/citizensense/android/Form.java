/* Copyright (c) 2006-2011 Regents of the University of Minnesota.
   For licensing terms, see the file LICENSE.
 */

package com.citizensense.android;

import java.util.ArrayList;

import android.os.Parcel;
import android.os.Parcelable;
import android.util.Log;

/** 
 * This is the form object associated with a task. A Form merely 
 * contains an ArrayList of Question Objects.
 * @author Phil Brown
 */
public class Form implements Parcelable {
	/** Holds the questions*/
	private ArrayList<Question> questions;
	
	/** This CREATOR is used to parcel this Object. */
	public static final Parcelable.Creator<Form> CREATOR =
        new Parcelable.Creator<Form>() {
     
		/** Construct and return an Ad from a Parcel*/
		@Override
		public Form createFromParcel(Parcel in) {
			return new Form(in);
		}//createFromParcel

		/**
		 * Creates a new array of Adds
		 */
		@Override
		public Form[] newArray(int size) {
			return new Form[size];
		}//newArray
	};
	
	/** Constructor. Initializes the questions and sets the form as this
	 * task's form.*/
	public Form() {
		questions = new ArrayList<Question>();
		//Campaign.Task.this.setForm(this);
	}//Form
	
	/** Constructor. Reads in a new Parcel object to initialize this
	 * Form. */
	public Form(Parcel in) {
		this();
		Parcelable[] q = in.readParcelableArray(Question.class.getClassLoader());
		for (int i = 0; i < q.length; i++) {
			addQuestion((Question) q[i]);
		}
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

	@Override
	public int describeContents() {
		return 0;
	}//describeContents

	@Override
	public void writeToParcel(Parcel out, int flags) {
		out.writeParcelableArray(getQuestions(), 0);
	}//writeToParcel
	
}//Form