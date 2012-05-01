/* Copyright (c) 2006-2011 Regents of the University of Minnesota.
   For licensing terms, see the file LICENSE.
 */

package com.citizensense.android.util;

import java.util.ArrayList;
import java.util.Collections;
import java.util.Date;

import android.content.Context;
import android.content.Intent;
import android.content.res.TypedArray;
import android.graphics.Color;
import android.text.format.Time;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.View.OnClickListener;
import android.view.ViewGroup;
import android.view.WindowManager;
import android.widget.BaseAdapter;
import android.widget.Button;
import android.widget.Gallery;
import android.widget.ImageButton;
import android.widget.ImageView;
import android.widget.TextView;
import android.widget.Toast;

import com.citizensense.android.Campaign;
import com.citizensense.android.Form;
import com.citizensense.android.G;
import com.citizensense.android.Map;
import com.citizensense.android.Question;
import com.citizensense.android.R;
import com.citizensense.android.Sense;
import com.citizensense.android.Task;
import com.citizensense.android.conf.Constants;

/**
 * Displays campaigns as a gallery.
 * @author Phil Brown
 */
public class CampaignGalleryAdapter extends BaseAdapter {
	
	public TextView title;
	public TextView descr;
	public ImageView image;
	public ImageButton map_button;
	public Button s_or_s;

	/** Context used to access resources and system services*/
	private Context context;
	/** Contains the campaigns in the gallery */
	private ArrayList<Campaign> campaigns;
	
	/** Constructor. Accessed directly from the XML.*/
	public CampaignGalleryAdapter(Context c, ArrayList<Campaign> campaigns) {
		context = c;
		this.campaigns = campaigns;
		Collections.sort(campaigns);
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
	         v = vi.inflate(R.layout.relative_campaign_gallery_item, null);
		}
		title = (TextView) v.findViewById(R.id.campaign_title);
		descr = (TextView) v.findViewById(R.id.campaign_description);
		image = (ImageView) v.findViewById(R.id.campaign_image);
		map_button = (ImageButton) v.findViewById(R.id.camp_map);
		s_or_s = (Button) v.findViewById(R.id.download_or_delete);
		
		final Campaign campaign = campaigns.get(position);
		
		if (G.db.getCampaign(campaign.getId()) == null) {
			s_or_s.setText("Watch this Campaign");
		}
		else {
			title.setTextColor(Color.GREEN);
			s_or_s.setText("Stop Watching this Campaign");
		}
		if (campaign != null) {

			title.setText(campaign.getName());
			String start = "Start Date: " + campaign.getStartDate().toString();
			String end = "End Date: " + campaign.getEndDate().toString();
			if (campaign.getTimes() != null) {
				String[]time_intervals = campaign.getTimes();
				String times = "Times:\n ";
				for (int i=0; i<time_intervals.length; i++) {
					times += time_intervals[i] + "\n";
					
				}
			}
			//Set status by computing if the current date is before or after
			//the end date of the campaign.
			//TODO add hour accuracy.
			Time endDate = new Time();
			endDate.set(campaign.getEndDate().getDay(), 
					    campaign.getEndDate().getMonth(), 
					    campaign.getEndDate().getYear());
			Time startDate = new Time();
			startDate.set(campaign.getStartDate().getDay(), 
				          campaign.getStartDate().getMonth(), 
				          campaign.getStartDate().getYear());
//			Time now = new Time();
			Date now = new Date();
//			now.setToNow(); 
//			String isOpen = (now.after(startDate) && now.before(endDate)) ? 
//					        "Open" : "Closed";
			String isOpen = (now.after(campaign.getStartDate()) && now.before(campaign.getEndDate())) ? "Open" : "Closed";
			Log.d("GAL_ADAPT", "start: " + startDate + " end: " + endDate);
			TextView status = (TextView) v.findViewById(R.id.campaign_status);
			status.setText("Status: " + isOpen);
			if (isOpen.equals("Open")) {
				status.setTextColor(Color.GREEN);
				s_or_s.setEnabled(true);
				map_button.setEnabled(true);
			}
			else {
				Log.d("STAT", "setting status to " + isOpen);
				map_button.setEnabled(false);
				s_or_s.setEnabled(false);
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
//			TextView where = (TextView) v.findViewById(R.id.campaign_location);
//			where.setText(locs);
			//info.setText(information);
			descr.setText(campaign.getDescription());
			//TODO unpack full campaign
			//String more = "More Details available";
			Task t = campaign.getTask();
			
			if (t != null) {
				String tname = t.getName();
				String tdesc = t.getInstructions();
			
				Form f = t.getForm();
				Question[] q = f.getQuestions();
				if (Constants.DEBUG) Log.i("HOME", "NUMBER OF QUESTIONS: " + q.length);
				String qs = "";
				for (int i=0; i<q.length; i++ ) {
					Log.i("Questions", qs);
					qs += q[i].toString();
				}
			}
			if (campaign.getImage() != 0) {
				image.setImageResource(campaign.getImage());
			}
			//DO something with the buttons
			map_button.setOnClickListener(new OnClickListener() {
				@Override
				public void onClick(View v) {

					if(campaign.getTask()==null){
						Toast.makeText(v.getContext(), "No task defined for this campaign.", Toast.LENGTH_LONG).show();
					}
					else{
						Intent i = new Intent(context, Map.class);
						i.putExtra("campaign", campaign);
						context.startActivity(i);
					}
				}
			});
			
			s_or_s.setOnClickListener(new OnClickListener() {

				@Override
				public void onClick(View v) {
					if(campaign==null)	return;
					Button d = (Button) v;
					if (d.getText().equals("Watch this Campaign")) {
						notifyDataSetChanged();
						if(G.db.addCampaign(campaign) != -1){//db insert success
							campaign.started = true;
							title.setTextColor(Color.GREEN);
							d.setText("Stop Watching this Campaign");
							//add this to have the UI updated
							notifyDataSetChanged();
							Toast.makeText(v.getContext(), "You will receive notifiations about this campaign when you are in the range defined on the map.", Toast.LENGTH_LONG).show();
						}else{
							Toast.makeText(v.getContext(), "Can't store campaign locally.", Toast.LENGTH_LONG).show();
						}

					}
					else {
						if(G.db.deleteCampaign(campaign)){//db delete success
							campaign.started = false;
							title.setTextColor(Color.WHITE);
							d.setText("Watch this Campaign");
							notifyDataSetChanged();
							Toast.makeText(v.getContext(), "You will no longer receive notifications about this campaign.", Toast.LENGTH_LONG).show();
						}else{
							Toast.makeText(v.getContext(), "Can't delete campaign.", Toast.LENGTH_LONG).show();
						}

					}
					
				}
				
			});
		}
		
		v.setLayoutParams(new Gallery.LayoutParams(
				WindowManager.LayoutParams.FILL_PARENT, 
                WindowManager.LayoutParams.FILL_PARENT));
		return v;
	}//getView
	
}//CampaignGalleryAdapter
