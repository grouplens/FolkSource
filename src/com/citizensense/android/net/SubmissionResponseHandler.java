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

import com.citizensense.android.CitizenSense;

import android.app.Activity;
import android.content.Context;
import android.widget.Toast;

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
			System.out.println("success");
			Toast.makeText(context, "Task Complete!", Toast.LENGTH_SHORT).show();
			for (Header header : response.getAllHeaders()) {
				if (header.getName().equalsIgnoreCase("points")) {
					CitizenSense.getUserPointsText().setText(
							(header.getValue()));
				}
			}
			((Activity) context).finish();
		} else if (status_code == FAILURE) {
			System.out.println("failure");
		}
		System.out.println("------------------------->"+status_code);
		return null;
	}

	public void setResult(String result) {
		this.result = result;
	}

	public String getResult() {
		return result;
	}
}
