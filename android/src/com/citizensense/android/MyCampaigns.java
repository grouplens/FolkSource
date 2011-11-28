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
	
	/** Referenced in {@link #onContextItemSelected(MenuItem)} to know which
	 * item was clicked. */
	private boolean list_clicked;
	
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
	
	@Override
	public void onCreateContextMenu(ContextMenu menu, View v,
			ContextMenuInfo menuInfo) {
		super.onCreateContextMenu(menu, v, menuInfo);
		MenuInflater inflater = getMenuInflater();
		switch(v.getId()) {
			case (R.id.campaign_gallery) : {
				menu.setHeaderTitle((campaigns.get(this.current_gallery_position)).getName());
				list_clicked = false;
				break;
			}
			case (android.R.id.list) : {
				menu.setHeaderTitle((campaigns.get(this.current_list_position)).getName());
				list_clicked = true;
				break;
			}
			default : {
				menu.setHeaderTitle("Campaign");
				list_clicked = false;
				break;
			}
		}
		inflater.inflate(R.menu.my_campaigns_context_menu, menu);
	}//onCreateContextMenu

	@Override
	public boolean onContextItemSelected(MenuItem item) {
		switch (item.getItemId()) {
		/* Remove the campaign from the local database*/
		case R.id.delete:
			if (this.list_clicked) {
				G.db.deleteCampaign((campaigns.get(this.current_list_position)));
			} 
			else {
				G.db.deleteCampaign((campaigns.get(this.current_gallery_position)));
			}
			refresh();
			return true;
		}
		return super.onContextItemSelected(item);
	}//onContextItemSelected
	
}//MyCampaigns
