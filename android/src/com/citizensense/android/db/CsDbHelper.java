/* Copyright (c) 2006-2011 Regents of the University of Minnesota.
   For licensing terms, see the file LICENSE.
 */

package com.citizensense.android.db;

import android.content.Context;
import android.database.sqlite.SQLiteDatabase;
import android.database.sqlite.SQLiteOpenHelper;

/**
 * Provides an easy implementation for creating and upgrading the 
 * database.
 * @author Phil Brown
 */
public class CsDbHelper  extends SQLiteOpenHelper{
	
	/** Constructor calls the super constructor, which determines whether a
	 * new table needs to be created or an old table needs to be upgraded*/
	public CsDbHelper(Context context){
		super(context, DB.DATABASE_NAME, null, DB.DATABASE_VERSION);
	}//CsDbHelper

	/** Create the Citizen Sense Database*/
	@Override
	public void onCreate(SQLiteDatabase db) {
		//stores the campaigns
		db.execSQL("CREATE TABLE " + DB.CAMPAIGN_TABLE + " (" 
	    		   + DB.ID + " STRING PRIMARY KEY NOT NULL,"
	    		   + DB.NAME + " TEXT NOT NULL,"
	    		   + DB.DESCRIPTION + " TEXT NOT NULL,"
	    		   + DB.OWNER + " TEXT NOT NULL,"
	    		   + DB.LOCATIONS + " TEXT NOT NULL,"
	    		   + DB.TIMES + " TEXT NOT NULL," 
	    		   + DB.START_DATE + " TEXT NOT NULL,"
	    		   + DB.END_DATE + " TEXT NOT NULL)");
		//stores the tasks
		db.execSQL("CREATE TABLE " + DB.TASK_TABLE + "("
				   + DB.ID + " STRING PRIMARY KEY NOT NULL,"
				   + DB.NAME + " TEXT NOT NULL,"
				   + DB.INSTRUCTIONS + " TEXT,"
				   + DB.REQUIREMENTS + " TEXT)");
		//Stores all the questions in the form
		db.execSQL("CREATE TABLE " + DB.QUESTIONS_TABLE + "("
				   + DB.ID + " TEXT NOT NULL,"
				   + DB.QUESTION + " TEXT NOT NULL,"
				   + DB.TYPE + " INTEGER NOT NULL,"
				   + DB.SINGLE_CHOICE + " INTEGER,"
				   + DB.SINGLE_LINE + " INTEGER,"
				   + DB.ANSWERS + " TEXT)");
		
	}//onCreate

	/** Upgrade the Citizen Sense Database*/
	@Override
	public void onUpgrade(SQLiteDatabase db, int oldVersion, int newVersion) {
		db.execSQL("DROP TABLE IF EXISTS " + DB.CAMPAIGN_TABLE);
		db.execSQL("DROP TABLE IF EXISTS " + DB.TASK_TABLE);
		db.execSQL("DROP TABLE IF EXISTS " + DB.QUESTIONS_TABLE);
		onCreate(db);
	}//onUpgrade
	
}//CsDbHelper
