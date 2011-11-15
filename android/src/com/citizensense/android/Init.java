/* Copyright (c) 2006-2011 Regents of the University of Minnesota.
   For licensing terms, see the file LICENSE.
 */

package com.citizensense.android;

import android.app.Application;
import android.content.Context;
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
		G.user.login("", "");//TODO remove this, handle logins another way.
		G.app_context = this.getApplicationContext();

		G.startLocationService();
	}//onCreate
}//Init
