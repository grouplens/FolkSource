/* Copyright (c) 2006-2011 Regents of the University of Minnesota.
   For licensing terms, see the file LICENSE.
 */

package com.citizensense.android;

import java.util.ArrayList;
import java.util.HashMap;

import android.app.PendingIntent;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.location.Location;

import com.citizensense.android.db.CsDbAdapter;
import com.google.android.maps.MapView;

/**
 * This class allows static access to many of the most-used components of
 * Citizen Sense. This is similar to Cyclopath's G.java.
 * 
 * @author Phil Brown
 */

public class G {
	/** The Citizen Sense map */
	protected static MapView map;
	/** The currently logged-in user */
	public static User user;// FIXME make protected
	/** The DatabaseAdapter that handles most of the database transactions */
	public static CsDbAdapter db;// FIXME make protected
	/** The application context */
	public static Context app_context;
	/**
	 * Stores important info, including the number of campaigns in the database.
	 */
	public static SharedPreferences memory;
	/** A location object used by the locationActivity */
	public static Location location;
	
	/** HashMap stores PendingIntent for adding/removing ProximityAlert. */
	public static HashMap<String, PendingIntent> proximityMap;

	/** Call this function to start LocationService. */
	public static void startLocationService() {
		Intent intent = new Intent();
		intent.setClass(G.app_context, LocationService.class);
		G.app_context.startService(intent);
	}

	/** Call this function to reset LocationService. */
	public static void resetLocationService() {
		stopLocationService();
		startLocationService();
	}

	/** Call this function to stop LocationService. */
	public static void stopLocationService() {
		Intent intent = new Intent();
		intent.setClass(G.app_context, LocationService.class);
		G.app_context.stopService(intent);
	}

	/** Send intent data to Map. */
	public static void sendIntentData(Context context,
			ArrayList<Campaign> campaigns) {
		Intent intent = new Intent(context, Map.class);
		intent.putParcelableArrayListExtra(
				context.getString(R.string.campaigns), campaigns);
		context.startActivity(intent);
	}

	/** Get campaigns from the local database. */
	public static ArrayList<Campaign> getMyCampaigns() {
		ArrayList<Campaign> campaigns = new ArrayList<Campaign>();
		int j = 1;
		int index = 1;
		while (j <= G.db.size()) {
			ArrayList<Campaign> c = (ArrayList<Campaign>) G.db
					.getCampaign(Integer.toString(index));
			if (c != null) {
				campaigns.add(((ArrayList<Campaign>) G.db.getCampaign(Integer
						.toString(index))).get(0));
				j++;
			}
			index++;
		}
		return campaigns;
	}

}// G

