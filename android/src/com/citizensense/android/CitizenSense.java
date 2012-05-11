/* Copyright (c) 2006-2011 Regents of the University of Minnesota.
   For licensing terms, see the file LICENSE.
 */

package com.citizensense.android;

import com.citizensense.android.util.ActivityHeader;

import android.app.TabActivity;
import android.content.Intent;
import android.os.Bundle;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.View.OnClickListener;
import android.widget.ImageView;
import android.widget.TabHost;
import android.widget.TextView;
import android.widget.Toast;

/**
 * Main Activity
 * @author Phil Brown
 * @author Renji Yu
 */
public class CitizenSense extends TabActivity {
    
	/** Reference to the tab controller*/
	static TabHost tabHost;
	

	/** Reference to the view inside the tabHost*/
	private View tabView;
	
	/** Reference to the header view */
	private View headerView; 
	/** Designed to update the header view */
	private ActivityHeader header;
	
	
	/** Inflate the view and set the tab functions.*/
    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.main);
        
        headerView = findViewById(R.id.header);
        header = new ActivityHeader(headerView);
        
        tabHost = getTabHost();
        Intent intent;
        intent = new Intent().setClass(this, CampaignBrowser.class);
        includeTab(intent, "home", null, android.R.drawable.ic_menu_search);
        intent = new Intent().setClass(this, Profile.class);
        includeTab(intent, "profile", null, android.R.drawable.ic_menu_myplaces);
        
        //TODO Save the last tab they were on and store it in sharedPreferences
        //or in the onSavedInstanceState bundle
        tabHost.setCurrentTab(0);
        
    }//onCreate


    
	@Override 
	public void onDestroy() {
		super.onDestroy();
		G.user.setUsername(null);
	};
	
    @Override
    public void onResume() {
    	super.onResume();
    	
    	header.updateHeader();
    	
    	if (G.user.getUsername() == null) {
    		Intent intent = new Intent(this, Login.class);
    		startActivity(intent);
    	}
    	Intent intent = getIntent();
		if (intent != null) {
			//open the campaign (this has been opened from a PendingIntent).
			String c_id = intent.getStringExtra(getString(R.string.campaign_intent));
			G.notification_campaign_id = c_id;
			if (c_id != null) {
				openHome();
			}
		}
		else {
			G.notification_campaign_id = null;
		}
//		((TextView) findViewById(R.id.quick_profile_pts)).setText(G.user.points);
    }//onResume
    
    /** Open the map tab*/
    public static void openMap() {
    	tabHost.setCurrentTab(1);
    }//openMap
    
//    /** Open the My Campaigns tab*/
//    public static void openMyCampaigns() {
//    	tabHost.setCurrentTab(1);
//    }//openMyCampaigns
    
    /** Open the Home tab*/
    public static void openHome() {
    	tabHost.setCurrentTab(0);
    }//openHome
    
    /** Open the Profile tab*/
    public static void openProfile() {
    	tabHost.setCurrentTab(2);
    }//openProfile
    
    /**
     * Include tab in the layout
     * @param intent Intent to call when the tab is selected
     * @param tag Tag to reference this tab
     * @param text Text displayed on this tab
     * @param resid Image resource of the drawable for the tab
     */
    public void includeTab(Intent intent, String tag, String text, int resid) {
    	tabView = LayoutInflater.from(this).inflate(R.layout.tab, null);
    	if (text != null) {
    		((TextView) tabView.findViewById(R.id.tab_text)).setText(text);
    	}
    	else {
    		((TextView) tabView.findViewById(R.id.tab_text)).setVisibility(View.GONE);
    	}
    	if (resid != 0) {
    		((ImageView) tabView.findViewById(R.id.tab_image)).setBackgroundResource(resid);
    	}
    	else {
    		((ImageView) tabView.findViewById(R.id.tab_image)).setVisibility(View.GONE);
    	}
   		tabHost.addTab(tabHost.newTabSpec(tag).setIndicator(tabView).setContent(intent));
    }//includeTab

	
	
}//CitizenSense