/* Copyright (c) 2006-2011 Regents of the University of Minnesota.
   For licensing terms, see the file LICENSE.
 */
package com.citizensense.android.net;

import java.io.IOException;

import org.apache.http.HttpResponse;
import org.apache.http.StatusLine;
import org.apache.http.client.HttpResponseException;
import org.apache.http.impl.client.BasicResponseHandler;

import com.citizensense.android.R;

import android.app.Activity;
import android.content.Context;
import android.widget.CheckBox;
import android.widget.TextView;
import android.widget.Toast;

/**
 * Handle an HttpResponse for image upload. It extends BasicResponseHandler
 * and overwrite the handleResponse() method, so that when the status code>300,
 * it won't throw exception as default.
 * @author Renji Yu
 */
public class ImageResponseHandler extends BasicResponseHandler{

	/** The status code get from the reponse. */
	private int status_code;
	/** This is used for creating a dialog. */
	private Context context;
	/** Status code for different results. */
	private static final int SUCCESS = 200, FAILURE = 406;
	/** String to indicate result. */
	private String result;
	
	public ImageResponseHandler(Context context) {
		this.context = context;
	}
	
	/** Handle response for image upload. Deal with success or failure.*/
	@Override
	public String handleResponse(HttpResponse response)
			throws HttpResponseException, IOException {
		if (response == null) {
			Toast.makeText(context, "Network error. Please try later.",
					Toast.LENGTH_LONG).show();
			return null;
		}
	  	CheckBox hasTakenPhoto = (CheckBox) ((Activity)context).findViewById(R.id.chkbox_photo_complete);
    	TextView uploadComplete = (TextView) ((Activity)context).findViewById(R.id.upload_text);
		
    	StatusLine statusLine = response.getStatusLine();
		status_code = statusLine.getStatusCode();
  
		if(status_code == SUCCESS){
			setResult("success");
	    	hasTakenPhoto.setChecked(true);
	    	uploadComplete.setText("Photo updated successfully!");
		}else if(status_code == FAILURE){
			setResult("fail");
	    	hasTakenPhoto.setChecked(false);
	    	uploadComplete.setText("Photo updated failed. Please try later.");
		}
		return null;
	}

	public void setResult(String result) {
		this.result = result;
	}

	public String getResult() {
		return result;
	}
}
