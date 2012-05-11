/* Copyright (c) 2006-2011 Regents of the University of Minnesota.
   For licensing terms, see the file LICENSE.
 */

package com.citizensense.android;

import java.util.ArrayList;

import android.app.Activity;
import android.graphics.Color;
import android.os.Bundle;
import android.view.Gravity;
import android.view.View;
import android.view.Window;
import android.widget.AdapterView;
import android.widget.AdapterView.OnItemSelectedListener;
import android.widget.Gallery;
import android.widget.LinearLayout;
import android.widget.TextView;

import com.citizensense.android.util.ActivityHeader;
import com.citizensense.android.util.CampaignGalleryAdapter;

/**
 * Gallery Campaign 
 * @author Renji Yu
 */
public class CampaignGallery extends Activity implements OnItemSelectedListener{
	
	
	/** Adapter for adding campaigns to the gallery*/
	protected CampaignGalleryAdapter galleryAdapter;
	/** List of campaigns inflated by the view*/
	protected ArrayList<Campaign> campaigns;
	/** The gallery where the campaigns are stored in gallery mode*/
	protected Gallery gallery;
	/** The current position of the set*/
	protected int position;
	
	/** Reference to the header view */
	View headerView; 
	/** Designed to update the header view */
	ActivityHeader header;
	
	@Override
    public void onItemSelected(AdapterView<?> parent, 
    		 				   View view,
    		 				   int position, 
    		 				   long id) {
    	this.position = position;    	
    	updateIndicator(this.position);
    }//onItemSelected

	@Override
	public void onCreate(Bundle savedInstanceState){
		super.onCreate(savedInstanceState);
		requestWindowFeature(Window.FEATURE_NO_TITLE);
		setContentView(R.layout.gallery_campaign);
		
        headerView = findViewById(R.id.header);
        header = new ActivityHeader(headerView);
		
		
		gallery = (Gallery) findViewById(R.id.campaign_gallery);
		registerForContextMenu(gallery);
		
		this.campaigns = G.globalCampaigns;
		galleryAdapter = new CampaignGalleryAdapter(this, campaigns);
		gallery.setAdapter(galleryAdapter);
		
		this.position = getIntent().getIntExtra("position", 0);
		gallery.setSelection(this.position);
		
	}
	
	@Override
	public void onResume(){
		super.onResume();
		header.updateHeader();
	}
	
	/** Update the index indicator at the bottom of the campaign view. 
	 * @param position the current gallery position */
	public void updateIndicator(int position) {
		int totalAdds = gallery.getCount();
		TextView temp;
		LinearLayout indicator = (LinearLayout) findViewById(R.id.gallery_index_indicator);
		indicator.removeAllViews();
		for (int i = 0; i < totalAdds; i++) {
			temp = new TextView(this);
			temp.setText("�");
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

	@Override
	public void onNothingSelected(AdapterView<?> arg0) {
	}
}
