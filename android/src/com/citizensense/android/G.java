/* Copyright (c) 2006-2011 Regents of the University of Minnesota.
   For licensing terms, see the file LICENSE.
 */

package com.citizensense.android;

import java.util.ArrayList;
import java.util.List;

import android.content.Context;
import android.content.SharedPreferences;
import android.location.Location;

import com.citizensense.android.conf.Constants;
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
	//TODO remove this. Instead, use intent
	public static ArrayList<Campaign> globalCampaigns;
	/** This is used when a user clicks a notification in order to open the correct
	 * campaign.*/
	public static String notification_campaign_id;
	/** Flags used for opening new tabs in {@link CitizenSense}*/
	public static int TAB_OPTIONS = Constants.DEFAULT_TAB_OPTION;
	
	public static List<Integer> notificationIDs;
	public static boolean isNotificationNew(int id) {
		if (notificationIDs.contains(id)) {
			return false;
		}
		return true;
	}//isNotificationNew
}//G
