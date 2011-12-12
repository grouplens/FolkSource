/* Copyright (c) 2006-2011 Regents of the University of Minnesota.
   For licensing terms, see the file LICENSE.
 */

package com.citizensense.android;

import android.app.Notification;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.location.LocationManager;
import android.util.Log;

/**
 * Receives location broadcasts and notifies the user if they are in range
 * to complete one of their downloaded campaigns
 * @author Renji Yu
 * @author Phil Brown
 */
public class ProximityIntentReceiver extends BroadcastReceiver {

	@Override
	public void onReceive(Context context, Intent intent) {
		/**
		 * If the value is true, the device is entering the proximity region; if
		 * false, it is exiting.
		 */
		Boolean entering = intent.getBooleanExtra(
				LocationManager.KEY_PROXIMITY_ENTERING, false);
		//String provider = intent.getStringExtra(LocationManager.);
		//LocationManager lm = (LocationManager) context.getSystemService(Context.LOCATION_SERVICE);
		//Location lastLocation = lm.getLastKnownLocation(lm.isProviderEnabled(LocationManager.GPS_PROVIDER) ? LocationManager.GPS_PROVIDER : LocationManager.NETWORK_PROVIDER);
		String campaignInfo = intent.getStringExtra(context.getString(R.string.proximity_alert_intent));
		Log.e("ProximityAlert", "onReceive intent:Intent { " + campaignInfo + " }");
		if (campaignInfo != null) {
			if (entering) {
				showNotification(context, campaignInfo);
			}
			else {
				//See bug 2603
			}
		}
	}//onReceive
	
	/**
	 * Hides the notification when the user leaves the proximity
	 */
	public void hideNotification(Context c, String info) {
		NotificationManager nm;
		nm = (NotificationManager) 
		     c.getSystemService(Context.NOTIFICATION_SERVICE);
		String id = info.split(":")[0];
		nm.cancel(Integer.parseInt(id));
		//G.notificationIDs.remove((Object)Integer.parseInt(id));
	}//hideNotification

	/**
	 * Show a notification while this service is running.
	 */
	public void showNotification(Context context, String info) {
		NotificationManager nm;
		nm = (NotificationManager) 
		      context.getSystemService(Context.NOTIFICATION_SERVICE);
		String id = info.split(":")[0];
		if (!G.isNotificationNew(Integer.parseInt(id))) {
			return;
		}
		String name = info.split(":")[1];
		String location = info.split(":")[2];
		String text = context.getString(R.string.notification_text) + " " + name;
		Notification notification;
		notification = new Notification(R.drawable.ic_notification, 
				                        text, 
				                        System.currentTimeMillis());
		//Use this if hiding the notification on exiting: notification.flags = Notification.FLAG_NO_CLEAR;
		notification.flags |= Notification.FLAG_AUTO_CANCEL;//use |= to add multiple flags.
		notification.defaults |= Notification.DEFAULT_SOUND;
		notification.defaults |= Notification.DEFAULT_VIBRATE;
		String contentTitle = context.getString(R.string.app_name);
		String contentText;
		contentText = context.getString(R.string.notification_content_text)
		                                + " " + name + ". Its location is " + location;
		// If the user click the notification, CitizenSense will be invoked and
		//opened to display the campaign discussed in the notification
		Intent intent = new Intent(context, CitizenSense.class);
		intent.putExtra(context.getString(R.string.campaign_intent), id);
		intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
		//intent.setAction(name);//this fixes strange behavior that occurs when there is not action set.
		//intent.setData((Uri.parse("csense://" + name)));//this fixes a problem with multiple notifications
		PendingIntent pIntent;
		pIntent = PendingIntent.getActivity(context, 0, intent, PendingIntent.FLAG_UPDATE_CURRENT);
		
		notification.setLatestEventInfo(context, contentTitle, contentText, pIntent);
		//this means that campaign ids must be numeric!
		//G.notificationIDs.add(Integer.parseInt(id));
		nm.notify(Integer.parseInt(id), notification);
	}//showNotification

}//ProximityIntentReceiver
