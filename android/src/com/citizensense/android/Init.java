package com.citizensense.android;

import android.app.Application;

import com.citizensense.android.db.CsDbAdapter;

public class Init extends Application {

	@Override public void onCreate() {
		super.onCreate();
		G.db = new CsDbAdapter(this);
		G.db.open();
		G.user = new User();
		G.user.login("", "");
		G.app_context = this.getApplicationContext();
	}
}
