/* Copyright (c) 2006-2011 Regents of the University of Minnesota.
   For licensing terms, see the file LICENSE.
 */

package com.citizensense.android;

import android.app.Activity;
import android.content.Intent;
import android.os.Bundle;

/**
 * Displays a Campaign object to the user.
 * @author Phil Brown
 */
public class CampaignView extends Activity {

	/** The campaign represented in the view. */
	Campaign campaign;
	
	@Override
	public void onCreate(Bundle savedInstanceState) {
		super.onCreate(savedInstanceState);
		handleIntent();
		//TODO inflate view using the campaign object. 
	}//onCreate
	
	public void handleIntent() {
		Intent intent = this.getIntent();
		//TODO this.campaign = intent.getParcelableExtra(getString(R.string.campaign_intent));
	}//handleIntent
}//CampaignView
