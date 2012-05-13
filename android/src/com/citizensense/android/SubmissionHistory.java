/** 
 * @Title: SubmissionHistory.java 
 * @Package com.citizensense.android 
 * @author Renji Yu
 * @date 2012-4-8 
 */
package com.citizensense.android;

import java.util.HashMap;
import java.util.Random;

import android.app.TabActivity;
import android.content.Intent;
import android.os.Bundle;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.Window;
import android.widget.ImageView;
import android.widget.TabHost;
import android.widget.TextView;

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

	/** Campaign object get from Map */
	private Campaign campaign;
	/** The task's location */
	private int[] taskLocation;
	/** The user's current location */
	private int[] myLocation;

	/** Indicate whether the user is inside the location */
	private boolean inside;
	
	//FIXME: remove this later, just for mocking up accept/reject 
	public static HashMap<Integer,Integer> acceptMap = new HashMap<Integer,Integer>();
	public static HashMap<Integer,Integer> rejectMap = new HashMap<Integer,Integer>();


	@Override
	public void onCreate(Bundle savedInstanceState) {
		super.onCreate(savedInstanceState);
		requestWindowFeature(Window.FEATURE_NO_TITLE);
		setContentView(R.layout.submission_history);
		
		senseView = findViewById(R.id.senseView);
		tabHost = getTabHost();
		
		handleIntent(this.getIntent());
		setListener();
		 initiateUI();
		 Random r = new Random();
		 for(int i=0;i<100;i++){
			 acceptMap.put(i,r.nextInt(9));
			 rejectMap.put(i,r.nextInt(9));
		 }
	}
	

	@Override
	public void onResume() {
		super.onResume();
		// We need to update submissions, because after the user made a
		// submission, the page will go back to SubmissionHistory and
		// we should be able to update the page.
		Log.d("SubmissionHistory", "onResume");
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
    
    
	public void initiateUI(){
		tabHost.clearAllTabs();
		Intent intent;
		intent = new Intent().setClass(this, AllSubmissionHistory.class);
		intent.putExtra("campaign", campaign);
		intent.putExtra("taskLocation", taskLocation);
		
		includeTab(intent, "AllSubmissions","All Submissions", 0);
		intent = new Intent().setClass(this, MySubmissionHistory.class);
		intent.putExtra("campaign", campaign);
		intent.putExtra("taskLocation", taskLocation);
		includeTab(intent, "MySubmissions", "My Submissions", 0);

		tabHost.setCurrentTab(0);
	}
}
