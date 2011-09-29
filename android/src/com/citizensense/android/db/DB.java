package com.citizensense.android.db;

/** Contains static variables*/
public class DB {

	/** Current version of the database (used for upgrades) */
	public static final int DATABASE_VERSION = 1;
	public static final String DATABASE_NAME = "citizen_sense_db";
	public static String CAMPAIGN_TABLE = "campaigns",
	                     ID = "_id",
						 NAME = "name",
						 DESCRIPTION = "description",
						 OWNER = "owner",
						 LOCATIONS = "locations",
						 TIMES = "times",
						 START_DATE = "start_date",
						 END_DATE = "end_date";
	
	public static String TASK_TABLE = "tasks",
	                     INSTRUCTIONS = "instructions",
	                     REQUIREMENTS = "requirements",
	                     QUALIFICATIONS = "qualifications";
	
	public static String QUESTIONS_TABLE = "questions",
	                     QUESTION = "question",
	                     TYPE = "type", //multiple choice or written response
	                     SINGLE_CHOICE = "single_choice",
	                     SINGLE_LINE = "single_line",
	                     ANSWERS = "answers";
}
