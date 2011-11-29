/* Copyright (c) 2006-2011 Regents of the University of Minnesota.
   For licensing terms, see the file LICENSE.
 */

package com.citizensense.android;

import com.citizensense.android.conf.Constants;

import android.app.Notification;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.location.LocationManager;

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
		String campaignInfo = intent.getStringExtra(context.getString(R.string.proximity_alert_intent));
		if (campaignInfo != null) {
			if (entering) {
				showNotification(context, campaignInfo);
			}
			else {
				hideNotification(context, campaignInfo);
			}
		}
	}//onReceive
	
	/**
	 * Hides the notification when the user leaves the proximity
	 */
	public void hideNotification(Context c, String info) {
		int notification_id = MyCampaigns.notificationIDs.get(info);
		NotificationManager nm;
		nm = (NotificationManager) 
		     c.getSystemService(Context.NOTIFICATION_SERVICE);
		nm.cancel(notification_id);
	}//hideNotification

	/**
	 * Show a notification while this service is running.
	 */
	public void showNotification(Context context, String info) {
		NotificationManager nm;
		nm = (NotificationManager) 
		      context.getSystemService(Context.NOTIFICATION_SERVICE);
		String id = info.split(":")[0];
		String name = info.split(":")[1];
		String location = info.split(":")[2];
		String text = context.getString(R.string.notification_text) + " " + name;
		Notification notification;
		notification = new Notification(R.drawable.ic_notification, 
				                        text, 
				                        System.currentTimeMillis());
		notification.flags = Notification.FLAG_AUTO_CANCEL;

		String contentTitle = context.getString(R.string.app_name);
		String contentText;
		contentText = context.getString(R.string.notification_content_text)
		                                + " " + name + ". Its location is " + location;
		// If the user click the notification, CitizenSense will be invoked and
		//opened to display the campaign discussed in the notification
		Intent intent = new Intent(context, CitizenSense.class);
		intent.putExtra(context.getString(R.string.campaign_intent), id);
		PendingIntent pIntent;
		pIntent = PendingIntent.getActivity(context, 0, intent, 0);
		notification.setLatestEventInfo(context, contentTitle, contentText, pIntent);
		int notification_id = MyCampaigns.notificationIDs.get(info);
		nm.notify(notification_id, notification);
	}//showNotification

}//ProximityIntentReceiver
