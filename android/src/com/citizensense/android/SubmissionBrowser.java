/** 
 * @Title: SubmissionBrowser.java 
 * @Package com.citizensense.android 
 * @author Renji Yu
 * @date 2012-4-14 
 */
package com.citizensense.android;

import java.text.SimpleDateFormat;
import java.util.ArrayList;

import android.app.Activity;
import android.content.Intent;
import android.graphics.Typeface;
import android.os.Bundle;
import android.util.Log;
import android.widget.ImageView;
import android.widget.ListView;
import android.widget.TextView;

import com.citizensense.android.net.GetImageRequest;
import com.citizensense.android.util.SubmissionContentAdapter;

/**
 * @ClassName: SubmissionBrowser
 * @Description: TODO
 * 
 */
public class SubmissionBrowser extends Activity {

	/** Submission parsed from SubmissionHistory */
	private Submission submission;

	/** User name of who made the submission */
	private TextView name;
	/** Time of the submission */
	private TextView time;
	/** Points get for the submission */
	private TextView points;

	/** Answers of the submission */
	private ArrayList<Answer> answers;

	/** Campaign object for the submission, we need this to get questions */
	private Campaign campaign;

	/** List View for submission's content: questions, answers and image */
	private ListView submissionContentList;

	private TextView header;
	private TextView footer;
	
	/** ImageView for the submission's image.*/
	private ImageView image;

	/***/
	private SubmissionContentAdapter subContentAdapter;

	@Override
	public void onCreate(Bundle savedInstanceState) {
		super.onCreate(savedInstanceState);
		setContentView(R.layout.submission_browser);
		name = (TextView) findViewById(R.id.name);
		time = (TextView) findViewById(R.id.time);
		points = (TextView) findViewById(R.id.points);
		submissionContentList = (ListView) findViewById(R.id.subContentList);
		image = (ImageView)findViewById(R.id.subImage);
		handleIntent(this.getIntent());
		initiateUI();
		updateUI();
	}

	@Override
	public void onResume() {
		super.onResume();
	}

	public void handleIntent(Intent i) {
		this.submission = i.getParcelableExtra("submission");
		this.answers = i.getParcelableArrayListExtra("answers");
		this.campaign = i.getParcelableExtra("campaign");
	}

	public void initiateUI() {
		header = new TextView(this);
		footer = new TextView(this);
		header.setText("Submission Content");
		header.setTypeface(null, Typeface.BOLD);
//		image.setImageResource(R.drawable.bikerack);
		updateImageView();
		// FIXME: get image from server
	}
	
	public void updateImageView(){
		//FIXME: Get the url from server
		GetImageRequest request = new GetImageRequest(this,image,true);
		if(submission.getImageUrl()!=null)
			request.execute(submission.getImageUrl());
		
	}
	

	public void updateUI() {
		if (submission == null) {
			Log.e("SubmissionBrowser", "submission  is null");
			return;
		}
		// set user name, time and points
		// FIXME: change this to user name
		name.setText("" + submission.getUser_id());
		SimpleDateFormat df = new SimpleDateFormat("yyyy/MM/dd HH:mm");
		time.setText(df.format(submission.getTimestamp()));
		points.setText("" + submission.getPoints());
		// update UI for list view
		if (subContentAdapter == null && answers != null && campaign != null) {
			submissionContentList.addHeaderView(header);
			submissionContentList.addFooterView(footer);
			ArrayList<Question> questions = null;
			if (campaign.getTask() != null
					&& campaign.getTask().getForm() != null)
				questions = campaign.getTask().getForm().getQuestionsList();
			subContentAdapter = new SubmissionContentAdapter(this, answers,
					questions);
			submissionContentList.setAdapter(subContentAdapter);
		}

		// FIXME: if the campaign does not require verification, hide the
		// verification part

	}

}
