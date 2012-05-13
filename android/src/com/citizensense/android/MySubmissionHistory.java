/** 
 * @Title: MySubmissionHistory.java 
 * @Package com.citizensense.android 
 * @author Renji Yu
 * @date 2012-5-9 
 */
package com.citizensense.android;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.HashMap;

import org.xml.sax.SAXException;

import android.app.Activity;
import android.content.Intent;
import android.graphics.Typeface;
import android.os.Bundle;
import android.util.Log;
import android.util.Xml;
import android.view.View;
import android.widget.AdapterView;
import android.widget.AdapterView.OnItemClickListener;
import android.widget.ImageView;
import android.widget.ListView;
import android.widget.TextView;

import com.citizensense.android.net.GetRequest;
import com.citizensense.android.net.XMLResponseHandler;
import com.citizensense.android.parsers.LeaderboardParser;
import com.citizensense.android.parsers.SubmissionParser;
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
	
	/** ImageView for prompting loading information*/
	private ImageView loadingImageView;
	
	/** My submissions at this location */
	private ArrayList<Submission> mySubmissions;
	/** Adapter for my submissions' list view */
	private MySubmissionsAdapter mySubsAdapter;
	/** Campaign object associated with the submissions */
	private Campaign campaign;
	
	private int[] taskLocation;

	
	
	@Override
	public void onCreate(Bundle savedInstanceState) {
		super.onCreate(savedInstanceState);
		setContentView(R.layout.my_sub_history);
		mySubsList = (ListView) findViewById(R.id.mySubmissions);
		emptyMySubText = (TextView) findViewById(R.id.emptyMySubText);
		loadingImageView = (ImageView)findViewById(R.id.loadingImage);
		handleIntent(getIntent());
	}
	
	@Override
	public void onResume(){
		super.onResume();
		updateSubmissions();
	}

	public void handleIntent(Intent i) {
		campaign = i.getParcelableExtra("campaign");
		taskLocation = i.getIntArrayExtra("taskLocation");
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
					
					//FIXME: this is for mocking up accept/reject
					intent.putExtra("position", position);
					startActivity(intent);
				}
			}
		});
	}

	public void updateUI() {
		loadingImageView.setVisibility(View.GONE);
		mySubmissions = G.mySubmissionsAt;
		mySubsAdapter = new MySubmissionsAdapter(this, mySubmissions);
		mySubsList.setAdapter(mySubsAdapter);
		if (mySubsAdapter != null)
			mySubsAdapter.notifyDataSetChanged();
		if (mySubmissions.isEmpty())
				emptyMySubText.setVisibility(View.VISIBLE);
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
									G.allSubmissionsAt = Submission
											.getSubmissionsAt(taskLocation,
													campaign);
									Collections.sort(G.allSubmissionsAt);
									G.mySubmissionsAt = Submission
											.getMySubmissionsAt(taskLocation,
													campaign);
									Log.d("COORD",
											"global subs:" + subs.size()
													+ " all subs: "
													+ G.allSubmissionsAt.size()
													+ " my subs: "
													+ G.mySubmissionsAt.size());
									Collections.sort(G.mySubmissionsAt);
									updateLeaderboard();
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
									updateUI();
									setListener();
								}
							}));
				} catch (SAXException e) {
					e.printStackTrace();
				}
			}
		});
		new GetRequest(this, Leaderboard.class, null, handler, false)
				.execute();
	}

}
