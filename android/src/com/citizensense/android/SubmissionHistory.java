/** 
 * @Title: SubmissionHistory.java 
 * @Package com.citizensense.android 
 * @author Renji Yu
 * @date 2012-4-8 
 */
package com.citizensense.android;

import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;

import org.xml.sax.SAXException;

import android.app.TabActivity;
import android.content.Intent;
import android.opengl.Visibility;
import android.os.Bundle;
import android.util.Log;
import android.util.Xml;
import android.view.LayoutInflater;
import android.view.View;
import android.view.Window;
import android.widget.Button;
import android.widget.ImageView;
import android.widget.TabHost;
import android.widget.TextView;
import android.widget.TabHost.TabSpec;

import com.citizensense.android.net.GetRequest;
import com.citizensense.android.net.XMLResponseHandler;
import com.citizensense.android.parsers.LeaderboardParser;
import com.citizensense.android.parsers.SubmissionParser;

/**
 * This activity will display the submission history at a certain location, it
 * also allows navigation to Sense page.
 * 
 * @ClassName: SubmissionHistory
 * @Author: Renji Yu
 * 
 */

public class SubmissionHistory extends TabActivity {

	/** Reference to the tab controller */
	private TabHost tabHost;
	/** Reference to the view inside the tabHost */
	private View tabView;
	/** click the view go to Sense page */
	private View senseView;
	/** ImageView for prompting loading information*/
	private ImageView loadingImageView;

	/** Campaign object get from Map */
	private Campaign campaign;
	/** The task's location */
	private int[] taskLocation;
	/** The user's current location */
	private int[] myLocation;

	/** Indicate whether the user is inside the location */
	private boolean inside;

	/** My submissions at this location */
	private ArrayList<Submission> mySubmissions = new ArrayList<Submission>();
	/** All submissions at this location */
	private ArrayList<Submission> allSubmissions = new ArrayList<Submission>();

	@Override
	public void onCreate(Bundle savedInstanceState) {
		super.onCreate(savedInstanceState);
		requestWindowFeature(Window.FEATURE_NO_TITLE);
		setContentView(R.layout.submission_history);
		
		senseView = findViewById(R.id.senseView);
		tabHost = getTabHost();
		
		loadingImageView = (ImageView)findViewById(R.id.loadingImage);
		
		handleIntent(this.getIntent());
		setListener();
		// initiateUI();
	}
	
	public void refreshTab(){
		loadingImageView.setVisibility(View.GONE);
		tabHost.clearAllTabs();
		Intent intent;
		intent = new Intent().setClass(this, AllSubmissionHistory.class);
		intent.putExtra("campaign", campaign);
		intent.putParcelableArrayListExtra("allSubmissions", allSubmissions);
		includeTab(intent, "AllSubmissions","All Submissions", 0);
		intent = new Intent().setClass(this, MySubmissionHistory.class);
		intent.putExtra("campaign", campaign);
		intent.putParcelableArrayListExtra("mySubmissions", mySubmissions);
		includeTab(intent, "MySubmissions", "My Submissions", 0);

		tabHost.setCurrentTab(0);	
	}

	@Override
	public void onResume() {
		super.onResume();
		// We need to update submissions, because after the user made a
		// submission, the page will go back to SubmissionHistory and
		// we should be able to update the page.
		Log.d("SubmissionHistory", "onResume");
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
									allSubmissions = Submission
											.getSubmissionsAt(taskLocation,
													campaign);
									Collections.sort(allSubmissions);
									mySubmissions = Submission
											.getMySubmissionsAt(taskLocation,
													campaign);
									Log.d("COORD",
											"all subs: " + subs.size()
													+ " my subs: "
													+ mySubmissions.size());
									Collections.sort(mySubmissions);
									updateLeaderboard();
									refreshTab();
								}
							}));
				} catch (SAXException e) {
					e.printStackTrace();
				}
			}
		});
		Submission.getAllSubmissions(this, handl);
	}

	/** Update leaderboard so that we can get the user name from their id */
	public void updateLeaderboard() {
		XMLResponseHandler handler = new XMLResponseHandler();
		handler.setCallback(new XMLResponseHandler.StringCallback() {
			@Override
			public void invoke(String xml) {
				try {
					Xml.parse(xml, new LeaderboardParser(
							new LeaderboardParser.Callback() {
								@Override
								public void invoke(Leaderboard leaderboard) {
									// Set the LeaderboardMap
									if (leaderboard != null
											&& leaderboard.entries != null) {
										G.leaderboardMap = new HashMap<Integer, LeaderboardEntry>();
										for (LeaderboardEntry entry : leaderboard.entries) {
											G.leaderboardMap.put(entry.id,
													entry);
										}
									}
									// updateUI();
								}
							}));
				} catch (SAXException e) {
					e.printStackTrace();
				}
			}
		});
		new GetRequest(this, Leaderboard.class, null, handler, false).execute();

	}

	/** Unpacks passed-in campaign from the intent. */
	public void handleIntent(Intent i) {
		campaign = i.getParcelableExtra("campaign");
		taskLocation = i.getIntArrayExtra("taskLocation");
		myLocation = i.getIntArrayExtra("myLocation");
		inside = i.getBooleanExtra("inside", false);
	}// handleIntent

	/** Set listeners for UI components */
	public void setListener() {
		senseView.setOnClickListener(new View.OnClickListener() {
			@Override
			public void onClick(View v) {
				Intent i = new Intent(v.getContext(), Sense.class);
				i.putExtra("campaign", campaign);
				i.putExtra("taskLocation", taskLocation);
				// make sure the order of long,lat is correct ??
				i.putExtra("myLocation", myLocation);
				i.putExtra("inside", inside);
				v.getContext().startActivity(i);
			}
		});
	}


    public void includeTab(Intent intent, String tag, String text, int resid) {
    	tabView = LayoutInflater.from(this).inflate(R.layout.tab, null);
    	if (text != null) {
    		((TextView) tabView.findViewById(R.id.tab_text)).setText(text);
    	}
    	else {
    		((TextView) tabView.findViewById(R.id.tab_text)).setVisibility(View.GONE);
    	}
    	if (resid != 0) {
    		((ImageView) tabView.findViewById(R.id.tab_image)).setBackgroundResource(resid);
    	}
    	else {
    		((ImageView) tabView.findViewById(R.id.tab_image)).setVisibility(View.GONE);
    	}
    	
    	tabHost.addTab(tabHost.newTabSpec(tag).setIndicator(tabView).setContent(intent));
    }//includeTab

}
