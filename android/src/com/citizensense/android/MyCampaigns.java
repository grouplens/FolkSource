/* Copyright (c) 2006-2011 Regents of the University of Minnesota.
   For licensing terms, see the file LICENSE.
 */

package com.citizensense.android;

import java.util.ArrayList;
import java.util.HashMap;

import android.app.PendingIntent;
import android.content.Intent;
import android.content.IntentFilter;
import android.location.LocationManager;
import android.view.ContextMenu;
import android.view.ContextMenu.ContextMenuInfo;
import android.view.MenuInflater;
import android.view.MenuItem;
import android.view.View;

import com.citizensense.android.conf.Constants;
import com.google.android.maps.GeoPoint;

/** 
 * Shows the campaigns that the user has downloaded
 * @author Phil Brown
 * @author Renji Yu
 */
public class MyCampaigns extends CampaignExplorer {
	
	/** Referenced in {@link #onContextItemSelected(MenuItem)} to know which
	 * item was clicked. */
	private boolean list_clicked;
	
	/** Contains a copy of the campaigns in the database. This is used to 
	 * determine if and when a {@link ProximityAlert} should be added or removed.*/
	private ArrayList<Campaign> myCampaigns;
	
	/** HashMap stores PendingIntent for adding/removing ProximityAlert. */
	public static HashMap<String, PendingIntent> proximityMap;
	
	/** manager for location updates */
	public static LocationManager locationManager;
	
	@Override
	public void onResume() {
		super.onResume();
		if (G.notification_campaign_id != null) {
			String c_id = G.notification_campaign_id;
			for (int i = 0; i < campaigns.size(); i++) {
				Campaign c = campaigns.get(i);
				if (c.getId().equals(c_id)) {
					this.gallery.setSelection(i);//, true);
					break;
				}
			}
		}
	}//onResume
	
	@SuppressWarnings("unchecked")
	@Override
	public ArrayList<Campaign> getCampaigns() {
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
		this.campaigns = campaigns;//not too slick here, but needed
		if (myCampaigns == null) {
			this.setProximityAlerts();
		}
		else {
			this.resetProximityAlerts();
		}
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
	
	/** Set proximity alerts for all campaigns. */
	@SuppressWarnings("unchecked")
	public void setProximityAlerts() {
		if (campaigns.size() == 0)
			return;
		for (Campaign c : campaigns) {
			addProximityAlert(c);
		}
		myCampaigns = (ArrayList<Campaign>) campaigns.clone();
	}//setProximityAlerts
	
	/** This two-step process updates the proximity alerts in Citizen Sense by
	 * first removing extra Proximity Alerts, then adding the ones that have
	 * yet to be added. */
	public void resetProximityAlerts() {
		for (int index = 0; index < myCampaigns.size(); index++) {
			Campaign c = myCampaigns.get(index);
			if (!campaigns.contains(c)) {
				removeProximityAlert(c);
			}
		}
		for (int index = 0; index < campaigns.size(); index++) {
			Campaign c = campaigns.get(index);
			if (!myCampaigns.contains(c)) {
				addProximityAlert(c);
			}
		}
	}//resetProximityAlerts

	/** Add a proximity alert for the given campaign
	 * @param campaign */
	public static void addProximityAlert(Campaign campaign) {
		String proximityMapKey;
		for (String loc : campaign.getLocations()) {
			GeoPoint point = Map.getGeopoint(G.app_context, loc);
			if (point != null) {
				double latitude = (double) point.getLatitudeE6() / 1E6;
				double longitude = (double) point.getLongitudeE6() / 1E6;
				proximityMapKey = campaign.getId() + ":" + campaign.getName() + ":" + loc;
				Intent intent = new Intent(proximityMapKey);
				//put Campaign information, so the notification can show the campaign name
				intent.putExtra(G.app_context.getString(R.string.proximity_alert_intent), proximityMapKey);
				PendingIntent proximityIntent = PendingIntent.getBroadcast(
						G.app_context, 0, intent, PendingIntent.FLAG_CANCEL_CURRENT);
				proximityMap.put(proximityMapKey, proximityIntent);
				locationManager.addProximityAlert(latitude, 
						                          longitude,
						                          Map.getRadius(loc), 
						                          Constants.PROXIMITY_ALERT_EXPIRATION,
						                          proximityIntent);
				IntentFilter filter = new IntentFilter(proximityMapKey);
				G.app_context.registerReceiver(new ProximityIntentReceiver(), filter);
			}
		}
	}//addProximityAlert

	/** Remove proximity alert for the given campaign.
	 * @param campaign */
	public static void removeProximityAlert(Campaign campaign) {
		for (String loc : campaign.getLocations()) {
			String proximityMapKey = campaign.getId() + ":" + campaign.getName() + ":" + loc;
			PendingIntent proximityIntent = proximityMap.get(proximityMapKey);
			if (proximityIntent != null) {
				locationManager.removeProximityAlert(proximityIntent);
				proximityMap.remove(proximityMapKey);
			}
		}
	}//removeProximityAlert
	
}//MyCampaigns
