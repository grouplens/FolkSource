/* Copyright (c) 2006-2011 Regents of the University of Minnesota.
   For licensing terms, see the file LICENSE.
 */

package com.citizensense.android.conf;

/** Configuration constants
 * @author Phil Brown
 */
public interface Constants {

	/** This tag is used to determine whether or not to print a Log statement
	 * in many places throughout the app.*/
	public static final boolean DEBUG = true;
	
	/** This is used to denote whether or not to use local campaigns for testing*/
	public static final boolean localCampaignsOnly = true;
	
	/** The name of the sharedPreferences file where G.memory is located.*/
	public static final String MEM_LOC = "citizenSenseMem";
	
	/** Reference to a sharedPreferences item in MEM_LOC*/
	public static final String DB_SIZE = "db_size";
	
	public static final String DB_DATE_FORMAT = "MM/dd/yyyy";
	
	/** Minimum time between updates for the network location listener in the
	 * main activity. */
	public static final long MAIN_NETWORK_TIME_BETWEEN_UPDATES = 1000 * 1;
	/** Minimum time between updates for the GPS location listener in the
	 * main activity. */
	public static final long MAIN_GPS_TIME_BETWEEN_UPDATES = 1000 * 60;
	/** Minimum time between updates for the GPS location listener in the
	 * tracking service. */
	public static final long SERVICE_GPS_TIME_BETWEEN_UPDATES = 1000 * 1;
	/** Minimum distance between updates for location listeners (in meters) */
	public static final long MIN_DISTANCE_BETWEEN_UPDATES = 1;
	/** This is a type of campaign location*/
	public static final boolean EXACT_LOCATION = true,
	                            NONEXACT_LOCATION = false;
	/** This is used when creating new Proximity Alerts in 
	 * {@link com.citizensense.android.MyCampaigns MyCampaigns}. Setting the
	 * expiration to -1 will set the alert to never expire. Otherwise, set this
	 * to a time, in millisecods, for the alert to expire.  */
	public static final int PROXIMITY_ALERT_EXPIRATION = -1;
	
	/* These variables are used to indicate the result of Login*/
	public static final int LOGIN_SUCCESS = 1;
	public static final int LOGIN_WRONG_PASSWORD = 2;
	public static final int LOGIN_NO_USERNAME = 3;
	
	/* These variables are used to indicate the result of Registration*/
	public static final int REGISTRATION_SUCCESS = 1;
	public static final int REGISTRATION_FAILURE = 2;
}//Constants
