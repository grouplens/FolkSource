/* Copyright (c) 2006-2011 Regents of the University of Minnesota.
   For licensing terms, see the file LICENSE.
 */

package com.citizensense.android;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Locale;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.graphics.Canvas;
import android.graphics.Color;
import android.graphics.Paint;
import android.graphics.Point;
import android.graphics.Paint.Style;
import android.location.Address;
import android.location.Geocoder;
import android.location.Location;
import android.location.LocationListener;
import android.os.Bundle;

import com.citizensense.android.conf.Constants;
import com.google.android.maps.GeoPoint;
import com.google.android.maps.MapActivity;
import com.google.android.maps.MapView;
import com.google.android.maps.Overlay;
import com.google.android.maps.Projection;

/**
 * Map activity
 * @author Phil Brown
 * @author Renji Yu
 */
public abstract class Map extends MapActivity  implements LocationListener{
	
	/** For CampaignBrowser view, this refers to all the campaigns get from server;
	 *  for MyCampaign view, this refers to all campaigns stored in local database. */
	protected ArrayList<Campaign> campaigns;	
	
	/** This list contains all the campaigns close to the user.*/
	protected ArrayList<Campaign> inRangeCampaigns;
    	
	/** Initialize the map*/
    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.map);
        G.map = (MapView) findViewById(R.id.mapview);
        G.map.setBuiltInZoomControls(true);
        
        // Get campaigns from server or local database.
        campaigns = getCampaigns();
    }//onCreate


    /** When the user's location changed, this function is called.
     *  It will reset the inRangeCampaigns list, if the list is not
     *  empty, it will send a notification to the user.*/
	@Override
	public void onLocationChanged(Location location) {
		if(getInRangeCampaigns(location).size() != 0){
			inRangeCampaigns = getInRangeCampaigns(location);
			showDialog();
		}
	}

	public ArrayList<Campaign> getInRangeCampaigns(Location location) {
		ArrayList<Campaign> results = new ArrayList<Campaign>(); 
		for(Campaign campaign : campaigns){
			if(isInRange(location,campaign)){
				results.add(campaign);
			}
		}
		return results;
	}


	/** Get campaigns from a source.*/
	abstract ArrayList<Campaign> getCampaigns();
	
	
	/** Shows a dialog to notify user he is in range of some campaigns.*/
	abstract void showDialog();
	
	/** Check if the user is in the range of a campaign.*/
	public boolean isInRange(Location location, Campaign campagin){
		for(String loc : campagin.getLocations()){
			GeoPoint point = getGeopoint(loc);
			Location camLocation = new Location("CampaignLocation");
			double lat = (double)point.getLatitudeE6()/1000000.0;
			double lon = (double)point.getLongitudeE6()/1000000.0;
			camLocation.setLatitude(lat);
			camLocation.setLongitude(lon);
			if(location.distanceTo(camLocation) <= getRadius(loc)){
				return true;
			}
		}
		return false;
	}
	
	
	/** Set zoom level of the map according to the location's type.*/
	public void setZoomLevel(String loc){
		if(getLocType(loc) == Constants.EXACT_LOCATION){
			G.map.getController().setZoom(15);
		}else{
			G.map.getController().setZoom(11);
		}
	}
	
	/** Get locations of the campaign from database by searching the campaign's id.*/
    public String[] getLocsByCampaignId(String id){
    	Campaign c = G.db.getCampaignById(id);
    	return c.getLocations();
    }
    
    /** Get the type of the location: (longitude,latitude) is EXACT_LOCATION, 
     * (city, state) is NONEXACT_LOCATION. */
    public boolean getLocType(String  loc){ 
    	 Pattern pattern=Pattern.compile("\\d");  
         Matcher matcher=pattern.matcher(loc);
         if(matcher.find()==true)
        	 return Constants.EXACT_LOCATION;
         return Constants.NONEXACT_LOCATION;
    }
    
    
    /** Get the radius of the circle centered at loc. If loc is EXACT_LOCATION,
     *  set the radius to 10 meters, otherwise, set the radius to 10000 meters. 
     *  This function may be updated if we can get more geo information.*/
    public float getRadius(String loc){
    	if(getLocType(loc)== Constants.EXACT_LOCATION){
    		return 10;
    	}else{
    		return 10000;
    	}
    }
    
    /** Get a GeoPoint from a string.*/
    public GeoPoint getGeopoint(String loc){
		if(getLocType(loc) == Constants.EXACT_LOCATION){
	    	loc = loc.replaceAll(" ", "");
	    	String[] long_lat = loc.split(",");
			int longitude = Integer.parseInt(long_lat[0])*1000000;
			int latitude = Integer.parseInt(long_lat[1])*1000000;
			return new GeoPoint(latitude,longitude);
		}else if(getLocType(loc)== Constants.NONEXACT_LOCATION){ 
			Geocoder  mygeoCoder=new Geocoder(this,Locale.getDefault());
			List<Address> lstAddress = null;
			try {
				// getFromLocationName() will return a list of Address which 
				// matches the location name(first parameter)
				lstAddress = mygeoCoder.getFromLocationName(loc,1);
				if(!lstAddress.isEmpty()){
					Address address=lstAddress.get(0);
					int latitude=(int) (address.getLatitude()*1E6);
					int longitude=(int) (address.getLongitude()*1E6);
					return new GeoPoint(latitude,longitude);
				}
			} catch (IOException e) {
				e.printStackTrace();
			}
		}
		return null;
    }
    
    
    /**This function calculate the corresponding amount of pixels for the radius in meters.
     * Merely use metersToEquatorPixels() will not work. Google Maps uses a Mercator projection. 
     * This means that the further you get from the equator the more distorted the distances become.
     * I got this function from: http://stackoverflow.com/questions/2077054/how-to-compute-a-radius
     * -around-a-point-in-an-android-mapview*/
    public static int getPixelsFromMeters(float meters, MapView map, double latitude) {
        return (int) (map.getProjection().metersToEquatorPixels(meters) * 
        		(1/ Math.cos(Math.toRadians(latitude))));         
    }
    
    /** Required by MapActivity. Currently unused.*/
	@Override
	protected boolean isRouteDisplayed() {
		return false;
	}//isRouteDisplayed
	
	@Override
	public void onProviderDisabled(String provider) {
		// TODO Auto-generated method stub
	}

	@Override
	public void onProviderEnabled(String provider) {
		// TODO Auto-generated method stub
	}

	@Override
	public void onStatusChanged(String provider, int status, Bundle extras) {
		// TODO Auto-generated method stub
	}
    
    
    /** PointOverlay is an inner class for showing a location as a marker on the map.*/
    class PointOverlay extends Overlay{
    	/** The GeoPoint to be displayed.*/
    	private GeoPoint geoPoint;

    	public  PointOverlay(GeoPoint geoPoint){
    		this.geoPoint = geoPoint;
    	}

        @Override
        public void draw(Canvas canvas, MapView mapV, boolean shadow){
            if(shadow){
                Projection projection = mapV.getProjection();
                Point pt = new Point();
                projection.toPixels(geoPoint,pt);
                Paint paint = new Paint();
                Bitmap markerBitmap = BitmapFactory.decodeResource(
                		getApplicationContext().getResources(),R.drawable.marker);
                //change the coordinates of the marker to make sure the pin is located at the GeoPoint.
                canvas.drawBitmap(
                		markerBitmap,
                		pt.x-markerBitmap.getWidth()/2 ,
                		pt.y-markerBitmap.getHeight(),
                		paint);
            }
        }
    }   
    
    /** 
     * CircleOverlay is an inner class for drawing a circle on the map.
     * Its constructor receives two parameters, the first parameter 
     * is a GeoPoint indicating the center of the circle, the second
     * parameter is the radius of the circle.
     */
    class CircleOverlay extends Overlay{
    	
		/** The center GeoPoint of the circle.*/
    	private GeoPoint center;
    	/** The radius of the circle.*/
    	private float radius; 

    	public  CircleOverlay(GeoPoint center,float radius){
    		this.center = center;
    		this.radius = radius; //radius received should be in meters
    	}
    	
        @Override
        public void draw(Canvas canvas, MapView mapV, boolean shadow){
            if(shadow){
                Projection projection = mapV.getProjection();
                Point pt = new Point();
                projection.toPixels(center,pt);
                
                float radiusInPixels = getPixelsFromMeters(radius, mapV, 
                		center.getLatitudeE6()/1000000);
                Paint circlePaint = new Paint(Paint.ANTI_ALIAS_FLAG);
                //set color and style for the inner part of the circle
                int color = Color.argb(127,255,0,255); // set color to semitransparent purple
                circlePaint.setColor(color);
                circlePaint.setStyle(Style.FILL_AND_STROKE);
                canvas.drawCircle((float)pt.x, (float)pt.y, radiusInPixels, circlePaint);
                //set color and style for the border
                circlePaint.setColor(0x99000000);
                circlePaint.setStyle(Style.STROKE);
                canvas.drawCircle((float)pt.x, (float)pt.y, radiusInPixels, circlePaint);
            }
        }
    }
}//Map