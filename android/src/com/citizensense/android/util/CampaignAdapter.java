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

public class CampaignAdapter extends BaseAdapter {

	private Context context;
	//private int layout_style;
	private ArrayList<Campaign> campaigns;
		
	public CampaignAdapter(Context c) {
		context = c;
		//this.layout_style = layout_style;
        TypedArray attr = context.obtainStyledAttributes(R.styleable.CampaignGallery);
        //mGalleryItemBackground = attr.getResourceId(
        //        R.styleable.AddGallery_android_galleryItemBackground, 0);
        attr.recycle();
        campaigns = new ArrayList<Campaign>();
        //populate
        //Toast.makeText(c, ""+G.db.size(), Toast.LENGTH_SHORT).show();
		//for (int i=1; i<=2; i++) { //i<=G.db.size(); i++) {
			this.putAdd(G.db.getCampaignById("1"));//Integer.toString(i)));
			this.putAdd(G.db.getCampaignById("2"));
		//}
        
	}
	
	@Override
	public int getCount() {
		return campaigns.size();
	}

	@Override
	public Object getItem(int position) {
		return campaigns.get(position);
	}

	@Override
	public long getItemId(int position) {
		String id = campaigns.get(position).getId();
		return Long.parseLong(id);//FIXME will fail now.
	}
	
	public long getPosition(Campaign campaign) {
    	if (campaigns.contains(campaign)) {
    		return campaigns.indexOf(campaign);
    	}
    	else {
    		return -1;
    	}
    }
    
    public void putAdd(Campaign campaign) {
    	campaigns.add(campaign);
    }

	@Override
	public View getView(int position, View convertView, ViewGroup parent) {
		View v = convertView;
		if (v == null) {
	         LayoutInflater vi =
	            (LayoutInflater)context.getSystemService(Context.LAYOUT_INFLATER_SERVICE);
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
		v.setLayoutParams(new Gallery.LayoutParams(WindowManager.LayoutParams.FILL_PARENT, 
                WindowManager.LayoutParams.FILL_PARENT));
		return v;
	}
	
	

}
