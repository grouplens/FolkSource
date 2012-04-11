/** 
 * @Title: SubmissionHistory.java 
 * @Package com.citizensense.android 
 * @author Renji Yu
 * @date 2012-4-8 
 */ 
package com.citizensense.android;

import java.util.ArrayList;

import org.xml.sax.SAXException;

import android.app.Activity;
import android.content.Intent;
import android.os.Bundle;
import android.util.Log;
import android.util.Xml;
import android.view.View;
import android.view.Window;
import android.view.WindowManager;
import android.widget.Button;
import android.widget.ListView;
import android.widget.TextView;

import com.citizensense.android.net.XMLResponseHandler;
import com.citizensense.android.parsers.SubmissionParser;
import com.citizensense.android.util.AllSubmissionsAdapter;
import com.citizensense.android.util.MySubmissionsAdapter;

/** 
 * This activity will display the submission history at a certain location,
 * it also allows navigation to Sense page.
 * @ClassName: SubmissionHistory 
 * @Author: Renji Yu
 * 
 */

public class SubmissionHistory extends Activity{
	
	/** Button go  to Sense page*/
	private Button senseBtn;
	/** List view for my submissions*/
	private ListView mySubsList;
	
	/** List view for all submissions*/
	private ListView allSubsList;
	
	/** Campaign object get from Map*/
	private Campaign campaign;
	
	/** Submissions at this location*/
	private ArrayList<Submission> submissions;
	
	/** My submissions at this location*/
	private ArrayList<Submission> mySubmissions;
	
	
	/** The task's location*/
	private int[] taskLocation;
	
	/** The user's current location*/
	private int[] myLocation;
	
	/** Indicate whether the user is inside the location*/
	private boolean inside;

	@Override
	public void onCreate(Bundle savedInstanceState){
		super.onCreate(savedInstanceState);
		//full screen
		this.requestWindowFeature(Window.FEATURE_NO_TITLE);
		this.getWindow().setFlags(WindowManager.LayoutParams.FLAG_FULLSCREEN,
		WindowManager.LayoutParams.FLAG_FULLSCREEN);
		setContentView(R.layout.submission_history);
		
		senseBtn = (Button) findViewById(R.id.sense_btn);
		mySubsList = (ListView) findViewById(R.id.mySubmissions);	
		allSubsList = (ListView) findViewById(R.id.allSubmissions);	

		handleIntent(this.getIntent());
		setListener();
	}
	
	@Override
	public void onResume(){
		super.onResume();
		//We need to update submissions, because after the user made a submission, the page
		//will go back to SubmissionHistory and we should be able to update the page.
		updateSubmissions();
	}
	
	/** Update global submissions, submissions at this location and my submissions
	 *  at this location*/
	public void updateSubmissions(){
		XMLResponseHandler handl = new XMLResponseHandler();
		handl.setCallback(new XMLResponseHandler.StringCallback() {
			@Override
			public void invoke(String xml) {
				try {
					Xml.parse(xml, new SubmissionParser(
							new SubmissionParser.Callback() {
								@Override
								public void invoke(
										ArrayList<Submission> subs) {
									Log.d("COORD", "size: " + subs.size());
									G.globalSubmissions = subs;
									submissions = Submission.getSubmissionsAt(taskLocation, campaign);
									mySubmissions = Submission.getMySubmissionsAt(taskLocation, campaign);
									updateUI();
								}
							}));
				} catch (SAXException e) {
					e.printStackTrace();
				}
			}
		});
		Submission.getAllSubmissions(this,handl);
		System.out.println("test");
	}
	
	
	/** Unpacks passed-in campaign from the intent. */
	public void handleIntent(Intent i) {
		this.campaign = i.getParcelableExtra("campaign");
		taskLocation = i.getIntArrayExtra("taskLocation");
		myLocation = i.getIntArrayExtra("myLocation");
		inside = i.getBooleanExtra("inside", false);
	}// handleIntent
	
	
	/** Set listeners for UI components*/
	public void setListener(){
		senseBtn.setOnClickListener(new View.OnClickListener() {
			@Override
			public void onClick(View v) {
				Intent i = new Intent(v.getContext(), Sense.class);
				i.putExtra("campaign", campaign);
				i.putExtra("taskLocation", taskLocation);
				//make sure the order is correct ??
				i.putExtra("myLocation", myLocation);
				i.putExtra("inside", inside);
				v.getContext().startActivity(i);
			}
		});
	}
	
	public void updateUI(){
		
		
		//we need to add header and footer to get the scoll bar work for list view
		TextView mySubsHeader = new TextView(this);
		mySubsHeader.setText("My Submission History");
		TextView mySubsFooter = new TextView(this);
		mySubsList.addHeaderView(mySubsHeader);
		mySubsList.addFooterView(mySubsFooter);
		TextView allSubsHeader = new TextView(this);
		allSubsHeader.setText("All Submission History");
		TextView allSubsFooter = new TextView(this);
		allSubsList.addHeaderView(allSubsHeader);
		allSubsList.addFooterView(allSubsFooter);
		
		mySubsList.setAdapter(new MySubmissionsAdapter(this, mySubmissions));
		allSubsList.setAdapter(new AllSubmissionsAdapter(this, submissions));
	}

	
	
	
}
