/* Copyright (c) 2006-2011 Regents of the University of Minnesota.
   For licensing terms, see the file LICENSE.
 */

package com.citizensense.android;

import android.os.Parcel;
import android.os.Parcelable;
import android.util.Log;

/**
 * This defines the Question object that is read in a campaign XML file
 * retrieved from the server.
 * @author Phil Brown
 */
public class Question implements Parcelable {

	/** Question type telling the app to show the answers in a drop-down
	 * menu */
	public static final int MULTIPLE_CHOICE = 0;
	/** Question type telling the app to show the question and an EditText. */
	public static final int WRITTEN_RESPONSE = 1;
		
	/** Whether or not a multiple choice question can have multiple answers */
	public boolean single_choice;
	
	/** Whether or not a written response question should be multiple lines*/
	public boolean single_line;
	
	/** The type of question. */
	public int type;
	
	/** The question text */
	public String question;
	
	/** Available answers for multiple choice questions */
	public String[] answers;
	

	/** This CREATOR is used to parcel this Object. */
	public static final Parcelable.Creator<Question> CREATOR =
        new Parcelable.Creator<Question>() {
     
		/** Construct and return an Ad from a Parcel*/
		@Override
		public Question createFromParcel(Parcel in) {
			return new Question(in);
		}//createFromParcel

		/**
		 * Creates a new array of Adds
		 */
		@Override
		public Question[] newArray(int size) {
			return new Question[size];
		}//newArray
	};
	
	/** Constructor. Initializes the question from a Parcel Object.*/
	public Question(Parcel in) {
		this.single_choice = in.readByte() == 1;
		this.single_line = in.readByte() == 1;
		this.type = in.readInt();
		this.question = in.readString();
		this.answers = in.createStringArray();
	}//Question
	
	/** Create a new Question
	 * @param question The Question text
	 * @param type The Question type
	 * @param answers Can be null if type == Question.WRITTEN_RESPONSE
	 * @param option if type == Question.WRITTEN_RESPONSE, this refers to the
	 * single_line attribute. Otherwise, it refers to the single_answer attribute.
	 */
	public Question(String question, 
			        int type, 
			        String[] answers, 
			        boolean option) {
		this.question = question;
		this.type = type;
		this.answers = answers;
		if (type == MULTIPLE_CHOICE) {
			this.single_choice = option;
		}
		else if (type == WRITTEN_RESPONSE) {
			this.single_line = option;
		}
		else{
			//If the type is not MULTIPLE_CHOICE or WRITTEN_RESPONSE, set it based
			//on whether or not answers is null.
			if (answers == null) {
				this.type = WRITTEN_RESPONSE;
			}
			else {
				this.type = MULTIPLE_CHOICE;
			}
		}
	}//Question

	/**
	 * Returns this Question in a test-like format.
	 */
	@Override
	public String toString() {
		String q = this.question;
		Log.i("QUESTION", "TYPE=" + this.type);
		if (this.type == WRITTEN_RESPONSE) {
			Log.i("Question", q);
			return q + "\n";
		}
		else {
			q += "\n";
		}
		Log.i("QUESTION", "Number of answers: " + answers.length);
		for (int i = 0; i < this.answers.length; i++) {
			Log.i("QUESTION", "index=" + i + ", q=" + q);
			q += "  " + (i+1) + ") " + answers[i] + "\n";
		}
		return q;
	}//toString

	/** Get the Question type. */
	public int getType() {
		return type;
	}//getType

	/** Get the Question text*/
	public String getQuestion() {
		return question;
	}//getQuestion

	/** Get the question answers*/
	public String[] getAnswers() {
		return answers;
	}//getAnswers
	
	/** Returns true if type == WRITTEN_RESPONSE and single_line is true.*/
	public boolean isSingleLine() {
		if (this.type == WRITTEN_RESPONSE) {
			return this.single_line;
		}
		return false;
	}//isSingleLine
	
	/** Returns true if type == MULTIPLE_CHOICE and single_choice is true.*/
	public boolean isSingleChoice() {
		if (this.type == MULTIPLE_CHOICE) {
			return this.single_choice;
		}
		return false;
	}//isSingleChoice

	@Override
	public int describeContents() {
		return 0;
	}//describeContents

	@Override
	public void writeToParcel(Parcel out, int flags) {
		out.writeByte((byte) (this.single_choice ? 1 : 0));
		out.writeByte((byte) (this.single_line ? 1 : 0));
		out.writeInt(this.type);
		out.writeString(this.question);
		out.writeStringArray(this.answers);
	}//writeToParcel
	
}//Question
