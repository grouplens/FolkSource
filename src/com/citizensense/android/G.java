/* Copyright (c) 2006-2011 Regents of the University of Minnesota.
   For licensing terms, see the file LICENSE.
 */

package com.citizensense.android;

import java.util.ArrayList;

import android.content.Context;
import android.content.SharedPreferences;

import com.citizensense.android.db.CsDbAdapter;
import com.google.android.maps.MapView;

/**
 * This class allows static access to many of the most-used components of 
 * Citizen Sense. This is similar to Cyclopath's G.java.
 * @author Phil Brown
 */

public class G {
	/** The Citizen Sense map*/
	protected static MapView map;
	/** The currently logged-in user*/
	public static User user;//FIXME make protected
	/** The DatabaseAdapter that handles most of the database transactions*/
	public static CsDbAdapter db;//FIXME make protected
	/** The application context*/
	public static Context app_context;
	/** Stores important info, including the number of campaigns in the database. */
	public static SharedPreferences memory;
	
	public static ArrayList<Campaign> globalCampaigns;
}//G
