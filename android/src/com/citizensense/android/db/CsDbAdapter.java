package com.citizensense.android.db;

import android.content.ContentValues;
import android.content.Context;
import android.database.Cursor;
import android.database.SQLException;
import android.database.sqlite.SQLiteDatabase;

import com.citizensense.android.Campaign;
import com.citizensense.android.R;

/**
 * This class handles database actions such as adding and retrieving campaigns.
 * @author Phil Brown
 */
public class CsDbAdapter {

	private Context context;
	/** the actual database */
	private SQLiteDatabase database;
	/** the database helper class */
	private CsDbHelper dbHelper;
	
	public CsDbAdapter(Context context) {
		this.context = context;
	}
	// *** Main database methods

	   /**
	    * Opens the database and makes it available for writing.
	    */
	   public CsDbAdapter open() throws SQLException {
	      this.dbHelper = new CsDbHelper(context);
	      this.database = dbHelper.getWritableDatabase();
	      return this;
	   }

	   /**
	    * Closes the database.
	    */
	   public void close() {
	      this.dbHelper.close();
	   }
	
	   public long addCampaign(Campaign c) {
		   ContentValues vals = new ContentValues();
		   vals.put(getString(R.string.campaign_name), c.getName());
		   vals.put(getString(R.string.campaign_id), c.getId());
		   //TODO put the rest of the info
		   return database.insert(getString(R.string.campaign_table), null, vals);
	   }
	   
	   /**
	    * Deletes Campaign from database.
	    */
	   public boolean deleteCampaign(Campaign c) {
	      return database.delete(getString(R.string.campaign_table),
	                             getString(R.string.campaign_id) 
	                             + "=" + c.getId(), null) > 0;
	   }
	   
	   /** Convenience method for context.getString(int) */
	   public String getString(int Resid) {
		   return context.getString(Resid);
	   }
	   
	   //TODO more methods
	   public Campaign getCampaignById(String id) {
		   Cursor cur = database.query(getString(R.string.campaign_table), 
				                       new String[]{getString(R.string.campaign_id),
			   						                getString(R.string.campaign_name)}, 
				                       getString(R.string.campaign_id) + "=\"" + id + "\"", 
				                       null, null, null, null);
		   if (cur == null)
			   return null;
		   cur.moveToFirst();
		   if (cur.isAfterLast()) {
			   cur.close();
			   return null;
		   }
		   return new Campaign(cur.getString(cur.getColumnIndex(getString(R.string.campaign_id))), 
				        cur.getString(cur.getColumnIndex(getString(R.string.campaign_name))));
	   }
}
