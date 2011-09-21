package com.citizensense.android;

import com.citizensense.android.db.CsDbAdapter;

import android.app.Application;

public class Init extends Application {

	@Override public void onCreate() {
		G.db = new CsDbAdapter(this);
		G.db.open();
		G.user = new User();
		G.user.login("", "");
	}
}
