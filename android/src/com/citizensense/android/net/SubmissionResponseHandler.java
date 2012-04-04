/** 
 /* Copyright (c) 2006-2011 Regents of the University of Minnesota.
For licensing terms, see the file LICENSE.
 */

package com.citizensense.android.net;

import java.io.IOException;

import org.apache.http.Header;
import org.apache.http.HttpResponse;
import org.apache.http.StatusLine;
import org.apache.http.client.HttpResponseException;
import org.apache.http.impl.client.BasicResponseHandler;

import android.app.Activity;
import android.app.AlertDialog;
import android.content.Context;
import android.content.DialogInterface;
import android.widget.Toast;

import com.citizensense.android.CitizenSense;

/**
 * @ClassName: SubmissionResponseHandler
 * @Description: Handle an HttpResponse for submission post. It extends
 *               BasicResponseHandler and overwrite the handleResponse() method,
 *               so that when the status code>300, it won't throw exception as
 *               default.
 * 
 */
public class SubmissionResponseHandler extends BasicResponseHandler {

	/** The status code get from the reponse. */
	private int status_code;
	/** This is used for creating a dialog. */
	private Context context;
	/** Status code for different results. */
	private static final int SUCCESS = 200, FAILURE = 400;
	/** String to indicate result. */
	private String result;

	public SubmissionResponseHandler(Context context) {
		this.context = context;
	}

	/** Handle response for image upload. Deal with success or failure. */
	@Override
	public String handleResponse(HttpResponse response)
			throws HttpResponseException, IOException {
		if (response == null) {
			Toast.makeText(context, "Network error. Please try later.",
					Toast.LENGTH_LONG).show();
			return null;
		}
		// CheckBox hasTakenPhoto = (CheckBox)
		// ((Activity)context).findViewById(R.id.chkbox_photo_complete);
		// TextView uploadComplete = (TextView)
		// ((Activity)context).findViewById(R.id.upload_text);

		StatusLine statusLine = response.getStatusLine();
		status_code = statusLine.getStatusCode();

		if (status_code == SUCCESS) {
			int p = 0;
			for (Header header : response.getAllHeaders()) {
				if (header.getName().equalsIgnoreCase("points")) {
					p = Integer.parseInt(header.getValue());
					CitizenSense.getUserPointsText().setText(
							(header.getValue()));
				}
			}
			//Instead of using toast, we should use dialog
			//Toast.makeText(context, "Congraturations,Task Complete! You've got one point!", Toast.LENGTH_LONG).show();
			showDialog(context,"Congraturations, task complete! You now have " + p + " points!");
			
			//((Activity) context).finish();
		} else if (status_code == FAILURE) {
		}
		return null;
	}

	public void setResult(String result) {
		this.result = result;
	}

	public String getResult() {
		return result;
	}
	
	public void showDialog(final Context context,String message){
		new AlertDialog.Builder(context).setTitle("CitizenSense")
        .setMessage(message)
        .setPositiveButton("OK", new DialogInterface.OnClickListener() {
            public void onClick(DialogInterface dialog, int whichButton) {
            	((Activity) context).finish();
            	
            	//this will open the leaderboard in the current activity
            	// I'm not sure how to drop it back to the leaderboard tab.
            	
//            	Intent i = new Intent(context, Profile.class);
//    			i.putExtra("campaign", campaign);
//    			i.putExtra("locVal", a);
//    			context.startActivity(i);
            }
        }).show();
	}
}
