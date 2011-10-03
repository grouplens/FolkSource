/* Copyright (c) 2006-2011 Regents of the University of Minnesota.
   For licensing terms, see the file LICENSE.
 */

package com.citizensense.android;

import java.util.ArrayList;

import android.widget.Toast;

import com.citizensense.android.util.CampaignGalleryAdapter;
import com.citizensense.android.util.CampaignListAdapter;

/** 
 * Shows the campaigns that the user has downloaded
 * @author Phil Brown
 */
public class MyCampaigns extends CampaignExplorer {

	@Override
	public void onResume() {
		campaigns = getCampaigns();
		if (campaigns != null) {
			listAdapter = new CampaignListAdapter(this, campaigns);
			setListAdapter(listAdapter); 
			galleryAdapter = new CampaignGalleryAdapter(this, campaigns);
			gallery.setAdapter(galleryAdapter);
		}
		super.onResume();
	}//onCreate
	
	@SuppressWarnings("unchecked")
	@Override
	public ArrayList<Campaign> getCampaigns() {
		ArrayList<Campaign> campaigns = new ArrayList<Campaign>();
		//long j = G.db.size();
		//Toast.makeText(getApplicationContext(), "Size: " + j, Toast.LENGTH_SHORT).show();
		int j = 1;
		int index = 1;
		while (j <= G.db.size()) {
			ArrayList<Campaign> c = (ArrayList<Campaign>) G.db.getCampaign(Integer.toString(index));
			if (c != null) {
				campaigns.add(((ArrayList<Campaign>) G.db.getCampaign(Integer.toString(index))).get(0));
				j++;
			}
			index++;
		}
		/*
		for (int i=1; i<=G.db.size(); i++) {
			ArrayList<Campaign> c = (ArrayList<Campaign>) G.db.getCampaign(Integer.toString(i));
			if (c != null) {
				campaigns.add(((ArrayList<Campaign>) G.db.getCampaign(Integer.toString(i))).get(0));
			}
		}
		*/
		return campaigns;
	}//getCampaigns
	
	
	
}//MyCampaigns
