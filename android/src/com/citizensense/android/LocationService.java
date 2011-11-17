/* Copyright (c) 2006-2011 Regents of the University of Minnesota.
   For licensing terms, see the file LICENSE.
 */

package com.citizensense.android;

import java.util.ArrayList;
import java.util.HashMap;

import android.app.PendingIntent;
import android.app.Service;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.location.Location;
import android.location.LocationListener;
import android.location.LocationManager;
import android.os.Bundle;
import android.os.IBinder;

import com.citizensense.android.conf.Constants;
import com.google.android.maps.GeoPoint;

/**
 * Background service that handles location related functionalities.
 * Right now it provides proximity alert service.
 * @author Renji Yu
 */
public class LocationService extends Service {

	/** manager for location updates */
	private LocationManager locationManager;

	/** campaigns to be checked */
	private ArrayList<Campaign> campaigns;

	/** used for checking whether a campaign is added or removed */
	private ArrayList<Campaign> previousCampaigns;

	/**
	 * Required method, but not used by us for now.
	 */
	@Override
	public IBinder onBind(Intent intent) {
		return null;
	}

	/**
	 * Sets up the notification and location managers.
	 */
	@Override
	public void onCreate() {
		super.onCreate();
		// register for location updates
		this.locationManager = (LocationManager) this
				.getSystemService(Context.LOCATION_SERVICE);

		campaigns = G.getMyCampaigns();
		if (previousCampaigns == null) {// It's the first time to call
										// LocationService
			setProximityAlert();
		} else {// Not the first time, check for updates
			resetProximityAlert();
		}
	}

	/** Set proximity alert for all campaigns. */
	public void setProximityAlert() {
		if (campaigns.size() == 0)
			return;
		for (Campaign campaign : campaigns) {
			addProximityAlert(campaign);
		}
		previousCampaigns = campaigns;
	}
	/** Handle updates of campaigns for proximity alert. */
	public void resetProximityAlert() {
		campaigns = G.getMyCampaigns();// refresh the campaigns
		for (Campaign campaign : previousCampaigns) {
			if (!campaigns.contains(campaign)) {
				removeProximityAlert(campaign);
			}
		}
		for (Campaign campaign : campaigns) {
			if (!previousCampaigns.contains(campaign)) {
				addProximityAlert(campaign);
			}
		}
	}

	/** Add proximity alert for a campaign. */
	public void addProximityAlert(Campaign campaign) {
		for (String loc : campaign.getLocations()) {
			GeoPoint point = Map.getGeopoint(this, loc);
			if (point != null) {
				double latitude = (double) point.getLatitudeE6() / 1000000.0;
				double longitude = (double) point.getLongitudeE6() / 1000000.0;
				String location = campaign.getName() + ":" + loc;
				Intent intent = new Intent(location);
				PendingIntent proximityIntent = PendingIntent.getBroadcast(
						this, 0, intent, PendingIntent.FLAG_CANCEL_CURRENT);
				G.proximityMap.put(location, proximityIntent);
				locationManager.addProximityAlert(latitude, longitude,
						Map.getRadius(loc), // the radius of the central point
											// of the alert region, in meters
						Constants.PROX_ALERT_EXPIRATION, 
						proximityIntent //a PendingIntent that will be used to generate 
						//an Intent to fire when entry to or exit from the alert region is detected
						);

				IntentFilter filter = new IntentFilter(campaign.getName() + ":"
						+ loc);
				registerReceiver(new ProximityIntentReceiver(), filter);
			}
		}
	}

	/** Remove proximity alert for a campaign. */
	public void removeProximityAlert(Campaign campaign) {
		for (String loc : campaign.getLocations()) {
			String location = campaign.getName() + ":" + loc;
			PendingIntent proximityIntent = G.proximityMap.get(location);
			if (proximityIntent != null) {
				locationManager.removeProximityAlert(proximityIntent);
				G.proximityMap.remove(location);
			}
		}
	}

	/**
	 * This is the old onStart method that is called on the pre-2.0 platform. If
	 * we decide to stop supporting pre-2.0 devices, we have to implement
	 * onStartCommand instead.
	 */
	@Override
	public void onStart(Intent intent, int startId) {
	}

	/**
	 * Cleanup.
	 */
	@Override
	public void onDestroy() {
		super.onDestroy();
	}
}
