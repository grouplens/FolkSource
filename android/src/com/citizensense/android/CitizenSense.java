/* Copyright (c) 2006-2011 Regents of the University of Minnesota.
   For licensing terms, see the file LICENSE.
 */

package com.citizensense.android;

import android.app.TabActivity;
import android.content.Intent;
import android.content.res.Resources;
import android.os.Bundle;
import android.view.View;
import android.view.View.OnClickListener;
import android.widget.ImageView;
import android.widget.TabHost;
import android.widget.TextView;
import android.widget.Toast;

/**
 * Main Activity
 * @author Phil Brown
 */
public class CitizenSense extends TabActivity implements OnClickListener {
    
	
	
    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.main);
        
        /*
         * case R.id.updates_menu_image:
		case R.id.updates_menu_menu:
		case R.id.updates_menu_text:
			Toast.makeText(CitizenSense.this, "updates", Toast.LENGTH_SHORT).show();
			break;
		case R.id.quick_profile_image:
		case R.id.quick_profile_menu:
		case R.id.quick_profile_pts:
		case R.id.quick_profile_text:
         */
        
        ((ImageView) findViewById(R.id.updates_menu_image)).setOnClickListener(this);
        ((ImageView) findViewById(R.id.updates_menu_menu)).setOnClickListener(this);
        ((TextView) findViewById(R.id.updates_menu_text)).setOnClickListener(this);
        ((ImageView) findViewById(R.id.quick_profile_image)).setOnClickListener(this);
        ((ImageView) findViewById(R.id.quick_profile_menu)).setOnClickListener(this);
        ((TextView) findViewById(R.id.quick_profile_text)).setOnClickListener(this);
        ((TextView) findViewById(R.id.quick_profile_pts)).setOnClickListener(this);
        
        Resources res = getResources(); // Resource object to get Drawables
        TabHost tabHost = getTabHost();  // The activity TabHost
        TabHost.TabSpec spec;  // Resusable TabSpec for each tab
        Intent intent;  // Reusable Intent for each tab

        // Create an Intent to launch an Activity for the tab (to be reused)
        intent = new Intent().setClass(this, Home.class);

        // Initialize a TabSpec for each tab and add it to the TabHost
        spec = tabHost.newTabSpec("home").setIndicator("",
                          res.getDrawable(R.drawable.ic_tab_home))
                      .setContent(intent);
        
        tabHost.addTab(spec);

        // Do the same for the other tabs
        intent = new Intent().setClass(this, Map.class);
        spec = tabHost.newTabSpec("map").setIndicator("Map",
                          res.getDrawable(R.drawable.ic_tab_artists))
                      .setContent(intent);
        tabHost.addTab(spec);
        
        intent = new Intent().setClass(this, Profile.class);
        spec = tabHost.newTabSpec("profile").setIndicator("me",
                          res.getDrawable(R.drawable.ic_tab_artists))
                      .setContent(intent);
        tabHost.addTab(spec);

        
        //TODO onSavedInstanceState
        tabHost.setCurrentTab(0);
    }

	@Override
	public void onClick(View v) {
		switch(v.getId()) {
		case R.id.updates_menu_image:
		case R.id.updates_menu_menu:
		case R.id.updates_menu_text:
			Toast.makeText(CitizenSense.this, "updates", Toast.LENGTH_SHORT).show();
			break;
		case R.id.quick_profile_image:
		case R.id.quick_profile_menu:
		case R.id.quick_profile_pts:
		case R.id.quick_profile_text:
			Toast.makeText(CitizenSense.this, "profile", Toast.LENGTH_SHORT).show();
			break;
			
		}
		
	}

	
}