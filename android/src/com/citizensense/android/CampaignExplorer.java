/* Copyright (c) 2006-2011 Regents of the University of Minnesota.
   For licensing terms, see the file LICENSE.
 */

package com.citizensense.android;

import java.text.SimpleDateFormat;
import java.util.ArrayList;

import android.app.ListActivity;
import android.content.Intent;
import android.content.SharedPreferences.Editor;
import android.graphics.Color;
import android.os.Bundle;
import android.text.format.Time;
import android.view.Gravity;
import android.view.KeyEvent;
import android.view.Menu;
import android.view.MenuItem;
import android.view.View;
import android.view.View.OnClickListener;
import android.widget.AdapterView;
import android.widget.AdapterView.OnItemClickListener;
import android.widget.AdapterView.OnItemSelectedListener;
import android.widget.Button;
import android.widget.Gallery;
import android.widget.ImageView;
import android.widget.LinearLayout;
import android.widget.ListView;
import android.widget.ScrollView;
import android.widget.TextView;
import android.widget.Toast;

import com.citizensense.android.util.CampaignGalleryAdapter;
import com.citizensense.android.util.CampaignListAdapter;

/**
 * Abstract activity for displaying campaigns to the user
 * @author Phil Brown
 */
public abstract class CampaignExplorer extends ListActivity 
									   implements OnClickListener,
									              OnItemSelectedListener {

	/** Adapter for adding campaigns to the gallery*/
	protected CampaignGalleryAdapter galleryAdapter;
	
	/** Adapter for adding campaigns to the list*/
	protected CampaignListAdapter listAdapter;
	
	/** List of campaigns inflated by the view*/
	protected ArrayList<Campaign> campaigns;
	
	/** The gallery where the campaigns are stored in gallery mode*/
	protected Gallery gallery;
	
	/** The list where the campaigns are stored in list mode*/
	protected ListView list;
	
	/** The view used for displaying a single campaign. */
	protected ScrollView campaign_page;
	
	/** Contains a pointer to the last view that was visible before the 
	 * {@link #campaign_page} was brought to the front. */
	protected View lastLayoutView;
	
	/** Button indicating the way that the on-screen campaigns should be
	 * displayed. */
	protected Button listMode, galleryMode, mapMode;
	
	/** The current View within the set*/
	protected View current_gallery_view, current_list_view;
	/** The current position of the set*/
	protected int current_gallery_position, current_list_position;
		
	@Override
	public void onCreate(Bundle savedInstanceState) {
		super.onCreate(savedInstanceState);
		setContentView(R.layout.campaign_explorer);
		//show list or gallery (and hide the other one)
		list = (ListView) findViewById(android.R.id.list);
		gallery = (Gallery) findViewById(R.id.campaign_gallery);
		campaign_page = (ScrollView) findViewById(R.id.campaign_page);
		registerForContextMenu(gallery);
		registerForContextMenu(list);
		gallery.setOnItemSelectedListener(this);
		gallery.setOnItemClickListener(new OnItemClickListener() {

			@Override
			public void onItemClick(AdapterView<?> parent, 
					                View view, 
					                int position,
					                long id) {
				openCampaignPage(campaigns.get(current_gallery_position));
				lastLayoutView = gallery;
			}
		});
		list.setOnItemSelectedListener(new OnItemSelectedListener() {

			@Override
			public void onItemSelected(AdapterView<?> parent, 
					                  View view,
					                  int position, 
					                  long id) {
				current_list_view = view;
				current_list_position = position;
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
				current_list_view = view;
				current_list_position = position;
				openCampaignPage(campaigns.get(current_list_position));
				lastLayoutView = list;
			}
		});
		list.setVisibility(View.GONE);
		campaign_page.setVisibility(View.GONE);
		lastLayoutView = list;
		
		listMode = (Button) findViewById(R.id.view_as_list);
		listMode.setOnClickListener(this);
		galleryMode = (Button) findViewById(R.id.view_as_gallery);
		galleryMode.setOnClickListener(this);
		mapMode = (Button) findViewById(R.id.view_as_map);
		mapMode.setOnClickListener(this);
		//registerForContextMenu(G.map);
		
	}//onCreate
	
	@Override
	public void onResume() {
		super.onResume();
		refresh();
	}//onResume
	
	/** Get the campaigns to populate the list or gallery*/
	public abstract ArrayList<Campaign> getCampaigns();//getCampaigns
	
	/** Called when a view is clicked */
	@Override
	public void onClick(View v) {
		if (this.campaign_page.getVisibility() == View.VISIBLE) {
			this.campaign_page.setVisibility(View.GONE);
		}
		if (v == listMode) {
			gallery.setVisibility(View.GONE);
			list.setVisibility(View.VISIBLE);
		}
		else if (v == galleryMode) {
			list.setVisibility(View.GONE);
			gallery.setVisibility(View.VISIBLE);
		}
		else if (v == mapMode) {
			if (campaigns != null)
				G.globalCampaigns = campaigns;
			CitizenSense.openMap();
		}
	}//onClick
	
	@Override
    public void onItemSelected(AdapterView<?> parent, 
    		 				   View view,
    		 				   int position, 
    		 				   long id) {
    	current_gallery_view = view;
    	current_gallery_position = position;
    	updateIndicator(position);
    }//onItemSelected
	
	@Override
	public void onNothingSelected(AdapterView<?> arg0) {}//onNothingSelected
	
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
		campaigns = getCampaigns();
		this.refreshView();
	}//refresh
	
	public void openCampaignPage(final Campaign campaign) {
		this.campaign_page.setVisibility(View.VISIBLE);
		//resets the scroll to the top of the screen.
		this.campaign_page.scrollTo(0, 0);
		list.setVisibility(View.GONE);
		gallery.setVisibility(View.GONE);
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
		Button map_button = (Button) campaign_page.findViewById(R.id.map);
		Button task_button = (Button) campaign_page.findViewById(R.id.task);
		Button d_or_d = (Button) campaign_page.findViewById(R.id.download_or_delete);
		if (G.db.getCampaign(campaign.getId()) == null) {
			d_or_d.setText("Download");
		}
		else {
			d_or_d.setText("Delete");
		}
		map_button.setOnClickListener(new View.OnClickListener() {
			@Override
			public void onClick(View v) {
				ArrayList<Campaign> cams = new ArrayList<Campaign>();
				cams.add(campaign);
				G.globalCampaigns = cams;
				CitizenSense.openMap();
			}
		});
		task_button.setOnClickListener(new View.OnClickListener() {
			@Override
			public void onClick(View v) {
				Intent i = new Intent(CampaignExplorer.this, Sense.class);
				i.putExtra("campaign", campaign);
				startActivity(i);
			}
		});
		d_or_d.setOnClickListener(new View.OnClickListener() {
			@Override
			public void onClick(View v) {
				Button d = (Button) v;
				if (d.getText().equals("Download")) {
					G.db.addCampaign(campaign);
					d.setText("Delete");
				}
				else {
					G.db.deleteCampaign(campaign);
					d.setText("Download");
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
			galleryAdapter = new CampaignGalleryAdapter(this, campaigns);
			gallery.setAdapter(galleryAdapter);
		}
	}//refreshView
	
	/** Update the index indicator at the bottom of the campaign view. 
	 * @param position the current gallery position */
	public void updateIndicator(int position) {
		int totalAdds = gallery.getCount();
		TextView temp;
		LinearLayout indicator = (LinearLayout) findViewById(R.id.gallery_index_indicator);
		indicator.removeAllViews();
		for (int i = 0; i < totalAdds; i++) {
			temp = new TextView(this);
			temp.setText("? ");
			temp.setGravity(Gravity.CENTER);
			if (i == position){
				temp.setTextColor(Color.BLUE);
			}
			else {
				temp.setTextColor(Color.LTGRAY);
			}
			indicator.addView(temp, i);
		}
	}//updateIndicator
	
	/* Create menu. */
	public boolean onCreateOptionsMenu(Menu menu) {
		//FIXME: add more options later
		menu.add(0, 0, 0, "Switch User");
		menu.add(0, 1, 1, "Logout");
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
		}
		return true;
	}
	
}//CampaignExplorer
