package com.citizensense.android.db;

import android.content.Context;
import android.database.sqlite.SQLiteDatabase;
import android.database.sqlite.SQLiteOpenHelper;

import com.citizensense.android.R;

public class CsDbHelper  extends SQLiteOpenHelper{
	
	Context context;

	/** Current version of the database (used for upgrades) */
	private static final int DATABASE_VERSION = 1;
	
	public CsDbHelper(Context context){
		super(context, DbConstants.DATABASE_NAME, null, DATABASE_VERSION);
		this.context = context;
	}

	@Override
	public void onCreate(SQLiteDatabase db) {
		// Create track table.
	      db.execSQL("CREATE TABLE " + getString(R.string.campaign_table)
	                 + " (" + getString(R.string.campaign_id)
	                 + " STRING PRIMARY KEY NOT NULL,"
	                 + getString(R.string.campaign_name) + " TEXT NOT NULL)");
		
	}

	@Override
	public void onUpgrade(SQLiteDatabase db, int oldVersion, int newVersion) {
		db.execSQL("DROP TABLE IF EXISTS " + getString(R.string.campaign_table));
		onCreate(db);
	}
	
	/** Convenience method for context.getString(int) */
	public String getString(int Resid) {
		return context.getString(Resid);
	}

}
