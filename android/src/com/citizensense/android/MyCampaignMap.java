package com.citizensense.android;

import java.util.ArrayList;
import java.util.List;

import com.citizensense.android.conf.Constants;
import com.google.android.maps.Overlay;

import android.app.AlertDialog;
import android.content.Context;
import android.location.LocationManager;
import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.widget.LinearLayout;
import android.widget.TextView;


public class MyCampaignMap extends Map{
	
	@Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        
        LocationManager locationManager = (LocationManager)this.getSystemService(
        		Context.LOCATION_SERVICE);
        locationManager.requestLocationUpdates(LocationManager.GPS_PROVIDER, 0, 0, this);
        
		PointOverlay pointOverlay = null;
		CircleOverlay circleOverlay = null;
		List<Overlay> mapOverlays = G.map.getOverlays();
		
		// Show all campaigns  on the map.
        for(Campaign campaign : campaigns){
        	for(String loc : campaign.getLocations()){
    			if(getLocType(loc)==Constants.EXACT_LOCATION){
    				pointOverlay = new PointOverlay(getGeopoint(loc));
    				mapOverlays.add(pointOverlay);
    				G.map.getController().animateTo(getGeopoint(loc));
    			}
    		    circleOverlay = new CircleOverlay(getGeopoint(loc),getRadius(loc));
    	        mapOverlays.add(circleOverlay);
    	        setZoomLevel(loc);
        	}
        }
    }//onCreate

	
	/** Get campaigns from local database.*/
	@Override
	ArrayList<Campaign> getCampaigns() {
		/** pull the campaigns from the local Android database*/
		ArrayList<Campaign> results = new ArrayList<Campaign>();
		for(String campaignID: G.user.getCampaignIDs()){
			results.add(G.db.getCampaignById(campaignID));
		}
		return results;
	}

	/** Shows a dialog to notify the user he is in range of some campaigns.
	 *  The user could navigate to complete the task or go to home page.*/
	@Override
	public void showDialog() {
		  LayoutInflater inflater = (LayoutInflater) this.getSystemService(
				  Context.LAYOUT_INFLATER_SERVICE);
		  View view = inflater.inflate(R.layout.my_campaign_dialog,null);
		  LinearLayout layout = (LinearLayout) view.findViewById(R.id.myDialog); 
		  
		  for(int i=0;i<inRangeCampaigns.size();i++){
			  TextView tv = new  TextView(this);
			  Campaign c = inRangeCampaigns.get(i);
			  int j = i+1;
			  tv.setText(j+". "+c.getName()+"\n"+c.getDescription());   
			  tv.setTextSize(20);
			  layout.addView(tv);    	  
		  }			

		  AlertDialog.Builder dialog = new  AlertDialog.Builder(this); 
		  dialog.setTitle("You are in range of these Campaigns:");   
		  dialog.setPositiveButton("Complete Task", null);
		  dialog.setNeutralButton("Home", null);
		  dialog.setNegativeButton("Cancel", null);
		  dialog.setView(view); 		  
		  dialog.show();		
	}


	

}
