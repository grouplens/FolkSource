/* Copyright (c) 2006-2011 Regents of the University of Minnesota.
   For licensing terms, see the file LICENSE.
 */

package com.citizensense.android.util;


import java.util.ArrayList;

import android.content.Context;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ArrayAdapter;
import android.widget.TextView;

import com.citizensense.android.Campaign;
import com.citizensense.android.G;
import com.citizensense.android.R;

/**
 * Inflates a Campaign item as a list
 * @author Phil Brown
 */
public class CampaignListAdapter extends ArrayAdapter<Campaign> {
	
	/** context in order to allow access to resources and system services */
	private Context context;
	
	private ArrayList<Campaign> campaigns;
	
	/** Constructor.*/
	public CampaignListAdapter(Context c, ArrayList<Campaign> campaigns) {
		super(c, 0, campaigns);
		this.context = c;
		this.campaigns = campaigns;
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
		Campaign campaign = campaigns.get(position);//this.getItem(position);
		if(campaign != null) {
			TextView title = (TextView) v.findViewById(R.id.campaign_title);
			TextView stats = (TextView) v.findViewById(R.id.campaign_stats);
			//TextView points = (TextView) v.findViewById(R.id.campaign_points);
			title.setText(campaign.getName());
			//FIXME
			stats.setText("46 participants   278 photos   high score: 465");
			//points.setText("My Points: 120");
			if (G.user != null) {
				//TODO points.setText(G.user.getPoints());
			}
		}
		return v;
	}//getView
}//CampaignListAdapter
