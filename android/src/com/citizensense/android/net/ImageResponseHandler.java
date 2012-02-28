/* Copyright (c) 2006-2011 Regents of the University of Minnesota.
   For licensing terms, see the file LICENSE.
 */
package com.citizensense.android.net;

import java.io.IOException;

import org.apache.http.HttpResponse;
import org.apache.http.StatusLine;
import org.apache.http.client.HttpResponseException;
import org.apache.http.impl.client.BasicResponseHandler;

import android.app.Activity;
import android.content.Context;
import android.widget.TextView;
import android.widget.Toast;

import com.citizensense.android.R;
import com.citizensense.android.Submission;

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
	/** Submission to post after image upload successfully*/
	private Submission submission;
	
	public ImageResponseHandler(Context context, Submission submission) {
		this.context = context;
		this.submission = submission;
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
    	TextView photoText = (TextView) ((Activity)context).findViewById(R.id.upload_text);
		
    	StatusLine statusLine = response.getStatusLine();
		status_code = statusLine.getStatusCode();
  
		if(status_code == SUCCESS){
			setResult("success");
	    	photoText.setText("Photo updated successfully!");
	    	//After image uploaded successfully, send the post request for submission(forms)
			SubmissionResponseHandler submissionHandler = new SubmissionResponseHandler(
					context);
			new PostRequest(context, submission, Request.XML,
					submissionHandler, true).execute();
			
		}else if(status_code == FAILURE){
			setResult("fail");
	    	photoText.setText("Photo updated failed. Please try later.");
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
