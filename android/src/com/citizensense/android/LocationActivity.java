/* Copyright (c) 2006-2011 Regents of the University of Minnesota.
   For licensing terms, see the file LICENSE.
 */

package com.citizensense.android;

import java.io.IOException;
import java.util.Iterator;

import android.app.Activity;
import android.app.AlertDialog;
import android.app.ProgressDialog;
import android.content.Context;
import android.content.DialogInterface;
import android.content.DialogInterface.OnCancelListener;
import android.content.Intent;
import android.location.Geocoder;
import android.location.GpsSatellite;
import android.location.GpsStatus;
import android.location.Location;
import android.location.LocationListener;
import android.location.LocationManager;
import android.location.LocationProvider;
import android.net.ConnectivityManager;
import android.net.NetworkInfo;
import android.net.wifi.WifiManager;
import android.os.Bundle;
import android.provider.Settings;
import android.util.Log;
import android.widget.Toast;

import com.citizensense.android.conf.Constants;

/** 
 * Superclass for creating location-aware activities without re-implementing
 * the same code multiple times. 
 * @author Phil Brown
 */
public abstract class LocationActivity extends Activity 
                                       implements LocationListener,
                                                  GpsStatus.Listener {

	/** Provides access to location services.*/
	protected LocationManager locationManager;
	/** Android geocoder */
	protected Geocoder geocoder;
	/** Contains information about the current status of the GPS. */
	protected GpsStatus gpsStatus;
	/** The user's location when he or she is sensing a task. */
	protected Location location;
	/** The dialog used for user messages. */
	private ProgressDialog dialog;
	/** Request code for opening the location settings. */
	public final static int LOCATION_SETTINGS_REQUEST_CODE = 0;
	/** Tag used for log messages. */
	public final static String TAG = "LocationActivity";
	
	@Override
	public void onActivityResult(int requestCode, int resultCode, Intent data) {
		switch(requestCode) {
			case LOCATION_SETTINGS_REQUEST_CODE : {
				if (!this.hasLocationFix()) {
					acquireSatellites();
				}
			}
		}
	}//onActivityResult
	
	@Override
	public void onCreate(Bundle savedInstanceState) {
		super.onCreate(savedInstanceState);
		// register for location updates
		this.locationManager = 
			(LocationManager) this.getSystemService(Context.LOCATION_SERVICE);
		if (this.locationManager.isProviderEnabled(
				LocationManager.NETWORK_PROVIDER)) {
			if (this.allowsNetworksLocations()) {
				this.locationManager.requestLocationUpdates(
						LocationManager.NETWORK_PROVIDER,
						Constants.MAIN_NETWORK_TIME_BETWEEN_UPDATES,
						Constants.MIN_DISTANCE_BETWEEN_UPDATES, this);
			}
		}
		if (this.locationManager.isProviderEnabled(
				LocationManager.GPS_PROVIDER)) {
			this.locationManager.requestLocationUpdates(
					LocationManager.GPS_PROVIDER,
					Constants.MAIN_GPS_TIME_BETWEEN_UPDATES,
					Constants.MIN_DISTANCE_BETWEEN_UPDATES, this);
		}
		this.geocoder = new Geocoder(this);
		this.dialog = new ProgressDialog(this);
	}//onCreate
	
	@Override
	public void onResume() {
		super.onResume();
		if (this.hasLocationFix()) {
			this.hideDialog(null);
		}
		else {
			this.requestLocation();
		}
	}//onResume
	
	@Override
	public void onDestroy() {
		super.onDestroy();
		this.hideDialog(null);
	}//onDestroy
	
	/**
	 * Handles GPS status changes, and updates this gpsStatus.
	 */
	@Override
	public void onGpsStatusChanged(int status) {
		switch(status) {
			case GpsStatus.GPS_EVENT_FIRST_FIX : {
				Log.i("GPS", "First Location Fix");
				this.hideDialog(null);
				this.onGpsFirstFix();
				break;
			}
			case GpsStatus.GPS_EVENT_SATELLITE_STATUS : {
				Log.i("GPS", "Change in satellite status");
				Iterator<GpsSatellite> iterator = gpsStatus.getSatellites().iterator();
				int count = 0;
				while(iterator.hasNext()) {
					iterator.next();
					count++;
				}
				//TODO update acquiring satellite text to display the number of satellites found.
				this.onSatelliteEvent(count);
				break;
			}
			case GpsStatus.GPS_EVENT_STARTED : {
				Log.i("GPS", "GPS is now on.");
				if (this.hasLocationFix()) {
					this.hideDialog(null);
				}
				this.onGpsStarted();
				break;
			}
			case GpsStatus.GPS_EVENT_STOPPED : {
				Log.i("GPS", "GPS is now off.");
				this.onGpsStopped();
				break;
			}
		}
		gpsStatus = locationManager.getGpsStatus(gpsStatus);
	}//onGpsStatusChanged

	@Override
	public void onLocationChanged(Location location) {
		if (Constants.DEBUG) {
			Log.d(TAG, "location changed");
		}
		this.location = location;
		if (Constants.DEBUG) {
			try {
				Log.d(TAG, "Location Found: " + 
						geocoder.getFromLocation(LocationActivity.this.location.getLatitude(), 
						LocationActivity.this.location.getLongitude(), 1));
			} catch (IOException e) {
				Log.d(TAG, "Location Found");
			}
		}
		this.hideDialog(null);
	}//onLocationChanged

	/**
	 * Called when the location provider is disabled
	 * @param provider Location Provider
	 */
	@Override
	public void onProviderDisabled(String provider) {
	      if (Constants.DEBUG) {
	         Log.d(TAG, "location provider disabled: " + provider);
	      }
	      if (this.allowsNetworksLocations()) {
	    	  if (!locationManager.isProviderEnabled(LocationManager.GPS_PROVIDER)
	    	   && !locationManager.isProviderEnabled(LocationManager.NETWORK_PROVIDER)) {
	    		  requestLocationSettings();
	    	  }
	      }
	      else{
	    	  if (!locationManager.isProviderEnabled(LocationManager.GPS_PROVIDER)) {
	    		  requestLocationSettings();
	    	  }
	      }
	}//onProviderDisabled
	
	/**
	 * Called when the location provider is enabled
	 * @param provider Location Provider
	 */
	@Override
	public void onProviderEnabled(String provider) {
		if (Constants.DEBUG) {
			Log.d(TAG, "gps provider enabled: " + provider);
		}
		if (provider.equals(LocationManager.NETWORK_PROVIDER)) {
			if (this.allowsNetworksLocations()) {
				this.locationManager.requestLocationUpdates(
						provider,
						Constants.MAIN_NETWORK_TIME_BETWEEN_UPDATES,
						Constants.MIN_DISTANCE_BETWEEN_UPDATES, this);
			}
		}
		if (provider.equals(LocationManager.GPS_PROVIDER)) {
			this.locationManager.requestLocationUpdates(
					provider,
					Constants.MAIN_GPS_TIME_BETWEEN_UPDATES,
					Constants.MIN_DISTANCE_BETWEEN_UPDATES, this);
			
		}
		if (!this.hasLocationFix()) {
			acquireSatellites();
		}
		else {
			this.hideDialog(null);
		}
	}//onProviderEnabled

	/**
	 * Called when the location provider status changes.
	 * @param provider Location Provider
	 * @param extras
	 */
	@Override
	public void onStatusChanged(String provider, int status, Bundle extras) {
		if (Constants.DEBUG) {
			Log.d(TAG, "status changed for provider: " + provider);
		}
		switch (status) {
			case LocationProvider.AVAILABLE:
				Log.i(TAG, provider + " AVAILABLE");
				if (this.hasLocationFix()) {
					this.hideDialog(null);
				}
				else {
					acquireSatellites();
				}
				break;
			case LocationProvider.OUT_OF_SERVICE:
				Log.i(TAG, provider + " OUT_OF_SERVICE");
				if (!this.hasLocationFix()) {
					acquireSatellites();
				}
				break;
			case LocationProvider.TEMPORARILY_UNAVAILABLE:
				Log.i(TAG, provider + " TEMPORARILY_UNAVAILABLE");
				if (!this.hasLocationFix()) {
					acquireSatellites();
				}
				break;
		}
	}//onStatusChanged
	
	/** Displays an "Acquiring Satellites" dialog. This is used frequently, so
	 * its own method makes a lot of sense. */
	public void acquireSatellites() {
		this.showDialog(null, "Acquiring Satellites...", true);
	}//acquireSatellites
	
	/**
	 * Construct a ProgressDialog to show to the user.
	 * @param title The title of the dialog. This may be null.
	 * @param message The message of the dialog.
	 * @param cancelable Whether or not the user can cancel the dialog.
	 */
	public void showDialog(String title, String message, boolean cancelable) {
		dialog.setTitle(title);
		dialog.setMessage(message);
		dialog.setCancelable(cancelable);
		dialog.setOnCancelListener(new OnCancelListener() {
			@Override
			public void onCancel(DialogInterface dialog) {
				Log.i(TAG, "Dialog Canceled");
			}
		});
		dialog.show();
		if (Constants.DEBUG) {
			Log.d(TAG, "Showing Dialog");
		}
	}//showDialog
	
	/**
	 * Dismiss the dialog and run the code in the given OnDismissListener
	 * @param listener Contains the code to run after the dialog is dismissed.
	 */
	public void hideDialog(DialogInterface.OnDismissListener listener) {
		dialog.setOnDismissListener(listener);
		this.dialog.dismiss();
		if (Constants.DEBUG) {
			Log.d(TAG, "Hiding Dialog");
		}
	}//hideDialog
	
	/** Returns the current location, which may be null if there is not a valid
	 * location. Use hasLocationFix to determine if this location would be null. */
	public Location getLocation() {
		return location;
	}//getLocation
	
	/** Returns true if the GPS has a fix on a valid location. */
	public boolean hasLocationFix() {
		return location != null;
	}//hasLocationFix
	
	/** Returns true if the GPS is enabled */
	public boolean isGPSEnabled() {
		return locationManager.isProviderEnabled(LocationManager.GPS_PROVIDER);
	}//isGPSEnabled
	
	/** Returns true if location settings are enabled to access the network. */
	public boolean isNetworkLocationEnabled() {
		return locationManager.isProviderEnabled(LocationManager.NETWORK_PROVIDER);
	}//isNetworkLocationEnabled
	
	/**
	 * Check if the device has a network connection.
	 * @return true if it has a network connection.
	 */
	public boolean isNetworkAvailable(){
		WifiManager wifi = (WifiManager)
			getSystemService(Context.WIFI_SERVICE);
		ConnectivityManager cm = (ConnectivityManager)
			getSystemService(Context.CONNECTIVITY_SERVICE);
		NetworkInfo info = cm.getActiveNetworkInfo();
		boolean hasDataConnection = false;
		if (info != null) {
			hasDataConnection = info.isConnectedOrConnecting();
		}
		if ((wifi.isWifiEnabled() || hasDataConnection)){
			return true;
		} else {
			return false;
		}
	}//isNetworkAvailable
	
	/** Request that location is updated. Basically, this triggers the
	 * necessary processes to get a location fix if there isn't already one
	 * available. */
	public void requestLocation() {
		if (this.isGPSEnabled()) {
			requestGpsLocation();
		}
		else if (this.allowsNetworksLocations()) {
			if (this.isNetworkLocationEnabled()) {
				if (this.isNetworkAvailable()) {
					requestNetworkLocation();
				}
				else {
					Toast.makeText(this, 
							       "No network connection", 
							       Toast.LENGTH_SHORT).show();
				}
			}
			else {
				requestLocationSettings();
			}
		}
		else {
			requestLocationSettings();
		}
	}//requestLocation
	
	/** Show the GPS dialog if there is no available location. */
	private void requestGpsLocation() {
		if (!this.hasLocationFix()) {
			acquireSatellites();
		}
	}//requestGPSLocation
	
	/** Show the network dialog if there is no available location. */
	private void requestNetworkLocation() {
		if (!this.hasLocationFix()) {
			this.showDialog(null, "Getting Your Location...", true);
		}
	}//requestNetworkLocation
	
	/** Display a message to the user notifying them that location services are
	 * required for this Activity. */
	public void requestLocationSettings() {
		new AlertDialog.Builder(this)
		.setTitle(this.allowsNetworksLocations() ? 
				    "Location Services Required" : "GPS Required")
		.setMessage(this.allowsNetworksLocations() ? 
			    "Your Network or GPS Locations must be enabled to complete this task":
			    "Your GPS is required to complete this task.")
        .setNegativeButton("Cancel", new DialogInterface.OnClickListener() {
        	public void onClick(DialogInterface dialog, int whichButton){
        		dialog.dismiss();}})
        .setPositiveButton("Open Settings", 
        		           new DialogInterface.OnClickListener() {
    	       public void onClick(DialogInterface dialog, int whichButton){
    	    	   startActivityForResult(
    	    			   (new Intent(Settings.ACTION_LOCATION_SOURCE_SETTINGS)),
    	    			   LOCATION_SETTINGS_REQUEST_CODE);
    	    	   dialog.dismiss();
    	       }
        }).show();
	}//requestLocationSettings
	
	//*** Abstract Methods
	
	/** Returns true if this locationActivity allows network locations. The
	 * default is false. */
	public abstract boolean allowsNetworksLocations();

	/** Called when the GPS has made its first GPS fix. */
	public abstract void onGpsFirstFix();

	/** 
	 * Called when the number of satellites has changed
	 * @param count The number of satellites the GPS has acquired
	 */
	public abstract void onSatelliteEvent(int count);

	/** Called when the GPS system has started */
	public abstract void onGpsStarted();
	   
	/** Called when the GPS system has stopped */
	public abstract void onGpsStopped();

}//LocationActivity
