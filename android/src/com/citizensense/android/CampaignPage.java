/* Copyright (c) 2006-2011 Regents of the University of Minnesota.
   For licensing terms, see the file LICENSE.
 */

package com.citizensense.android;

import java.text.SimpleDateFormat;
import java.util.ArrayList;

import android.app.Activity;
import android.content.Intent;
import android.graphics.Color;
import android.os.Bundle;
import android.text.format.Time;
import android.view.View;
import android.view.View.OnClickListener;
import android.widget.Button;
import android.widget.ImageView;
import android.widget.TextView;
import android.widget.Toast;

/**
 * View all campaign info on screen
 * @author Phil Brown
 */
public class CampaignPage extends Activity implements OnClickListener {
	
	/** The campaign that is being viewed */
	private Campaign campaign;
	/** Used for displaying the start and end dates in a user-friendly format*/
	private SimpleDateFormat dateFormat;
	
	@Override
	public void onCreate(Bundle savedInstanceState) {
		super.onCreate(savedInstanceState);
		setContentView(R.layout.campaign_page);
		this.handleIntent();
		if (this.campaign == null) {
			Toast.makeText(this, "No Campaign found", Toast.LENGTH_SHORT).show();
			finish();//Not sure how this would happen, but just in case
		}
		ImageView image = (ImageView) findViewById(R.id.campaign_image);
		TextView title = (TextView) findViewById(R.id.campaign_title);
		TextView location = (TextView) findViewById(R.id.campaign_location);
		TextView status = (TextView) findViewById(R.id.campaign_status);
		TextView description = (TextView) findViewById(R.id.campaign_description);
		TextView times = (TextView) findViewById(R.id.campaign_times);
		TextView startEndDates = (TextView) findViewById(R.id.campaign_start_and_end_dates);
		TextView task_description = (TextView) findViewById(R.id.task_description);
		Button map_button = (Button) findViewById(R.id.map);
		Button task_button = (Button) findViewById(R.id.task);
		Button d_or_d = (Button) findViewById(R.id.download_or_delete);
		if (G.db.getCampaign(this.campaign.getId()) == null) {
			d_or_d.setText("Download");
		}
		else {
			d_or_d.setText("Delete");
		}
		map_button.setOnClickListener(this);
		task_button.setOnClickListener(this);
		d_or_d.setOnClickListener(this);
		
		this.dateFormat = new SimpleDateFormat("MM/dd/yy hh:mm");
		image.setImageResource(this.campaign.getImage());
		title.setText(this.campaign.getName());
		
		
		Time endDate = new Time();
		endDate.set(this.campaign.getEndDate().getDay(), 
				    this.campaign.getEndDate().getMonth(), 
				    this.campaign.getEndDate().getYear());
		Time startDate = new Time();
		startDate.set(this.campaign.getStartDate().getDay(), 
			          this.campaign.getStartDate().getMonth(), 
			          this.campaign.getStartDate().getYear());
		Time now = new Time();
		now.setToNow();
		String isOpen = (now.after(startDate) && endDate.before(now)) ? 
				        "Open" : "Closed";
		status.setText("Status: " + isOpen);
		if (isOpen.equals("Open")) {
			status.setTextColor(Color.GREEN);
		}
		else {
			status.setTextColor(Color.RED);
		}
		String locs = "";
		String[] locations = this.campaign.getLocations();
		if (locations != null) {
			for (int i = 0; i < locations.length; i++) {
				locs += locations[i];
				if (i != locations.length - 1) {
					locs += "\n";
				}
			}
		}
		location.setText(locs);
		description.setText(this.campaign.getDescription());
		String t = "";
		String[] time = this.campaign.getTimes();
		if (time != null) {
			for (int i = 0; i < time.length; i++) {
				t += time[i];
				if (i != time.length -1) {
					t += "\n";
				}
			}
		}
		times.setText(t);
		String start = this.dateFormat.format(this.campaign.getStartDate());
		String end = this.dateFormat.format(this.campaign.getEndDate());
		startEndDates.setText(start + " to " + end);
		task_description.setText("Task Instructions:\n" + 
				                 this.campaign.getTask().getInstructions());
	}//onCreate
	
	public void handleIntent() {
		Intent intent = this.getIntent();
		this.campaign = intent.getParcelableExtra(getString(R.string.campaign_intent));
	}//handleIntent

	@Override
	public void onClick(View v) {
		switch(v.getId()) {
			case(R.id.task): {
				Intent i = new Intent(this, Sense.class);
				i.putExtra("campaign", campaign);
				startActivity(i);
				break;
			}
			case(R.id.map): {
				Intent i = new Intent(v.getContext(), Map.class);
				ArrayList<Campaign> campaigns = new ArrayList<Campaign>();
				campaigns.add(campaign);
				G.globalCampaigns = campaigns;
				v.getContext().startActivity(i);
				break;
			}
			case(R.id.download_or_delete): {
				Button d = (Button) v;
				if (d.getText().equals("Download")) {
					G.db.addCampaign(this.campaign);
					d.setText("Delete");
				}
				else {
					G.db.deleteCampaign(this.campaign);
					d.setText("Download");
				}
				break;
			}
			default: {
				break;
			}
		}
		
	}//onClick
}//CampaignPage
