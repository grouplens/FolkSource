/** 
 * @Title: SubmissionHistory.java 
 * @Package com.citizensense.android 
 * @author Renji Yu
 * @date 2012-4-8 
 */
package com.citizensense.android;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;

import org.xml.sax.SAXException;

import android.app.Activity;
import android.app.Dialog;
import android.content.Context;
import android.content.Intent;
import android.graphics.Typeface;
import android.os.Bundle;
import android.util.Log;
import android.util.Xml;
import android.view.View;
import android.widget.AdapterView;
import android.widget.AdapterView.OnItemClickListener;
import android.widget.Button;
import android.widget.ImageView;
import android.widget.ListView;
import android.widget.TextView;
import android.widget.Toast;

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

public class DirectionDialog extends Dialog {

	public DirectionDialog(Context context) {
		super(context);
		// TODO Auto-generated constructor stub
	}

	/** Button go to Sense page */
	private Button yesBtn;

	/** Button to go back to the Map */
	private Button noBtn;

	/** List view for my submissions */
	private ImageView imgView;

	@Override
	public void onCreate(Bundle savedInstanceState) {
		super.onCreate(savedInstanceState);
		this.setTitle("Sense Dialog");
		setContentView(R.layout.submission_history);

		yesBtn = (Button) findViewById(R.id.sense_btn);
		noBtn = (Button) findViewById(R.id.cancel_btn);
//		mySubsList = (ListView) findViewById(R.id.mySubmissions);
//		allSubsList = (ListView) findViewById(R.id.allSubmissions);
//
//		handleIntent(this.getIntent());
//		setListener();
//		initiateUI();
	}

//	@Override
//	public void onResume() {
//		super.onResume();
//		// We need to update submissions, because after the user made a
//		// submission, the page will go back to SubmissionHistory and
//		// we should be able to update the page.
//		updateSubmissions();
//
//	}

	/**
	 * Update global submissions, submissions at this location and my
	 * submissions at this location
	 */
//	public void updateSubmissions() {
//		XMLResponseHandler handl = new XMLResponseHandler();
//		handl.setCallback(new XMLResponseHandler.StringCallback() {
//			@Override
//			public void invoke(String xml) {
//				try {
//					Xml.parse(xml, new SubmissionParser(
//							new SubmissionParser.Callback() {
//								@Override
//								public void invoke(ArrayList<Submission> subs) {
//
//									G.globalSubmissions = subs;
//									allSubmissions = Submission
//											.getSubmissionsAt(taskLocation,
//													campaign);
//									Collections.sort(allSubmissions);
//									mySubmissions = Submission
//											.getMySubmissionsAt(taskLocation,
//													campaign);
//									Log.d("COORD",
//											"all subs: " + subs.size()
//													+ "my subs: "
//													+ mySubmissions.size());
//									Collections.sort(mySubmissions);
//									updateUI();
//								}
//							}));
//				} catch (SAXException e) {
//					e.printStackTrace();
//				}
//			}
//		});
//		Submission.getAllSubmissions(this, handl);
//	}

	/** Unpacks passed-in campaign from the intent. */
//	public void handleIntent(Intent i) {
//		this.campaign = i.getParcelableExtra("campaign");
//		taskLocation = i.getIntArrayExtra("taskLocation");
//		myLocation = i.getIntArrayExtra("myLocation");
//		inside = i.getBooleanExtra("inside", false);
//	}// handleIntent

	/** Set listeners for UI components */
//	public void setListener() {
//		yesBtn.setOnClickListener(new View.OnClickListener() {
//			@Override
//			public void onClick(View v) {
//				Intent i = new Intent(v.getContext(), Sense.class);
//				i.putExtra("campaign", campaign);
//				i.putExtra("taskLocation", taskLocation);
//				// make sure the order is correct ??
//				i.putExtra("myLocation", myLocation);
//				i.putExtra("inside", inside);
//				v.getContext().startActivity(i);
//			}
//		});

//		noBtn.setOnClickListener(new View.OnClickListener() {
//			@Override
//			public void onClick(View v) {
//				finish();
//			}
//		});

//		mySubsList.setOnItemClickListener(new OnItemClickListener() {
//			@Override
//			public void onItemClick(AdapterView<?> parent, View view,
//					int position, long id) {
				// know the difference between id and postition
//				if (id >= 0 && id < mySubmissions.size()) {
//					Intent intent = new Intent(view.getContext(),
//							SubmissionBrowser.class);
//					intent.putExtra("submission", mySubmissions.get((int) id));
//					
//					//I tried to parse answers as part of submission, but always got problem
//					//We may want to change this later.
//					Answer[] answers = mySubmissions.get((int) id).getAnswers();
//					ArrayList<Answer> answerList = new ArrayList<Answer>(Arrays.asList(answers));
//					intent.putParcelableArrayListExtra("answers", answerList);
//					startActivity(intent);
//				}
//			}
//		});

//		allSubsList.setOnItemClickListener(new OnItemClickListener() {
//			@Override
//			public void onItemClick(AdapterView<?> parent, View view,
//					int position, long id) {
//				if (id >= 0 && id < allSubmissions.size()) {
//					Intent intent = new Intent(view.getContext(),
//							SubmissionBrowser.class);
//					intent.putExtra("submission", allSubmissions.get((int) id));
//					Answer[] answers = allSubmissions.get((int) id).getAnswers();
//					ArrayList<Answer> answerList = new ArrayList<Answer>(Arrays.asList(answers));
//					intent.putParcelableArrayListExtra("answers", answerList);
//					startActivity(intent);
//				}
//			}
//		});
//	}

	public void initiateUI() {
//		mySubsHeader = new TextView(this);
//		mySubsFooter = new TextView(this);
//		allSubsHeader = new TextView(this);
//		allSubsFooter = new TextView(this);
//		mySubsHeader.setText("My History");
//		mySubsHeader.setTypeface(null, Typeface.BOLD);
//		allSubsHeader.setText("All History");
//		allSubsHeader.setTypeface(null, Typeface.BOLD);
	}

	public void updateUI() {
//		if (mySubsAdapter == null) {
//			mySubsAdapter = new MySubmissionsAdapter(this, mySubmissions);
//			mySubsList.addHeaderView(mySubsHeader);
//			mySubsList.addFooterView(mySubsFooter);
//			mySubsList.setAdapter(mySubsAdapter);

//		} else
//			mySubsAdapter.notifyDataSetChanged();
//		if (mySubmissions.isEmpty())
//			mySubsFooter.setText("Make your first observation!");
//
//		if (allSubsAdapter == null) {
//
//			allSubsAdapter = new AllSubmissionsAdapter(this, allSubmissions);
//			allSubsList.addHeaderView(allSubsHeader);
//			allSubsList.addFooterView(allSubsFooter);
//			allSubsList.setAdapter(allSubsAdapter);
//
//		} else
//			allSubsAdapter.notifyDataSetChanged();
//		if (allSubmissions.isEmpty())
//			allSubsFooter.setText("There is no history here. Be the first one and earn more points!");

	}

}
