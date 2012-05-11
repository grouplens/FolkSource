/** 
 * @Title: AllSubmissionHistory.java 
 * @Package com.citizensense.android 
 * @date 2012-5-9 
 */
package com.citizensense.android;

import java.util.ArrayList;
import java.util.Arrays;

import android.app.Activity;
import android.content.Intent;
import android.os.Bundle;
import android.view.View;
import android.widget.AdapterView;
import android.widget.TextView;
import android.widget.AdapterView.OnItemClickListener;
import android.widget.ListView;

import com.citizensense.android.util.AllSubmissionsAdapter;

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

	/** All submissions at this location */
	private ArrayList<Submission> allSubmissions;
	/** Adapter for all submissions' list view */
	private AllSubmissionsAdapter allSubsAdapter;

	/** Campaign object associated with the submissions */
	private Campaign campaign;

	@Override
	public void onCreate(Bundle savedInstanceState) {
		super.onCreate(savedInstanceState);

		setContentView(R.layout.all_sub_history);
		allSubsList = (ListView) findViewById(R.id.allSubmissions);
		emptyAllSubText = (TextView) findViewById(R.id.emptyAllSubText);
		handleIntent(getIntent());
		setListener();
	}

	@Override
	public void onResume() {
		super.onResume();
		updateUI();
	}

	public void handleIntent(Intent i) {
		campaign = i.getParcelableExtra("campaign");
		allSubmissions = i.getParcelableArrayListExtra("allSubmissions");
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
					startActivity(intent);
				}
			}
		});
	}

	public void updateUI() {
		allSubsAdapter = new AllSubmissionsAdapter(this, allSubmissions);
		allSubsList.setAdapter(allSubsAdapter);
		if (allSubsAdapter != null)
			allSubsAdapter.notifyDataSetChanged();
		if (allSubmissions.isEmpty())
			emptyAllSubText.setVisibility(View.VISIBLE);
	}
}
