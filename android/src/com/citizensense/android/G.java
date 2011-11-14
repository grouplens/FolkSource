/* Copyright (c) 2006-2011 Regents of the University of Minnesota.
   For licensing terms, see the file LICENSE.
 */

package com.citizensense.android;

import java.util.ArrayList;

import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.location.Location;

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
	/** A location object used by the locationActivity */
	public static Location location;
	/** Call this function to start LocationService. */
	public static void startLocationService() {
		// set campaigns for LocationService
		LocationService.campaigns = MyCampaigns.staticGetCampaigns();

		if (LocationService.campaigns != null) {
			Intent intent = new Intent();
			intent.setClass(G.app_context, LocationService.class);
			G.app_context.startService(intent);
		}
	}
	
	/** Call this function to reset LocationService. */
	public static void resetLocationService() {
		stopLocationService();
		startLocationService();
	}

	/** Call this function to stop LocationService. */
	public static void stopLocationService() {
		LocationService.campaigns = null;
		Intent intent = new Intent();
		intent.setClass(G.app_context, LocationService.class);
		G.app_context.stopService(intent);
	}

	/** Send intent data to Map. */
	public static void sendIntentData(Context context,ArrayList<Campaign> campaigns) {
		Intent intent = new Intent(context, Map.class);
		intent.putParcelableArrayListExtra(
				context.getString(R.string.campaigns), campaigns);
		context.startActivity(intent);
	}

}// G
