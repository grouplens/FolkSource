/** 
 * @Title: MySubmissionHistory.java 
 * @Package com.citizensense.android 
 * @author Renji Yu
 * @date 2012-5-9 
 */
package com.citizensense.android;

import java.util.ArrayList;
import java.util.Arrays;

import android.app.Activity;
import android.content.Intent;
import android.graphics.Typeface;
import android.os.Bundle;
import android.util.Log;
import android.view.View;
import android.widget.AdapterView;
import android.widget.AdapterView.OnItemClickListener;
import android.widget.ListView;
import android.widget.TextView;

import com.citizensense.android.util.MySubmissionsAdapter;

/**
 * @ClassName: MySubmissionHistory
 * @Description: Show the list of my submissions
 * 
 */
public class MySubmissionHistory extends Activity {
	/** List view for my submissions */
	private ListView mySubsList;
	/** TextView to display message when my submissions is empty. */
	private TextView emptyMySubText;
	
	
	/** My submissions at this location */
	private ArrayList<Submission> mySubmissions;
	/** Adapter for my submissions' list view */
	private MySubmissionsAdapter mySubsAdapter;
	/** Campaign object associated with the submissions */
	private Campaign campaign;

	
	
	@Override
	public void onCreate(Bundle savedInstanceState) {
		super.onCreate(savedInstanceState);
		setContentView(R.layout.my_sub_history);
		mySubsList = (ListView) findViewById(R.id.mySubmissions);
		emptyMySubText = (TextView) findViewById(R.id.emptyMySubText);
		handleIntent(getIntent());
		setListener();
	}
	
	@Override
	public void onResume(){
		super.onResume();
		updateUI();
	}

	public void handleIntent(Intent i) {
		Log.e("mySubmissionHistory", "handle Intent");
		campaign = i.getParcelableExtra("campaign");
		mySubmissions = i.getParcelableArrayListExtra("mySubmissions");
	}

	public void setListener() {
		mySubsList.setOnItemClickListener(new OnItemClickListener() {
			@Override
			public void onItemClick(AdapterView<?> parent, View view,
					int position, long id) {
				// know the difference between id and position
				if (id >= 0 && id < mySubmissions.size()) {
					Intent intent = new Intent(view.getContext(),
							SubmissionBrowser.class);
					intent.putExtra("submission", mySubmissions.get((int) id));

					// I tried to parse answers as part of submission, but got
					// problem
					// We may want to change this later.
					Answer[] answers = mySubmissions.get((int) id).getAnswers();
					ArrayList<Answer> answerList = new ArrayList<Answer>(Arrays
							.asList(answers));
					intent.putParcelableArrayListExtra("answers", answerList);
					intent.putExtra("campaign", campaign);
					startActivity(intent);
				}
			}
		});
	}

	public void updateUI() {
		mySubsAdapter = new MySubmissionsAdapter(this, mySubmissions);
		mySubsList.setAdapter(mySubsAdapter);
		if (mySubsAdapter != null)
			mySubsAdapter.notifyDataSetChanged();
		
		
		if (mySubmissions.isEmpty())
				emptyMySubText.setVisibility(View.VISIBLE);
	}

}
