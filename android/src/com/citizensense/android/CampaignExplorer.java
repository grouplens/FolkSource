/* Copyright (c) 2006-2011 Regents of the University of Minnesota.
   For licensing terms, see the file LICENSE.
 */

package com.citizensense.android;

import java.util.ArrayList;

import android.app.ListActivity;
import android.content.Intent;
import android.os.Bundle;
import android.view.View;
import android.view.View.OnClickListener;
import android.widget.AdapterView;
import android.widget.AdapterView.OnItemSelectedListener;
import android.widget.Button;
import android.widget.Gallery;
import android.widget.ListView;

import com.citizensense.android.util.CampaignGalleryAdapter;
import com.citizensense.android.util.CampaignListAdapter;

/**
 * Abstract activity for displaying campaigns to the user
 * @author Phil Brown
 */
public abstract class CampaignExplorer extends ListActivity 
									   implements OnClickListener,
									              OnItemSelectedListener {

	//FIXME: add modifiers to all class variables!!!
	/** Adapter for adding campaigns to the gallery*/
	CampaignGalleryAdapter galleryAdapter;
	
	/** Adapter for adding campaigns to the list*/
	CampaignListAdapter listAdapter;
	
	/** List of campaigns inflated by the view*/
	ArrayList<Campaign> campaigns;
	
	/** The gallery where the campaigns are stored in gallery mode*/
	Gallery gallery;
	
	/** The list where the campaigns are stored in list mode*/
	ListView list;
	
	Button listMode;
	Button galleryMode;
	Button mapMode;
	
	/** The current View within the gallery*/
	View current_gallery_view;
	/** The current position of the gallery*/
	int current_gallery_position;
	
	@Override
	public void onCreate(Bundle savedInstanceState) {
		super.onCreate(savedInstanceState);
		setContentView(R.layout.campaign_explorer);
		//show list or gallery (and hide the other one)
		list = (ListView) findViewById(android.R.id.list);
		gallery = (Gallery) findViewById(R.id.campaign_gallery);
		registerForContextMenu(gallery);
		registerForContextMenu(list);
		gallery.setOnItemSelectedListener(this);
		//list.setOnItemSelectedListener(this);
		//TODO: save which view the user last used (otherwise, default to gallery).
		list.setVisibility(View.GONE);
		
		listMode = (Button) findViewById(R.id.view_as_list);
		listMode.setOnClickListener(this);
		galleryMode = (Button) findViewById(R.id.view_as_gallery);
		galleryMode.setOnClickListener(this);
		mapMode = (Button) findViewById(R.id.view_as_map);
		mapMode.setOnClickListener(this);
		//registerForContextMenu(G.map);
		
		//set campaigns for LocationService
		LocationService.campaigns = getCampaigns();
        //start the LocationService to track the user's location
        startLocationService();
		
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
		if (v == listMode) {
			gallery.setVisibility(View.GONE);
			list.setVisibility(View.VISIBLE);
		}
		else if (v == galleryMode) {
			list.setVisibility(View.GONE);
			gallery.setVisibility(View.VISIBLE);
		}
		else if (v == mapMode) {
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
    }//onItemSelected
	
	@Override
	public void onNothingSelected(AdapterView<?> arg0) {}//onNothingSelected
	
	/** Refresh the view*/
	public void refresh() {
		//re-retrieve the campaigns. TODO move to non-UI thread
		campaigns = getCampaigns();
		
		//add campaigns to the list
		if (campaigns != null) {
			listAdapter = new CampaignListAdapter(this, campaigns);
			setListAdapter(listAdapter);
			galleryAdapter = new CampaignGalleryAdapter(this, campaigns);
			gallery.setAdapter(galleryAdapter);
		}
	}//refresh
	
    public void startLocationService(){
        Intent intent = new Intent();
        intent.setClass(this, LocationService.class);
        startService(intent);
    }
    
    public void stopLocationService(){
        Intent intent = new Intent();
        intent.setClass(this, LocationService.class);
        stopService(intent);
    }
}//CampaignExplorer
