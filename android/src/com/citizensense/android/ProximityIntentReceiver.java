package com.citizensense.android;

import com.citizensense.android.conf.Constants;

import android.app.Notification;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.location.LocationManager;

public class ProximityIntentReceiver extends BroadcastReceiver {

	@Override
	public void onReceive(Context context, Intent intent) {
		/**
		 * If the value is true, the device is entering the proximity region; if
		 * false, it is exiting.
		 */
		Boolean entering = intent.getBooleanExtra(
				LocationManager.KEY_PROXIMITY_ENTERING, false);
		if (entering) {
			showNotification(context);
		}
	}

	/**
	 * Show a notification while this service is running.
	 */
	public void showNotification(Context context) {

		/** manager for notification */
		NotificationManager notificationManager = (NotificationManager) context
				.getSystemService(Context.NOTIFICATION_SERVICE);
		String text = context.getString(R.string.notification_text);
		Notification notification = new Notification(
				R.drawable.ic_notification, text, System.currentTimeMillis());
		notification.flags = Notification.FLAG_AUTO_CANCEL;

		String contentTitle = context.getString(R.string.app_name);
		String contentText = context
				.getString(R.string.notification_content_text);
		// If the user click the notification, CitizenSense will be invoked
		Intent intent = new Intent(context, CitizenSense.class);
		PendingIntent pIntent = PendingIntent
				.getActivity(context, 0, intent, 0);
		notification.setLatestEventInfo(context, contentTitle, contentText,
				pIntent);
		notificationManager.notify(Constants.PROXIMITY_NOTIFICATION_ID,
				notification);
	}

}
