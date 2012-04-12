/** 
 * @Title: SubmissionHistory.java 
 * @Package com.citizensense.android 
 * @author Renji Yu
 * @date 2012-4-8 
 */
package com.citizensense.android;

import java.util.ArrayList;
import java.util.Collections;

import org.xml.sax.SAXException;

import android.app.Activity;
import android.content.Intent;
import android.graphics.Typeface;
import android.os.Bundle;
import android.util.Log;
import android.util.Xml;
import android.view.View;
import android.widget.Button;
import android.widget.ListView;
import android.widget.TextView;

import com.citizensense.android.net.XMLResponseHandler;
import com.citizensense.android.parsers.SubmissionParser;
import com.citizensense.android.util.AllSubmissionsAdapter;
import com.citizensense.android.util.MySubmissionsAdapter;

/**
 * This activity will display the submission history at a certain location, it
 * also allows navigation to Sense page.
 * 
 * @ClassName: SubmissionHistory
 * @Author: Renji Yu
 * 
 */

public class SubmissionHistory extends Activity {

	/** Button go to Sense page */
	private Button senseBtn;

	/** Button to go back to the Map */
	private Button cancelBtn;

	/** List view for my submissions */
	private ListView mySubsList;

	/** List view for all submissions */
	private ListView allSubsList;

	/** Campaign object get from Map */
	private Campaign campaign;

	/** Submissions at this location */
	private ArrayList<Submission> submissions = new ArrayList<Submission>();

	/** My submissions at this location */
	private ArrayList<Submission> mySubmissions = new ArrayList<Submission>();

	/** The task's location */
	private int[] taskLocation;

	/** The user's current location */
	private int[] myLocation;

	/** Indicate whether the user is inside the location */
	private boolean inside;

	@Override
	public void onCreate(Bundle savedInstanceState) {
		super.onCreate(savedInstanceState);
		this.setTitle("Sense Dialog");
		setContentView(R.layout.submission_history);

		senseBtn = (Button) findViewById(R.id.sense_btn);
		cancelBtn = (Button) findViewById(R.id.cancel_btn);
		mySubsList = (ListView) findViewById(R.id.mySubmissions);
		allSubsList = (ListView) findViewById(R.id.allSubmissions);

		handleIntent(this.getIntent());
		setListener();
	}

	@Override
	public void onResume() {
		super.onResume();
		// We need to update submissions, because after the user made a
		// submission, the page will go back to SubmissionHistory and
		// we should be able to update the page.
		updateSubmissions();

	}

	/**
	 * Update global submissions, submissions at this location and my
	 * submissions at this location
	 */
	public void updateSubmissions() {
		XMLResponseHandler handl = new XMLResponseHandler();
		handl.setCallback(new XMLResponseHandler.StringCallback() {
			@Override
			public void invoke(String xml) {
				try {
					Xml.parse(xml, new SubmissionParser(
							new SubmissionParser.Callback() {
								@Override
								public void invoke(ArrayList<Submission> subs) {

									G.globalSubmissions = subs;
									submissions = Submission.getSubmissionsAt(
											taskLocation, campaign);
									Collections.sort(submissions);
									mySubmissions = Submission
											.getMySubmissionsAt(taskLocation,
													campaign);
									Log.d("COORD",
											"all subs: " + subs.size()
													+ "my subs: "
													+ mySubmissions.size());
									Collections.sort(mySubmissions);
									updateUI();
								}
							}));
				} catch (SAXException e) {
					e.printStackTrace();
				}
			}
		});
		Submission.getAllSubmissions(this, handl);
	}

	/** Unpacks passed-in campaign from the intent. */
	public void handleIntent(Intent i) {
		this.campaign = i.getParcelableExtra("campaign");
		taskLocation = i.getIntArrayExtra("taskLocation");
		myLocation = i.getIntArrayExtra("myLocation");
		inside = i.getBooleanExtra("inside", false);
	}// handleIntent

	/** Set listeners for UI components */
	public void setListener() {
		senseBtn.setOnClickListener(new View.OnClickListener() {
			@Override
			public void onClick(View v) {
				Intent i = new Intent(v.getContext(), Sense.class);
				i.putExtra("campaign", campaign);
				i.putExtra("taskLocation", taskLocation);
				// make sure the order is correct ??
				i.putExtra("myLocation", myLocation);
				i.putExtra("inside", inside);
				v.getContext().startActivity(i);
			}
		});

		cancelBtn.setOnClickListener(new View.OnClickListener() {
			@Override
			public void onClick(View v) {
				finish();
			}
		});
	}


	public void updateUI() {
		
		// add header and footer to get the scollbar work for list view
		TextView mySubsHeader = new TextView(this);
		TextView mySubsFooter = new TextView(this);
		TextView allSubsHeader = new TextView(this);
		TextView allSubsFooter = new TextView(this);
		
		mySubsHeader.setText("My History");
		mySubsHeader.setTypeface(null, Typeface.BOLD);
		mySubsList.addHeaderView(mySubsHeader);
		mySubsList.addFooterView(mySubsFooter);
		MySubmissionsAdapter mySubsAdapter = new MySubmissionsAdapter(this, mySubmissions);
		mySubsList.setAdapter(mySubsAdapter);
		mySubsAdapter.notifyDataSetChanged();
		
		if(mySubmissions.isEmpty())
			mySubsFooter.setText("Make your first observation!");
		
		allSubsHeader.setText("All History");
		allSubsHeader.setTypeface(null, Typeface.BOLD);
		allSubsList.addHeaderView(allSubsHeader);
		allSubsList.addFooterView(allSubsFooter);
		AllSubmissionsAdapter allSubsAdapter = new AllSubmissionsAdapter(this, submissions);
		allSubsList.setAdapter(allSubsAdapter);
		allSubsAdapter.notifyDataSetChanged();

		if(submissions.isEmpty())
			allSubsFooter.setText("There is no history here. Be the first one and earn more points!");
	}

}
