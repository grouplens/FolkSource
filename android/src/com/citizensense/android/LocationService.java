/* Copyright (c) 2006-2011 Regents of the University of Minnesota.
   For licensing terms, see the file LICENSE.
 */

package com.citizensense.android;

import java.util.ArrayList;

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
 * Background service that handles location changed.
 * 
 * @author Renji Yu
 */
public class LocationService extends Service implements LocationListener {

	/** manager for location updates */
	private LocationManager locationManager;

	/** campaigns to be checked */
	public static ArrayList<Campaign> campaigns;

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
		locationManager.requestLocationUpdates(LocationManager.GPS_PROVIDER,
				Constants.SERVICE_GPS_TIME_BETWEEN_UPDATES,
				Constants.MIN_DISTANCE_BETWEEN_UPDATES, this);

		// update intent data
		setProximityAlert();
	}


	/**
	 * Use the addProximityAlert method of LocationManager to set alert for
	 * every location. When the device detects that it has entered or exited the
	 * area surrounding the location, the given PendingIntent will broadcasted.
	 */
	public void setProximityAlert() {
		if (campaigns == null)
			return;
		for (Campaign campaign : campaigns) {
			for (String loc : campaign.getLocations()) {
				GeoPoint point = Map.getGeopoint(this, loc);
				double latitude = (double) point.getLatitudeE6() / 1000000.0;
				double longitude = (double) point.getLongitudeE6() / 1000000.0;
				Intent intent = new Intent(campaign.getName() + ":" + loc);
				PendingIntent proximityIntent = PendingIntent.getBroadcast(
						this, 0, intent, PendingIntent.FLAG_CANCEL_CURRENT);
				locationManager.addProximityAlert(latitude, longitude,
						Map.getRadius(loc), // the radius of the central point
											// of the alert region, in meters
						-1, // time for this proximity alert, in milliseconds,
							// or -1 to indicate no expiration
						proximityIntent // will be used to generate an Intent to
										// fire when entry to or exit from the
										// alert region is detected
						);
				IntentFilter filter = new IntentFilter(campaign.getName() + ":"
						+ loc);
				registerReceiver(new ProximityIntentReceiver(), filter);
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
		locationManager.removeUpdates(this);
	}

	@Override
	public void onLocationChanged(Location location) {
		// TODO Auto-generated method stub
		
	}

	@Override
	public void onProviderDisabled(String provider) {
		// TODO Auto-generated method stub
		
	}

	@Override
	public void onProviderEnabled(String provider) {
		// TODO Auto-generated method stub
		
	}

	@Override
	public void onStatusChanged(String provider, int status, Bundle extras) {
		// TODO Auto-generated method stub
		
	}

}
