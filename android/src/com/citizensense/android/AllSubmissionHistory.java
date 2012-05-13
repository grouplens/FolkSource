/** 
 * @Title: AllSubmissionHistory.java 
 * @Package com.citizensense.android 
 * @date 2012-5-9 
 */
package com.citizensense.android;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.HashMap;

import org.xml.sax.SAXException;

import android.app.Activity;
import android.content.Context;
import android.content.Intent;
import android.os.Bundle;
import android.os.Handler;
import android.os.Message;
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
import com.citizensense.android.util.AllSubmissionsAdapter;
import com.citizensense.android.util.MySubmissionsAdapter;

/**
 * @ClassName: AllSubmissionHistory
 * @Description: Show the list of all submissions
 * 
 */
public class AllSubmissionHistory extends Activity {
	/** List view for all submissions */
	private ListView allSubsList;
	/** TextView to display message when all submissions is empty. */
	private TextView emptyAllSubText;
	/** ImageView for prompting loading information*/
	private ImageView loadingImageView;
	
	/** All submissions at this location */
	private ArrayList<Submission> allSubmissions;
	/** Adapter for all submissions' list view */
	private AllSubmissionsAdapter allSubsAdapter;

	/** Campaign object associated with the submissions */
	private Campaign campaign;
	
	private int[] taskLocation;
	
	@Override
	public void onCreate(Bundle savedInstanceState) {
		super.onCreate(savedInstanceState);

		setContentView(R.layout.all_sub_history);
		allSubsList = (ListView) findViewById(R.id.allSubmissions);
		emptyAllSubText = (TextView) findViewById(R.id.emptyAllSubText);
		loadingImageView = (ImageView)findViewById(R.id.loadingImage);
		handleIntent(getIntent());
	}

	@Override
	public void onResume() {
		super.onResume();
		Log.d("AllSub","update");
		updateSubmissions();
	}

	public void handleIntent(Intent i) {
		campaign = i.getParcelableExtra("campaign");
		taskLocation = i.getIntArrayExtra("taskLocation");
	}

	public void setListener() {
		allSubsList.setOnItemClickListener(new OnItemClickListener() {
			@Override
			public void onItemClick(AdapterView<?> parent, View view,
					int position, long id) {
				if (id >= 0 && id < allSubmissions.size()) {
					Intent intent = new Intent(view.getContext(),
							SubmissionBrowser.class);
					intent.putExtra("submission", allSubmissions.get((int) id));
					Answer[] answers = allSubmissions.get((int) id)
							.getAnswers();
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
	
	public void updateUI() {
		loadingImageView.setVisibility(View.GONE);
		allSubmissions = G.allSubmissionsAt;
		allSubsAdapter = new AllSubmissionsAdapter(this, allSubmissions);
		allSubsList.setAdapter(allSubsAdapter);
		if (allSubsAdapter != null)
			allSubsAdapter.notifyDataSetChanged();
		if (allSubmissions.isEmpty())
				emptyAllSubText.setVisibility(View.VISIBLE);
	}

}
