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
	
	@SuppressWarnings("unchecked")
	@Override
	public ArrayList<Campaign> getCampaigns() {
		return G.getMyCampaigns();
	}//getCampaigns
	
	
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
