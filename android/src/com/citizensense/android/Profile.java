/* Copyright (c) 2006-2011 Regents of the University of Minnesota.
   For licensing terms, see the file LICENSE.
 */

package com.citizensense.android;

import java.util.ArrayList;

import android.app.ListActivity;
import android.content.Context;
import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ArrayAdapter;
import android.widget.TextView;

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
	@Override
	public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.profile);
        campaigns = new ArrayList<Campaign>();
        ArrayList<String>campaign_ids = G.user.getCampaignIDs();
        for(int i = 0; i<campaign_ids.size(); i++) {
        	campaigns.add(G.db.getCampaignById(campaign_ids.get(i)));
        }
        setListAdapter(new CampaignListAdapter(this, campaigns));
	}//onCreate
	
	/** This adapter allows the list in the main view to be populated from the 
	 * list of campaigns that the user is participating in.*/
	class CampaignListAdapter extends ArrayAdapter<Campaign>{
		
		/** context in order to allow access to resources and system services */
		private Context context;
		
		/** Constructor.*/
		public CampaignListAdapter(Context c, ArrayList<Campaign> campaigns) {
			super(c, 0, campaigns);
			this.context = c;
		}//CampaignListAdapter
		
		/** Inflate the Campaign List Item view for each campaign in the list.*/
		@Override
		public View getView(int position, View convertView, ViewGroup parent) {
			View v = convertView;
			if (v == null) {
				LayoutInflater vi = 
					(LayoutInflater)context.getSystemService(
							Context.LAYOUT_INFLATER_SERVICE);
				v = vi.inflate(R.layout.campaign_list_item, null);
			}
			Campaign campaign = this.getItem(position);
			if(campaign != null) {
				TextView title = (TextView) v.findViewById(R.id.campaign_title);
				TextView stats = (TextView) v.findViewById(R.id.campaign_stats);
				TextView points = (TextView) v.findViewById(R.id.campaign_points);
				title.setText(campaign.getName());
				//FIXME
				stats.setText("46 participants   278 photos   high score: 465");
				points.setText("My Points: 120");
				if (G.user != null) {
					//TODO points.setText(G.user.getPoints());
				}
				//TODO add stats
			}
			return v;
		}//getView
	}//CampaignListAdapter
	 
}//Profile
