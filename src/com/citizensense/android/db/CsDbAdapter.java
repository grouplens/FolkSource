/* Copyright (c) 2006-2011 Regents of the University of Minnesota.
   For licensing terms, see the file LICENSE.
 */

package com.citizensense.android.db;

import java.text.ParseException;
import java.text.SimpleDateFormat;

import android.content.ContentValues;
import android.content.Context;
import android.database.Cursor;
import android.database.SQLException;
import android.database.sqlite.SQLiteDatabase;
import android.util.Log;

import com.citizensense.android.Campaign;
import com.citizensense.android.Campaign.Task;
import com.citizensense.android.Campaign.Task.Form;
import com.citizensense.android.Question;
import com.citizensense.android.conf.Constants;

/**
 * CitizenSense DataBase Adapter
 * This class handles database actions such as adding and retrieving campaigns.
 * @author Phil Brown
 */
public class CsDbAdapter {

	/** context for accessing resource files*/
	private Context context;
	/** the SQLite Database */
	private SQLiteDatabase database;
	/** the database helper class */
	private CsDbHelper dbHelper;
	/** Used for formatting Campaign Dates for String storage */
	SimpleDateFormat iso8601;
	
	/** Constructor. Initializes context and iso8601*/
	public CsDbAdapter(Context context) {
		this.context = context;
		iso8601 = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
	}//CsDbAdapter

	/**
	 * Opens the database and gets write access.
	 */
	public CsDbAdapter open() throws SQLException {
		this.dbHelper = new CsDbHelper(context);
		this.database = dbHelper.getWritableDatabase();
		return this;
	}//CsDbAdapter

	/**
	 * Closes the database.
	 */
	public void close() {
		this.dbHelper.close();
	}//close
	
	/** Add a campaign to the database
	 * @param c Campaign object to store in the database */
	public long addCampaign(Campaign c) {
		//add the campaign to the database
		ContentValues vals = new ContentValues();
		vals.put(DB.NAME, c.getName());
		vals.put(DB.ID, c.getId());
		vals.put(DB.DESCRIPTION, c.getDescription());
		vals.put(DB.OWNER, c.getOwner());
		String[]temp = c.getLocations();
		String locations = "";
		for(int i=0; i<temp.length; i++) {
			locations += temp[i];
			if (i != temp.length-1) {
				locations += "|";
			}
		}
		vals.put(DB.LOCATIONS, locations);
		temp = c.getTimes();
		String times = "";
		for (int i = 0; i<temp.length; i++) {
			times += temp[i];
			if (i != temp.length-1) {
				times += "|";
			}
		}
		vals.put(DB.TIMES, times);
		vals.put(DB.START_DATE, iso8601.format(c.getStartDate()));
		vals.put(DB.END_DATE, iso8601.format(c.getEndDate()));
		long rowId = database.insert(DB.CAMPAIGN_TABLE, null, vals);
		if (rowId == -1){
			return rowId;
		}
		//now insert the task
		vals = new ContentValues();
		vals.put(DB.ID, c.getId());
		vals.put(DB.NAME, c.getTask().name);
		vals.put(DB.INSTRUCTIONS, c.getTask().instructions);
		temp = c.getTask().requirements;
		String requirements = "";
		for(int i = 0; i<temp.length; i++) {
			requirements += temp[i];
			if (i != temp.length - 1) {
				requirements += "|";
			}
		}
		vals.put(DB.REQUIREMENTS, requirements);
		//TODO insert qualifications
		rowId = database.insert(DB.TASK_TABLE, null, vals);
		if (rowId == -1){
			return rowId;
		}
		//lastly, insert the questions
		Question[] q = c.getTask().getForm().getQuestions();
		for (int i = 0; i< q.length; i++ ) {
			vals = new ContentValues();
			vals.put(DB.ID, c.getId());
			vals.put(DB.QUESTION, q[i].getQuestion());
			vals.put(DB.TYPE, q[i].getType());
			vals.put(DB.SINGLE_CHOICE, q[i].single_choice? 1:0);
			vals.put(DB.SINGLE_LINE, q[i].single_line? 1:0);
			temp = q[i].answers;
			String answers = "";
			//This is a little overchecked. FIXME
			if (temp != null) {//if it is a written response, not mutliple choice
				if (temp.length > 0) {
					for (int j = 0; j < temp.length; j++) {//TODO why the -1?
						if(temp[j]!=null) {
							answers += temp[j];
							if (j != temp.length - 1) {
								answers += "|";
							}
						}
					}
				}
			}
			vals.put(DB.ANSWERS, answers);
			rowId = database.insert(DB.QUESTIONS_TABLE, null, vals);
			if (rowId == -1) {
				return rowId;
			}
		}
		return 0L;
	}//addCampaign
	   
	/**
	 * Deletes a Campaign from database (and the tasks and questions associated
	 * with it).
	 * @param c campaign to delete
	 */
	public boolean deleteCampaign(Campaign c) {
		if(database.delete(DB.CAMPAIGN_TABLE, 
				           DB.ID + "=" + c.getId(), null) > 0) {
			if(database.delete(DB.TASK_TABLE, 
					           DB.ID + "=" + c.getId(), null) > 0) {
				return (database.delete(DB.QUESTIONS_TABLE, 
						                DB.ID + "=" + c.getId(), null) > 0);
	    			  
			}
		}
		return false;
	}//deleteCampaign
	 
	/** Get a campaign using its unique ID
	 * @param id the campaign's ID*/
	public Campaign getCampaignById(String id) {
		Cursor cur = database.query(DB.CAMPAIGN_TABLE, 
				                    new String[]{DB.ID,
				                                 DB.NAME,
				                                 DB.DESCRIPTION,
				                                 DB.OWNER,
				                                 DB.LOCATIONS,
				                                 DB.TIMES,
				                                 DB.START_DATE,
				                                 DB.END_DATE}, 
				                                 DB.ID + "=\"" + id + "\"", 
				                                 null, null, null, null);
		if (cur == null) {
			return null;
		}
		cur.moveToFirst();
		if (cur.isAfterLast()) {
			cur.close();
			return null;
		}
		Campaign campaign = new Campaign();
		campaign.setId(cur.getString(cur.getColumnIndex(DB.ID)));
		campaign.setName(cur.getString(cur.getColumnIndex(DB.NAME)));
		campaign.setDescription(cur.getString(cur.getColumnIndex(DB.DESCRIPTION)));
		campaign.setOwner(cur.getString(cur.getColumnIndex(DB.OWNER)));
		campaign.setLocations(cur.getString(cur.getColumnIndex(DB.LOCATIONS)).split("|"));
		campaign.setTimes(cur.getString(cur.getColumnIndex(DB.TIMES)).split("|"));
		try {
			campaign.setStartDate(iso8601.parse(cur.getString(cur.getColumnIndex(DB.START_DATE))));
			campaign.setEndDate(iso8601.parse(cur.getString(cur.getColumnIndex(DB.END_DATE))));
		} catch (ParseException e) {
			if (Constants.DEBUG) {
				Log.e("GET Campaign Failed", "unable to parse dates");
			}
		}
		
		cur = database.query(DB.TASK_TABLE, 
				             new String[]{DB.ID,
				                          DB.NAME,
				                          DB.INSTRUCTIONS,
				                          DB.REQUIREMENTS}, 
				                          DB.ID + "=\"" + id + "\"", 
				                          null, null, null, null);
		if (cur == null) {
			return null;
		}
		cur.moveToFirst();
		if (cur.isAfterLast()) {
			cur.close();
			return null;
		}
		Task task = campaign.
		        new Task(cur.getString(cur.getColumnIndex(DB.NAME)),
				cur.getString(cur.getColumnIndex(DB.INSTRUCTIONS)),
				cur.getString(cur.getColumnIndex(DB.REQUIREMENTS)).split("|"));
		cur = database.query(DB.TASK_TABLE, 
				             new String[]{DB.ID,
				                          DB.NAME,
				                          DB.INSTRUCTIONS,
				                          DB.REQUIREMENTS}, 
				                          DB.ID + "=\"" + id + "\"", 
				                          null, null, null, null);
		if (cur == null) {
			return null;
		}
		cur.moveToFirst();
		if (cur.isAfterLast()) {
			cur.close();
			return null;
		}
		cur = database.query(DB.QUESTIONS_TABLE, 
				             new String[]{DB.ID,
				                          DB.QUESTION,
				                          DB.TYPE,
				                          DB.SINGLE_CHOICE,
				                          DB.SINGLE_LINE,
				                          DB.ANSWERS},  
				                          DB.ID + "=\"" + id + "\"",
				                          null, null, null, null);
		if (cur == null) {
			return null;
		}
		cur.moveToFirst();
		if (cur.isAfterLast()) {
			cur.close();
			return null;
		}
		Form form = task.new Form();
		Question q;
		do {
			boolean options;
			int temp = cur.getInt(cur.getColumnIndex(DB.SINGLE_CHOICE));
			options = (temp == 1)? true:false;
			temp = cur.getInt(cur.getColumnIndex(DB.SINGLE_LINE));
			options = ((temp == 1? true:false) | options);
			q = new Question(cur.getString(cur.getColumnIndex(DB.QUESTION)),
					  cur.getInt(cur.getColumnIndex(DB.TYPE)),
					  cur.getString(cur.getColumnIndex(DB.ANSWERS)).split("|"),
					  options);
			form.addQuestion(q);
		} while (cur.moveToNext());
		return campaign;
	}//getCampaignById
	   
	public long size() {
		//TODO return database size.
		return 0;
	}//size
}//CsDbAdapter
