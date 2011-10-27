/* Copyright (c) 2006-2011 Regents of the University of Minnesota.
   For licensing terms, see the file LICENSE.
 

package com.citizensense.android.util;

import java.util.ArrayList;

import android.content.Context;
import android.content.res.TypedArray;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.view.WindowManager;
import android.widget.BaseAdapter;
import android.widget.Gallery;
import android.widget.ImageView;
import android.widget.TextView;

import com.citizensense.android.Campaign;
import com.citizensense.android.G;
import com.citizensense.android.R;

*//**
 * Displays campaigns in the Campaign Browser Gallery.
 * @author Phil Brown
 *//*
public class CampaignAdapter extends BaseAdapter {

	*//** Context used to access resources and system services*//*
	private Context context;
	*//** Contains the campaigns in the gallery *//*
	private ArrayList<Campaign> campaigns;
	
	*//** Constructor. Accessed directly from the XML.*//*
	public CampaignAdapter(Context c) {
		context = c;
        TypedArray attr = 
        	context.obtainStyledAttributes(R.styleable.CampaignGallery);
        attr.recycle();
        campaigns = new ArrayList<Campaign>();
        //FIXME populate campaigns directly from the database
		this.putCampaign(G.db.getCampaignById("1"));
		this.putCampaign(G.db.getCampaignById("2"));        
	}//CampaignAdapter
	
	*//** Returns the number of campaigns in the gallery*//*
	@Override
	public int getCount() {
		return campaigns.size();
	}//getCount

	*//** Gets the item located at the provided position
	 * @param position index of the Campaign in the gallery *//*
	@Override
	public Object getItem(int position) {
		return campaigns.get(position);
	}//getItem

	*//** Gets the ID of the Campaign
	 * @param position index of the campaign*//*
	@Override
	public long getItemId(int position) {
		String id = campaigns.get(position).getId();
		return Long.parseLong(id);
	}//getItemId
	
	*//** Get the position (index) of the campaign, if it exists in the gallery.
	 * Returns -1 if no campaign is found.
	 * @param campaign campaign to search for *//*
	public long getPosition(Campaign campaign) {
    	if (campaigns.contains(campaign)) {
    		return campaigns.indexOf(campaign);
    	}
    	else {
    		return -1;
    	}
    }//getPosition
    
	*//** Insert a campaign into the gallery*//*
    public void putCampaign(Campaign campaign) {
    	campaigns.add(campaign);
    }//putCampaign

    *//** Inflate a view that is customized for each particular campaign in the 
     * gallery.*//*
	@Override
	public View getView(int position, View convertView, ViewGroup parent) {
		View v = convertView;
		if (v == null) {
	         LayoutInflater vi = (LayoutInflater)context.getSystemService(
	        		                          Context.LAYOUT_INFLATER_SERVICE);
	         v = vi.inflate(R.layout.campaign_item, null);
		}
		TextView tv = (TextView) v.findViewById(R.id.campaign_info);
		ImageView iv = (ImageView) v.findViewById(R.id.campaign_pic);
		if (position == 1) {
			iv.setImageResource(R.drawable.potholes);
			//tv.setText(G.db.getCampaignById("1").getName());
		} else {
			//Toast.makeText(context, "position=" + position, Toast.LENGTH_SHORT).show();
			iv.setImageResource(R.drawable.busrack);
			//tv.setText(G.db.getCampaignById("2").getName());
		}
		Campaign campaign = G.db.getCampaignById(Integer.toString(position+1));
		if (campaign != null) 
			tv.setText(campaign.getName());
		v.setLayoutParams(new Gallery.LayoutParams(
				WindowManager.LayoutParams.FILL_PARENT, 
                WindowManager.LayoutParams.FILL_PARENT));
		return v;
	}//getView
	
}//CampaignAdapter
*/