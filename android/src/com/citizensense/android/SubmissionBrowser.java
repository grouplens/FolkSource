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
import android.os.Bundle;
import android.util.Log;
import android.view.View;
import android.view.View.OnClickListener;
import android.view.Window;
import android.widget.Button;
import android.widget.Gallery;
import android.widget.ImageView;
import android.widget.TextView;
import android.widget.Toast;

import com.citizensense.android.net.GetImageRequest;
import com.citizensense.android.util.ActivityHeader;
import com.citizensense.android.util.SubmissionGalleryAdapter;

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

	/** ImageView for the submission's image. */
	private ImageView image;

	/** Reference to the header view */
	private View headerView;
	/** Designed to update the header view */
	private ActivityHeader header;
	/** Gallery View for submissions */
	private Gallery gallery;
	/** Adapter for gallery view. */
	private SubmissionGalleryAdapter subGalleryAdapter;

	private Button acceptBtn;

	private Button rejectBtn;

	private int position = 0;

	@Override
	public void onCreate(Bundle savedInstanceState) {
		super.onCreate(savedInstanceState);
		requestWindowFeature(Window.FEATURE_NO_TITLE);
		setContentView(R.layout.submission_browser);
		headerView = findViewById(R.id.header);
		header = new ActivityHeader(headerView);

		name = (TextView) findViewById(R.id.name);
		time = (TextView) findViewById(R.id.time);
		points = (TextView) findViewById(R.id.points);

		acceptBtn = (Button) findViewById(R.id.acceptBtn);
		rejectBtn = (Button) findViewById(R.id.rejectBtn);

		gallery = (Gallery) findViewById(R.id.submission_gallery);
		registerForContextMenu(gallery);

		image = (ImageView) findViewById(R.id.subImage);
		handleIntent(this.getIntent());
		setListener();
		updateUI();
	}

	public void setListener() {
		acceptBtn.setOnClickListener(new OnClickListener() {
			@Override
			public void onClick(View view) {
				int acceptNum = SubmissionHistory.acceptMap.get(position);
				SubmissionHistory.acceptMap.put(position, acceptNum + 1);

				Toast.makeText(view.getContext(),
						"Thanks for verifying this submission.",
						Toast.LENGTH_LONG).show();
			}
		});
		rejectBtn.setOnClickListener(new OnClickListener() {
			@Override
			public void onClick(View view) {
				int rejectNum = SubmissionHistory.rejectMap.get(position);
				SubmissionHistory.acceptMap.put(position, rejectNum + 1);
				Toast.makeText(view.getContext(),
						"Thanks for verifying this submission.",
						Toast.LENGTH_LONG).show();
			}
		});
	}

	@Override
	public void onResume() {
		super.onResume();
		header.updateHeader();
	}

	public void handleIntent(Intent i) {
		this.submission = i.getParcelableExtra("submission");
		this.answers = i.getParcelableArrayListExtra("answers");
		this.campaign = i.getParcelableExtra("campaign");

		this.position = i.getIntExtra("position", 0);
	}

	public void updateImageView() {
		// FIXME: We should allow the user to rotate/zoom in/zoom out
		GetImageRequest request = new GetImageRequest(this, image, false);
		if (submission.getImageUrl() != null)
			request.execute(submission.getImageUrl());
	}

	public void updateUI() {
		updateImageView();

		if (submission == null) {
			Log.e("SubmissionBrowser", "submission  is null");
			return;
		}
		String userName = "";
		if (G.leaderboardMap != null) {
			LeaderboardEntry entry = G.leaderboardMap.get(submission
					.getUser_id());
			if (entry != null)
				userName = entry.name;
		}
		name.setText(userName);
		//can't verify submissions by yourself
		if(userName.equals(G.user.getUsername())){
			View verifyView = (View) findViewById(R.id.verifyLayout);
			verifyView.setVisibility(View.GONE);
		}
		
		
		SimpleDateFormat df = new SimpleDateFormat("yyyy/MM/dd HH:mm");
		time.setText(df.format(submission.getTimestamp()));
		points.setText("" + submission.getPoints());
		// update UI for list view
		if (subGalleryAdapter == null && answers != null && campaign != null) {
			ArrayList<Question> questions = null;
			if (campaign.getTask() != null
					&& campaign.getTask().getForm() != null)
				questions = campaign.getTask().getForm().getQuestionsList();
			// subGalleryAdapter = new SubmissionGalleryAdapter(this, answers,
			// questions);
			// test gallery view
			ArrayList<Answer> answers2 = new ArrayList<Answer>();
			ArrayList<Question> questions2 = new ArrayList<Question>();
			answers2.addAll(answers);
			answers2.addAll(answers);
			questions2.addAll(questions);
			questions2.addAll(questions);
			subGalleryAdapter = new SubmissionGalleryAdapter(this, answers2,
					questions2);
			gallery.setAdapter(subGalleryAdapter);
		}

		// FIXME: if the campaign does not require verification, hide the
		// verification part

	}

}
