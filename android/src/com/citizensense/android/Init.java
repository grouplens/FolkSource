/* Copyright (c) 2006-2011 Regents of the University of Minnesota.
   For licensing terms, see the file LICENSE.
 */

package com.citizensense.android;

import java.util.ArrayList;
import java.util.HashMap;

import android.app.Application;
import android.app.PendingIntent;
import android.content.Context;
import android.location.LocationManager;

import com.citizensense.android.conf.Constants;
import com.citizensense.android.db.CsDbAdapter;

/** This initialization file is called when the user first launches 
 * Citizen Sense.
 * @author Phil Brown
 */
public class Init extends Application {

	/** Initialize static variables.*/
	@Override 
	public void onCreate() {
		super.onCreate();
		G.memory = this.getSharedPreferences(Constants.MEM_LOC, 
				                             Context.MODE_PRIVATE);
		G.db = new CsDbAdapter(this);
		G.db.open();
		G.user = new User();
		G.app_context = this.getApplicationContext();
		//G.notification_id = 0;
		
		MyCampaigns.locationManager = (LocationManager) this.getSystemService(Context.LOCATION_SERVICE); 
		MyCampaigns.proximityMap = new HashMap<String, PendingIntent>();
		G.notificationIDs = new ArrayList<Integer>();
	}//onCreate
}//Init
