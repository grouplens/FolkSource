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
	public static final boolean DEBUG=true;
	
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
}//Constants
