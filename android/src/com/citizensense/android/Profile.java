/* Copyright (c) 2006-2011 Regents of the University of Minnesota.
   For licensing terms, see the file LICENSE.
 */

package com.citizensense.android;

import java.util.ArrayList;

import android.app.ListActivity;
import android.os.Bundle;

import com.citizensense.android.util.CampaignListAdapter;

/**
 * User's main profile page. Has a picture, user info, and statuses on incentives
 * and participation in subscribed campaigns.
 * @author Phil Brown
 *
 */
public class Profile extends ListActivity {

	/** The campaigns that the user is currently participating in.
	 * TODO This ought to be moved to a new tab called "My Campaigns"*/
	ArrayList<Campaign> campaigns;
	
	/** Create the view*/
	@SuppressWarnings("unchecked")
	@Override
	public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.profile);
        campaigns = new ArrayList<Campaign>();
        ArrayList<String>campaign_ids = G.user.getCampaignIDs();
        /*
        for(int i = 0; i<campaign_ids.size(); i++) {
        	campaigns.add(((ArrayList<Campaign>) G.db.getCampaign(campaign_ids.get(i))).get(0));
        }
        */
        setListAdapter(new CampaignListAdapter(this, campaigns));
	}//onCreate
	
	
	 
}//Profile
