/* Copyright (c) 2006-2011 Regents of the University of Minnesota.
   For licensing terms, see the file LICENSE.
 */

package com.citizensense.android;

import java.util.ArrayList;

import android.view.ContextMenu;
import android.view.MenuInflater;
import android.view.MenuItem;
import android.view.View;
import android.view.ContextMenu.ContextMenuInfo;

/** 
 * Shows the campaigns that the user has downloaded
 * @author Phil Brown
 */
public class MyCampaigns extends CampaignExplorer {
	
	@Override 
	public void onResume(){
		super.onResume();
		System.out.println(staticGetCampaigns().size());
	}
	
	@SuppressWarnings("unchecked")
	@Override
	public ArrayList<Campaign> getCampaigns() {
		return staticGetCampaigns();
	}//getCampaigns
	
	public static ArrayList<Campaign> staticGetCampaigns() {
		ArrayList<Campaign> campaigns = new ArrayList<Campaign>();
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
		return campaigns;
	}
	
	@Override
	public void onCreateContextMenu(ContextMenu menu, View v,
			ContextMenuInfo menuInfo) {
		super.onCreateContextMenu(menu, v, menuInfo);
		MenuInflater inflater = getMenuInflater();
		menu.setHeaderTitle((campaigns.get(this.current_gallery_position)).getName());
		inflater.inflate(R.menu.my_campaigns_context_menu, menu);
	}//onCreateContextMenu

	@Override
	public boolean onContextItemSelected(MenuItem item) {
		switch (item.getItemId()) {
		/* Remove the campaign to the local database*/
		case R.id.delete:
			G.db.deleteCampaign((campaigns.get(this.current_gallery_position)));
			refresh();
			return true;
		}
		return super.onContextItemSelected(item);
	}//onContextItemSelected
	
	
	
}//MyCampaigns
