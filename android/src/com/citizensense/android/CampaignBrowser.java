/* Copyright (c) 2006-2011 Regents of the University of Minnesota.
   For licensing terms, see the file LICENSE.
 */

package com.citizensense.android;

import android.app.Activity;
import android.os.Bundle;
import android.widget.Gallery;

import com.citizensense.android.util.CampaignAdapter;

/**
 * The campaign browser allows users to view active campaigns in an "app-store"
 * style browser.
 * @author Phil Brown
 */
public class CampaignBrowser extends Activity {
	
	/** Inflate the view*/
    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.campaign_browser);
        Gallery gallery = (Gallery) findViewById(R.id.gallery);
        gallery.setAdapter(new CampaignAdapter(this));
    }//onCreate
}//CampaignBrowser
