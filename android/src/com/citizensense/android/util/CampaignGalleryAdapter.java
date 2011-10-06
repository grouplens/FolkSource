/* Copyright (c) 2006-2011 Regents of the University of Minnesota.
   For licensing terms, see the file LICENSE.
 */

package com.citizensense.android.util;

import java.util.ArrayList;

import android.content.Context;
import android.content.res.TypedArray;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.view.WindowManager;
import android.widget.BaseAdapter;
import android.widget.Button;
import android.widget.Gallery;
import android.widget.ImageView;
import android.widget.TextView;

import com.citizensense.android.Campaign;
import com.citizensense.android.Campaign.Task;
import com.citizensense.android.Campaign.Task.Form;
import com.citizensense.android.Question;
import com.citizensense.android.R;
import com.citizensense.android.conf.Constants;

/**
 * Displays campaigns as a gallery.
 * @author Phil Brown
 */
public class CampaignGalleryAdapter extends BaseAdapter {

	/** Context used to access resources and system services*/
	private Context context;
	/** Contains the campaigns in the gallery */
	private ArrayList<Campaign> campaigns;
	
	/** Constructor. Accessed directly from the XML.*/
	public CampaignGalleryAdapter(Context c, ArrayList<Campaign> campaigns) {
		context = c;
		this.campaigns = campaigns;
        TypedArray attr = 
        	context.obtainStyledAttributes(R.styleable.CampaignGallery);
        attr.recycle();        
	}//CampaignGalleryAdapter
	
	/** Returns the number of campaigns in the gallery*/
	@Override
	public int getCount() {
		if (campaigns != null) {
			return campaigns.size();
		}
		return 0;
	}//getCount

	/** Gets the item located at the provided position
	 * @param position index of the Campaign in the gallery */
	@Override
	public Object getItem(int position) {
		return campaigns.get(position);
	}//getItem

	/** Gets the ID of the Campaign
	 * @param position index of the campaign*/
	@Override
	public long getItemId(int position) {
		String id = campaigns.get(position).getId();
		return Long.parseLong(id);
	}//getItemId
	
	/** Get the position (index) of the campaign, if it exists in the gallery.
	 * Returns -1 if no campaign is found.
	 * @param campaign campaign to search for */
	public long getPosition(Campaign campaign) {
    	if (campaigns.contains(campaign)) {
    		return campaigns.indexOf(campaign);
    	}
    	else {
    		return -1;
    	}
    }//getPosition
    
	/** Insert a campaign into the gallery*/
    public void putCampaign(Campaign campaign) {
    	campaigns.add(campaign);
    }//putCampaign

    /** Inflate a view that is customized for each particular campaign in the 
     * gallery.*/
	@Override
	public View getView(int position, View convertView, ViewGroup parent) {
		View v = convertView;
		if (v == null) {
	         LayoutInflater vi = (LayoutInflater)context.getSystemService(
	        		                          Context.LAYOUT_INFLATER_SERVICE);
	         v = vi.inflate(R.layout.campaign, null);
		}
		TextView title = (TextView) v.findViewById(R.id.campaign_title);
		TextView descr = (TextView) v.findViewById(R.id.campaign_description);
		TextView info = (TextView) v.findViewById(R.id.campaign_info);
		ImageView image = (ImageView) v.findViewById(R.id.campaign_image);
		Button map_button = (Button) v.findViewById(R.id.map);
		Button task_button = (Button) v.findViewById(R.id.task);
		Button d_or_d = (Button) v.findViewById(R.id.download_or_delete);
		//Button more = (Button) v.findViewById(R.id.more);
		//FIXME
		//iv.setVisibility(View.GONE);
		/*
		if (position == 1) {
			iv.setImageResource(R.drawable.potholes);
			//tv.setText(G.db.getCampaignById("1").getName());
		} else {
			//Toast.makeText(context, "position=" + position, Toast.LENGTH_SHORT).show();
			iv.setImageResource(R.drawable.busrack);
			//tv.setText(G.db.getCampaignById("2").getName());
		}
		*/
		Campaign campaign = campaigns.get(position);
		//unpack campaign and display (for now) FIXME improve it!
		if (campaign != null) {
			title.setText(campaign.getName());
			//title.setText(name);
			String start = "Start Date:\n " + campaign.getStartDate().toString();
			String end = "End Date:\n " + campaign.getEndDate().toString();
			String[]time_intervals = campaign.getTimes();
			String times = "Times:\n ";
			for (int i=0; i<time_intervals.length; i++) {
				times += time_intervals[i] + "\n";
				
			}

			String locs = "Locations: ";
			String[] locations = campaign.getLocations();
			for (int i=0; i<locations.length; i++) {
				locs += "\n" + locations[i];
			}
			String information = start + "\n" + end + "\n" + times + locs;
			info.setText(information);
			descr.setText(campaign.getDescription());
			//TODO unpack full campaign
			//String more = "More Details available";
			Task t = campaign.getTask();
			String tname = t.name;
			String tdesc = t.instructions;
		
			Form f = t.getForm();
			Question[] q = f.getQuestions();
			if (Constants.DEBUG) Log.i("HOME", "NUMBER OF QUESTIONS: " + q.length);
			String qs = "";
			for (int i=0; i<q.length; i++ ) {
				Log.i("Questions", qs);
				qs += q[i].toString();
			}
			//TODO something with the buttons
		}
		
		v.setLayoutParams(new Gallery.LayoutParams(
				WindowManager.LayoutParams.FILL_PARENT, 
                WindowManager.LayoutParams.FILL_PARENT));
		return v;
	}//getView
	
}//CampaignGalleryAdapter