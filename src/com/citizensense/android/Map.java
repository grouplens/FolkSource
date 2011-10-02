/* Copyright (c) 2006-2011 Regents of the University of Minnesota.
   For licensing terms, see the file LICENSE.
 */

package com.citizensense.android;

import android.os.Bundle;

import com.google.android.maps.MapActivity;
import com.google.android.maps.MapView;

/**
 * Map activity
 * @author Phil Brown
 * @author Renji Yu
 */
public class abstract Map extends MapActivity implements LocationListener{
    	
	/** Initialize the map*/
    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.map);
        G.map = (MapView) findViewById(R.id.mapview);
        G.map.setBuiltInZoomControls(true);
    }//onCreate

    /** Required by MapActivity. Currently unused.*/
	@Override
	protected boolean isRouteDisplayed() {
		return false;
	}//isRouteDisplayed
	
	
	abstract ArrayList<Campaign> getCampaigns(){}
	abstract void showDialog(){}
}//Map