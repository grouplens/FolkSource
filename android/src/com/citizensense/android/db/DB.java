/* Copyright (c) 2006-2011 Regents of the University of Minnesota.
   For licensing terms, see the file LICENSE.
 */

package com.citizensense.android.db;

/** Contains static variables used by the database
 * @author Phil Brown
 */

public class DB {
	
	/** Used for logcat debugging*/
	public static final String TAG = "DATABASE";

	/** Current version of the database (used for upgrades) */
	public static final int DATABASE_VERSION = 1;
	/** The name of the Citizen Sense database*/
	public static final String DATABASE_NAME = "citizen_sense_db";
	/** Used as a reference to a column in the campaign table*/
	public static String CAMPAIGN_TABLE = "campaigns",
	                     ID = "_id",
						 NAME = "name",
						 DESCRIPTION = "description",
						 OWNER = "owner",
						 LOCATIONS = "locations",
						 TIMES = "times",
						 START_DATE = "start_date",
						 END_DATE = "end_date";

	/** Used as a reference to a column in the task table*/
	public static String TASK_TABLE = "tasks",
	                     INSTRUCTIONS = "instructions",
	                     REQUIREMENTS = "requirements",
	                     QUALIFICATIONS = "qualifications";

	/** Used as a reference to a column in the questions table*/
	public static String QUESTIONS_TABLE = "questions",
	                     QUESTION = "question",
	                     TYPE = "type", //multiple choice or written response
	                     SINGLE_CHOICE = "single_choice",
	                     SINGLE_LINE = "single_line",
	                     ANSWERS = "answers";
}//DB
