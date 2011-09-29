package com.citizensense.android;

import android.app.Activity;
import android.content.Intent;
import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.widget.Gallery;
import android.widget.ImageView;
import android.widget.TabHost;
import android.widget.TextView;

import com.citizensense.android.util.CampaignAdapter;

public class CampaignBrowser extends Activity {//TabActivity {

	View tabView;
	TabHost tabHost;
	
    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.campaign_browser);
/*
        tabHost = getTabHost();
        Intent intent;
        
        intent = new Intent().setClass(this, Home.class);
        includeTab(intent, "list", "List", 0);

        intent = new Intent().setClass(this, Home.class);
        includeTab(intent, "gallery", "Gallery", 0);
        
        intent = new Intent().setClass(this, Home.class);
        includeTab(intent, "map", "Map", 0);

        //TODO onSavedInstanceState
        tabHost.setCurrentTab(0);
*/
        //TODO inflate the gallery
        Gallery cf = (Gallery) findViewById(R.id.gallery);
        cf.setAdapter(new CampaignAdapter(this));
    }
    
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
    }
}
