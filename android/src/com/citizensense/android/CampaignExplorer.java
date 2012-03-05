/* Copyright (c) 2006-2011 Regents of the University of Minnesota.
   For licensing terms, see the file LICENSE.
 */

package com.citizensense.android;

import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;

import android.app.ListActivity;
import android.content.Intent;
import android.content.SharedPreferences.Editor;
import android.graphics.Color;
import android.os.Bundle;
import android.text.format.Time;
import android.util.Log;
import android.view.KeyEvent;
import android.view.Menu;
import android.view.MenuItem;
import android.view.View;
import android.view.View.OnClickListener;
import android.widget.AdapterView;
import android.widget.AdapterView.OnItemClickListener;
import android.widget.AdapterView.OnItemSelectedListener;
import android.widget.Button;
import android.widget.ImageView;
import android.widget.ListView;
import android.widget.ScrollView;
import android.widget.TextView;
import android.widget.Toast;

import com.citizensense.android.util.CampaignListAdapter;

/**
 * Abstract activity for displaying campaigns to the user
 * @author Phil Brown
 * @ahthor Renji Yu
 */
public abstract class CampaignExplorer extends ListActivity 
									   implements OnClickListener{								               
//	/** Adapter for adding campaigns to the gallery*/
//	protected CampaignGalleryAdapter galleryAdapter;
	
	/** Adapter for adding campaigns to the list*/
	protected CampaignListAdapter listAdapter;
	
	/** List of campaigns inflated by the view*/
	protected ArrayList<Campaign> campaigns;
	
//	/** The gallery where the campaigns are stored in gallery mode*/
//	protected Gallery gallery;
	
	/** The list where the campaigns are stored in list mode*/
	protected ListView list;
	
	/** The view used for displaying a single campaign. */
	protected ScrollView campaign_page;
	
	/** Contains a pointer to the last view that was visible before the 
	 * {@link #campaign_page} was brought to the front. */
	protected View lastLayoutView;
	
	/** The current View within the set*/
	protected View current_list_view;
	/** The current position of the set*/
	protected int current_list_position;
		
	@Override
	public void onCreate(Bundle savedInstanceState) {
		super.onCreate(savedInstanceState);
		setContentView(R.layout.campaign_explorer);
		//show gallery (and hide the other one)
		list = (ListView) findViewById(android.R.id.list);
		campaign_page = (ScrollView) findViewById(R.id.campaign_page);
		registerForContextMenu(list);
		
		
		//FIXME: this listener is not used? remove this ?
		list.setOnItemSelectedListener(new OnItemSelectedListener() {

			@Override
			public void onItemSelected(AdapterView<?> parent, 
					                  View view,
					                  int position, 
					                  long id) {
				current_list_view = view;
				current_list_position = position;
//				current_gallery_view = view;
//				current_gallery_position = position;
//				gallery.setSelection(position);
//				list.setVisibility(View.GONE);
//				gallery.setVisibility(View.VISIBLE);
			}

			@Override
			public void onNothingSelected(AdapterView<?> arg0) {}
		});
		list.setOnItemClickListener(new OnItemClickListener() {
			@Override
			public void onItemClick(AdapterView<?> parent, 
					                View view, 
					                int position,
					                long id) {
				Intent i = new Intent(view.getContext(),CampaignGallery.class);
				i.putExtra("position", position);
				System.out.println("position------------>"+position);
				view.getContext().startActivity(i);
//				current_list_view = view;
//				current_list_position = position;
//				current_gallery_view = view;
//				current_gallery_position = position;
//				gallery.setSelection(position);
//				list.setVisibility(View.GONE);
//				gallery.setVisibility(View.VISIBLE);
//				lastLayoutView = list;
				
			}
		});
		campaign_page.setVisibility(View.GONE);
		refresh();
	}//onCreate
	
	@Override
	public void onResume() {
		super.onResume();
	}//onResume
	
	/** Get the campaigns to populate the list or gallery*/
	public abstract ArrayList<Campaign> getCampaigns();//getCampaigns
	
	/** Called when a view is clicked */
	@Override
	public void onClick(View v) {
		if (this.campaign_page.getVisibility() == View.VISIBLE) {
			this.campaign_page.setVisibility(View.GONE);
		}
	}//onClick
	
//	@Override
//    public void onItemSelected(AdapterView<?> parent, 
//    		 				   View view,
//    		 				   int position, 
//    		 				   long id) {
//    	current_gallery_view = view;
//    	current_gallery_position = position;    	
//    	updateIndicator(position);
//    }//onItemSelected
	
//	@Override
//	public void onNothingSelected(AdapterView<?> arg0) {}//onNothingSelected
	
	@Override
	public boolean onKeyDown(int keyCode, KeyEvent event) {
		if (keyCode == KeyEvent.KEYCODE_BACK) {
			if (this.campaign_page.getVisibility() == View.VISIBLE) {
				this.campaign_page.setVisibility(View.GONE);
				this.lastLayoutView.setVisibility(View.VISIBLE);
				return true;
			}
		}
		return super.onKeyDown(keyCode, event);
	}//onKeyDown
	
	/** Refresh the view and update the gallery index indicator */
	public void refresh() {
		//re-retrieve the campaigns. TODO move to non-UI thread
		this.campaigns = getCampaigns();
		G.globalCampaigns = this.campaigns;
		this.refreshView();
	}//refresh
	
	public void openCampaignPage(final Campaign campaign) {
		this.campaign_page.setVisibility(View.VISIBLE);
		//resets the scroll to the top of the screen.
		this.campaign_page.scrollTo(0, 0);
		list.setVisibility(View.GONE);
//		gallery.setVisibility(View.GONE);
		SimpleDateFormat dateFormat;
		if (campaign == null) {
			Toast.makeText(this, "No Campaign found", Toast.LENGTH_SHORT).show();
			finish();//Not sure how this would happen, but just in case
		}
		ImageView image = (ImageView) campaign_page.findViewById(R.id.campaign_image);
		TextView title = (TextView) campaign_page.findViewById(R.id.campaign_title);
		TextView location = (TextView) campaign_page.findViewById(R.id.campaign_location);
		TextView status = (TextView) campaign_page.findViewById(R.id.campaign_status);
		TextView description = (TextView) campaign_page.findViewById(R.id.campaign_description);
		TextView times = (TextView) campaign_page.findViewById(R.id.campaign_times);
		TextView startEndDates = (TextView) campaign_page.findViewById(R.id.campaign_start_and_end_dates);
		TextView task_description = (TextView) campaign_page.findViewById(R.id.task_description);
		Button task_button = (Button) campaign_page.findViewById(R.id.task);
		Button s_or_s = (Button) campaign_page.findViewById(R.id.download_or_delete);
		
		task_button.setTextColor(Color.parseColor("#FFA500"));
		if (G.db.getCampaign(campaign.getId()) == null) {
			s_or_s.setTextColor(Color.GREEN);
			s_or_s.setText("Start");
		}
		else {
			s_or_s.setTextColor(Color.RED);
			s_or_s.setText("Stop");
		}

		task_button.setOnClickListener(new View.OnClickListener() {
			@Override
			public void onClick(View v) {
				Intent i = new Intent(CampaignExplorer.this, Sense.class);
				i.putExtra("campaign", campaign);
				startActivity(i);
			}
		});
		s_or_s.setOnClickListener(new View.OnClickListener() {
			@Override
			public void onClick(View v) {
				Button d = (Button) v;
				if (d.getText().equals("Start")) {
					G.db.addCampaign(campaign);
					d.setTextColor(Color.RED);
					d.setText("Stop");
				}
				else {
					G.db.deleteCampaign(campaign);
					d.setTextColor(Color.GREEN);
					d.setText("Start");
				}
			}
		});
		
		dateFormat = new SimpleDateFormat("MM/dd/yy hh:mm");
		image.setImageResource(campaign.getImage());
		title.setText(campaign.getName());
		
		Time endDate = new Time();
		endDate.set(campaign.getEndDate().getDay(), 
				    campaign.getEndDate().getMonth(), 
				    campaign.getEndDate().getYear());
		Time startDate = new Time();
		startDate.set(campaign.getStartDate().getDay(), 
			          campaign.getStartDate().getMonth(), 
			          campaign.getStartDate().getYear());

//		Time now = new Time();
		Date now = new Date();
//		now.setToNow(); 
//		String isOpen = (now.after(startDate) && now.before(endDate)) ? 
//				        "Open" : "Closed";
		String isOpen = (now.after(campaign.getStartDate()) && now.before(campaign.getEndDate())) ? "Open" : "Closed";
		status.setText("Status: " + isOpen);
		Log.d("CAMP_EXP", "start: " + startDate + " end: " + endDate + " now: " + now);
		if (isOpen.equals("Open")) {
			s_or_s.setEnabled(true);
			task_button.setEnabled(true);
			status.setTextColor(Color.GREEN);
		}
		else {
			status.setTextColor(Color.RED);
			task_button.setEnabled(false);
			s_or_s.setEnabled(false);
		}
		String locs = "";
		String[] locations = campaign.getLocations();
		if (locations != null) {
			for (int i = 0; i < locations.length; i++) {
				locs += locations[i];
				if (i != locations.length - 1) {
					locs += "\n";
				}
			}
		}
		location.setText(locs);
		description.setText(campaign.getDescription());
		String t = "";
		String[] time = campaign.getTimes();
		if (time != null) {
			for (int i = 0; i < time.length; i++) {
				t += time[i];
				if (i != time.length -1) {
					t += "\n";
				}
			}
		}
		times.setText(t);
		String start = dateFormat.format(campaign.getStartDate());
		String end = dateFormat.format(campaign.getEndDate());
		startEndDates.setText(start + " to " + end);
		task_description.setText("Task Instructions:\n" + 
				                 campaign.getTask().getInstructions());
	}//openCampaignPage
	
	/** 
	 * Set the campaigns stored in the list/gallery
	 * @param campaign
	 */
	public void setCampaigns(ArrayList<Campaign> campaigns) {
		this.campaigns = campaigns;
		this.refreshView();
	}//setCampaigns
	
	/** Refresh the Gallery and List Views to reflect changes made in
	 * {@link #refresh()} */
	private void refreshView() {
		if (campaigns != null) {
			listAdapter = new CampaignListAdapter(this, campaigns);
			setListAdapter(listAdapter);
		}
	}//refreshView
	
	
	/* Create menu. */
	public boolean onCreateOptionsMenu(Menu menu) {
		//FIXME: add more options later
		menu.add(0, 0, 0, "Switch User");
		menu.add(0, 1, 1, "Logout");
		menu.add(0, 2, 2, "Refresh");
		return true;
	}

	/* Handle menu options. */
	public boolean onOptionsItemSelected(MenuItem item) {
		int item_id = item.getItemId();

		switch (item_id) {
		case 0: // Switch User
			String username = G.memory.getString("username", "");
			if (!username.equals("")) { // remove the current user's data
				Editor e = G.memory.edit();
				e.remove("username");
				e.remove("password");
				e.remove("cookie");
				e.commit();
			}
			Intent intent = new Intent(this, Login.class);
			intent.setFlags(Intent.FLAG_ACTIVITY_CLEAR_TOP);  
			startActivity(intent);
			break;
		case 1: // Logout, Quit the app.
			System.exit(0);
			break;
		
		case 2:// Refresh view
			refresh();
			break;
		}
		return true;
	}
	
}//CampaignExplorer
