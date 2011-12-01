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

import android.content.Context;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.graphics.Canvas;
import android.graphics.Color;
import android.graphics.Paint;
import android.graphics.Paint.Style;
import android.graphics.Point;
import android.location.Address;
import android.location.Geocoder;
import android.os.Bundle;
import android.util.Log;
import android.widget.Toast;

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
public class Map extends MapActivity {
	
	/** Contains the set of {@link Campaign Campaigns} currently displayed on 
	 * the map */
	protected ArrayList<Campaign> campaigns;	
	private List<Overlay> mapOverlays;
	/** Initialize the map */
    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.map);
        G.map = (MapView) findViewById(R.id.mapview);
        G.map.setBuiltInZoomControls(true);
        mapOverlays = G.map.getOverlays();
    }//onCreate
    
    @Override
    public void onResume() {
    	super.onResume();
    	
        //Currently, simply use a global variable.
        //Its value is set in CampaginBrowser by getCampaigns();
    	//FIXME remove the global variable and unpack the campaigns from intent.
        campaigns = G.globalCampaigns;
        
		PointOverlay pointOverlay = null;
		CircleOverlay circleOverlay = null;
		
		//When we open the map, clear the overlay first
		mapOverlays.clear();
		if (campaigns != null) {
			for (Campaign campaign : campaigns) {
				for (String loc : campaign.getLocations()) {
					GeoPoint point = getGeopoint(loc);
					if (point != null) {
						if (getLocType(loc) == Constants.EXACT_LOCATION) {
							pointOverlay = new PointOverlay(getGeopoint(loc));
							mapOverlays.add(pointOverlay);
						}
						circleOverlay = new CircleOverlay(getGeopoint(loc),
								getRadius(loc));
						mapOverlays.add(circleOverlay);
						G.map.getController().animateTo(getGeopoint(loc));
					} else {
						Toast.makeText(
								this,
								"Geocoder failed, can't show some campaigns, please try later.",
								Toast.LENGTH_LONG).show();
					}
				}
			}
			setZoomLevel();
		}
    }//onResume

    /** 
     * Required by MapActivity. Currently unused.
     */
	@Override
	protected boolean isRouteDisplayed() {
		return false;
	}//isRouteDisplayed
	
	/** 
	 * Get campaigns from the local database. 
	 * FIXME get campaigns should unpack the intent. 
	 */
	ArrayList<Campaign> getCampaigns() {
		ArrayList<Campaign> results = new ArrayList<Campaign>();
		for(String campaignID: G.user.getCampaignIDs()){
			results.add((Campaign) G.db.getCampaign(campaignID));
		}
		return results;
	}//getCampaigns
	
	/** 
	 * Set zoom level of the map according to the location's type.
	 * FIXME compute the zoom based on the set of campaigns displayed on the map
	 */
	public void setZoomLevel(){
		G.map.getController().setZoom(11);
	}//setZoomLevel
	
	/** Get locations of the campaign from database by searching the 
	 * campaign's id.*/
    public String[] getLocsByCampaignId(String id){
    	Campaign c = (Campaign) G.db.getCampaign(id);
    	return c.getLocations();
    }//getLocsByCampaignId
    
    /** 
     * Get the type of the location. {@link Constants#EXACT_LOCATION
     * EXACT_LOCATION} refers to an exact (longitude,latitude) point, whereas
     * {@link Constants#NONEXACT_LOCATION NONEXACT_LOCATION} refers to a 
     * (city, state) reference. 
     */
    public static boolean getLocType(String loc){ 
    	 Pattern pattern=Pattern.compile("\\d");  
         Matcher matcher=pattern.matcher(loc);
         if (matcher.find() == true) {
        	 return Constants.EXACT_LOCATION;
         }
         return Constants.NONEXACT_LOCATION;
    }//getLocType
    
    /** 
     * Get the radius of the circle centered at the given location. If the
     * given location is an {@link Constants#EXACT_LOCATION EXACT_LOCATION},
     * set the radius to 10 meters, otherwise, set the radius to 10000 meters. 
     * This function may be updated if we can get more geo information, such as
     * the size of cities.
     * TODO improve this based on database information. 
     */
    public static float getRadius(String loc){
    	if (getLocType(loc) == Constants.EXACT_LOCATION) {
    		return 10;
    	}else {
    		return 10000;
    	}
    }//getRadius
    
    /** 
     * Parse an address (as a String) and return a {@link GeoPoint GeoPoint} 
     * for that location.
     * @param loc the String parameter
     * @return the geopoint object, or null if {@link #getLocType(String) 
     * getLocType(loc)} is not {@link Constants#EXACT_LOCATION 
     * EXACT_LOCATION} or {@link Constants#NONEXACT_LOCATION NONEXACT_LOCATION}.
     */
    public GeoPoint getGeopoint(String loc){
		if (getLocType(loc) == Constants.EXACT_LOCATION) {
	    	loc = loc.replaceAll(" ", "");
	    	String[] long_lat = loc.split(",");
			int longitude = (int) (Integer.parseInt(long_lat[0]) * 1E6);
			int latitude = (int) (Integer.parseInt(long_lat[1]) * 1E6);
			return new GeoPoint(latitude, longitude);
		} else if (getLocType(loc) == Constants.NONEXACT_LOCATION){ 
			Geocoder  mygeoCoder = new Geocoder(this, Locale.getDefault());
			List<Address> lstAddress = null;
			try {
				// getFromLocationName() will return a list of Address which 
				// matches the location name(first parameter)
				lstAddress = mygeoCoder.getFromLocationName(loc, 1);
				if(lstAddress.isEmpty()) {
					Log.e("Map.getGeopoint", "Geocoder did not find any " +
							                 "addresses. Returning null.");
					return null;
				}
				else {
					Address address=lstAddress.get(0);
					int latitude = (int) (address.getLatitude() * 1E6);
					int longitude = (int) (address.getLongitude() * 1E6);
					return new GeoPoint(latitude,longitude);
				}
			} catch (IOException e) {
				Log.e("Map.getGeopoint", "Geocoder failed. Returning null");
				return null;
			}
		}
		else {
			Log.e("Map.getGeopoint", "Invalid Location type. Returning null");
			return null;
		}
    }//getGeopoint
    
    /**
     * This function calculate the corresponding amount of pixels for the 
     * radius in meters. Rarely does metersToEquatorPixels() work. Google Maps 
     * uses a "Mercator" projection. This means that the further you get from 
     * the equator, the more distorted the distances become.
     * @param meters The meters to convert
     * @param map The current MapView
     * @param latitude The latitude of the center point
     * @see <a href="http://stackoverflow.com/questions/2077054/how-to-compute-a-radius-around-a-point-in-an-android-mapview">
     How to compute a radius around a point in an Android MapView?</a>
     */
    public int getPixelsFromMeters(float meters, MapView map, double latitude) {
    	double m = (map.getProjection()
    			       .metersToEquatorPixels(meters) 
    			    * (1 / Math.cos(Math.toRadians(latitude)))); 
    	return (int) m;
    }//getPixelsFromMeters
    
    /** static function to be used for LocationService */
	public static GeoPoint getGeopoint(Context context, String loc) {
		if (getLocType(loc) == Constants.EXACT_LOCATION) {
			loc = loc.replaceAll(" ", "");
			String[] long_lat = loc.split(",");
			int longitude = (int) (Integer.parseInt(long_lat[0]) * 1E6);
			int latitude = (int) (Integer.parseInt(long_lat[1]) * 1E6);
			return new GeoPoint(latitude, longitude);
		} else if (getLocType(loc) == Constants.NONEXACT_LOCATION) {
			Geocoder mygeoCoder = new Geocoder(context, Locale.getDefault());
			List<Address> lstAddress = null;
			try {
				// getFromLocationName() will return a list of Address which
				// matches the location name(first parameter)
				lstAddress = mygeoCoder.getFromLocationName(loc, 1);
				if (lstAddress.isEmpty()) {
					Log.e("Map.getGeopoint", "Geocoder did not find any "
							+ "addresses. Returning null.");
					return null;
				} else {
					Address address = lstAddress.get(0);
					int latitude = (int) (address.getLatitude() * 1E6);
					int longitude = (int) (address.getLongitude() * 1E6);
					return new GeoPoint(latitude, longitude);
				}
			} catch (IOException e) {
				Log.e("Map.getGeopoint", "Geocoder failed. Returning null");
				return null;
			}
		} else {
			Log.e("Map.getGeopoint", "Invalid Location type. Returning null");
			return null;
		}
	}// getGeopoint
     
    /** PointOverlay is an inner class for showing a location as a marker on 
     * the map.*/
    class PointOverlay extends Overlay {
    	
    	/** The GeoPoint to be displayed.*/
    	private GeoPoint geoPoint;

    	/**
    	 * Constructs a new {@link #PointOverlay PointOverlay} Object and 
    	 * initializes the {@link #geoPoint geoPoint}.
    	 * @param geoPoint
    	 */
    	public PointOverlay(GeoPoint geoPoint){
    		this.geoPoint = geoPoint;
    	}//PointOverlay

        @Override
        public void draw(Canvas canvas, MapView mapV, boolean shadow){
            if (shadow) {
                Projection projection = mapV.getProjection();
                Point pt = new Point();
                projection.toPixels(geoPoint, pt);
                Paint paint = new Paint();
                Bitmap marker = BitmapFactory
                                     .decodeResource(getApplicationContext()
                                     .getResources(), R.drawable.marker);
                //center the bitmap so that it points to the center of pt
                canvas.drawBitmap(marker,
                		          pt.x - (marker.getWidth() / 2),
                		          pt.y - marker.getHeight(),
                		          paint); 
                marker.recycle();
            }
            //TODO else statement...
        }//draw
    }//PointOverlay
    
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
    	}//CircleOverlay
    	
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
                int color = Color.argb(127,255,0,255); //set color
                circlePaint.setColor(color);
                circlePaint.setStyle(Style.FILL_AND_STROKE);
                canvas.drawCircle((float) pt.x, 
                		          (float) pt.y, 
                		          radiusInPixels, 
                		          circlePaint);
                //set color and style for the border
                circlePaint.setColor(0x99000000);
                circlePaint.setStyle(Style.STROKE);
                canvas.drawCircle((float) pt.x, 
                		          (float) pt.y, 
                		          radiusInPixels, 
                		          circlePaint);
            }
        }//draw
    }//CircleOverlay
}//Map