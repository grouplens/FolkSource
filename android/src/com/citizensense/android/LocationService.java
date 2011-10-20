/* Copyright (c) 2006-2011 Regents of the University of Minnesota.
   For licensing terms, see the file LICENSE.
 */

package com.citizensense.android;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Locale;

import com.citizensense.android.Map.CircleOverlay;
import com.citizensense.android.Map.PointOverlay;
import com.citizensense.android.conf.Constants;
import com.google.android.maps.GeoPoint;

import android.app.Activity;
import android.app.Notification;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.app.Service;
import android.content.Context;
import android.content.Intent;
import android.hardware.Sensor;
import android.hardware.SensorEvent;
import android.hardware.SensorEventListener;
import android.hardware.SensorManager;
import android.location.Address;
import android.location.Geocoder;
import android.location.Location;
import android.location.LocationListener;
import android.location.LocationManager;
import android.location.LocationProvider;
import android.os.Bundle;
import android.os.IBinder;
import android.util.Log;
import android.widget.Toast;

/**
 * Background service that handles location changed.
 * @author Renji Yu
 */
public class LocationService extends Service implements LocationListener{
   private static final int NOTIFICATION_ID = 1;
	
   private NotificationManager notificationManager;

   /** manager for location updates */
   private LocationManager locationManager;

   /** campaigns to be checked*/
   private ArrayList<Campaign> campaigns;
   
   private ArrayList<Campaign> inRangeCampaigns;
   
     
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
      
      this.notificationManager = 
          (NotificationManager) this.getSystemService(Context.NOTIFICATION_SERVICE);
      
      // register for location updates
      this.locationManager = 
         (LocationManager) this.getSystemService(Context.LOCATION_SERVICE);
      locationManager.requestLocationUpdates(
            LocationManager.GPS_PROVIDER,
            Constants.SERVICE_GPS_TIME_BETWEEN_UPDATES,
            Constants.MIN_DISTANCE_BETWEEN_UPDATES, this);
      
      campaigns  = G.intent_campagins;
      
      showNotification();//Just put here for test
   }

   /**
    * This is the old onStart method that is called on the pre-2.0
    * platform. If we decide to stop supporting pre-2.0 devices, we have to
    * implement onStartCommand instead.
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
      this.locationManager.removeUpdates(this);
   }

   
   /**
    * Show a notification while this service is running.
    */
   public void showNotification() {
	      String text = getString(R.string.notification_text);
	      Notification notification = new Notification(R.drawable.ic_notification, text,
	                                                   System.currentTimeMillis());
	      notification.flags = Notification.FLAG_AUTO_CANCEL;
	      
	      String contentTitle = getString(R.string.app_name);
	      String contentText = getString(R.string.notification_content_text);
	      Intent intent = new Intent(this,CitizenSense.class);
	      PendingIntent pIntent = PendingIntent.getActivity(this, 0, intent, 0);
	      notification.setLatestEventInfo(getApplicationContext(), contentTitle,
	    		  contentText, pIntent);
	      notificationManager.notify(NOTIFICATION_ID, notification);
   }


	@Override
	public void onLocationChanged(Location location) {
		if(getInRangeCampaigns(location).size() != 0){
			this.inRangeCampaigns = getInRangeCampaigns(location);
			showNotification();
		}
	}
	
	
	@Override
	public void onProviderDisabled(String arg0) {
		// TODO Auto-generated method stub
		
	}
	
	
	@Override
	public void onProviderEnabled(String arg0) {
		// TODO Auto-generated method stub
		
	}
	
	
	@Override
	public void onStatusChanged(String arg0, int arg1, Bundle arg2) {
		// TODO Auto-generated method stub
		
	}
	

	/** This method will return a list of campaigns close to the user.*/
	public ArrayList<Campaign> getInRangeCampaigns(Location location) {
		ArrayList<Campaign> results = new ArrayList<Campaign>(); 
		if(campaigns != null){
			for(Campaign campaign : campaigns){
				if(isInRange(location,campaign)){
					results.add(campaign);
				}
			}
		}
		return results;
	}
	
	/** Check if the user is in the range of a campaign.*/
	public boolean isInRange(Location location, Campaign campaign){
		if(campaign != null){
			for(String loc : campaign.getLocations()){
				GeoPoint point = Map.getGeopoint(this,loc);
				Location camLocation = new Location("CampaignLocation");
				double lat = (double)point.getLatitudeE6()/1000000.0;
				double lon = (double)point.getLongitudeE6()/1000000.0;
				camLocation.setLatitude(lat);
				camLocation.setLongitude(lon);
				if(location.distanceTo(camLocation) <= Map.getRadius(loc)){
					return true;
				}
			}
		}
		return false;
	}
}
