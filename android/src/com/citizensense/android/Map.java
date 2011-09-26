/* Copyright (c) 2006-2011 Regents of the University of Minnesota.
   For licensing terms, see the file LICENSE.
 */

package com.citizensense.android;

import java.io.IOException;
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
import android.graphics.Point;
import android.graphics.Paint.Style;
import android.graphics.drawable.Drawable;
import android.location.Address;
import android.location.Geocoder;
import android.os.Bundle;
import android.util.Log;

import com.google.android.maps.GeoPoint;
import com.google.android.maps.MapActivity;
import com.google.android.maps.MapView;
import com.google.android.maps.Overlay;
import com.google.android.maps.OverlayItem;
import com.google.android.maps.Projection;

/**
 * Map activity
 * @author Phil Brown & Renji Yu
 */
public class Map extends MapActivity {
    	
    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.map);
        G.map = (MapView) findViewById(R.id.mapview);
        G.map.setBuiltInZoomControls(true);
        List<Overlay> mapOverlays = G.map.getOverlays();
        //TODO: get locs from database
		String[] locs = {"Minneapolis, MN","Saint Paul, MN","-93, 45"};
		GeoPoint p = getGeopoint("Minneapolis, MN");
		GeoPoint q = getGeopoint("Saint Paul, MN");
		GeoPoint r = getGeopoint("-93, 45");
		System.out.println(p.getLatitudeE6()+" "+p.getLongitudeE6());
	

		PointOverlay pointOverlay = null;
		CircleOverlay circleOverlay = null;
		for(String loc : locs){
			if(locType(loc)==1){
				pointOverlay = new PointOverlay(getGeopoint(loc));
				mapOverlays.add(pointOverlay);
				G.map.getController().animateTo(getGeopoint(loc));
			}
		    circleOverlay = new CircleOverlay(getGeopoint(loc),locType(loc));
	        mapOverlays.add(circleOverlay);
		}
        G.map.getController().setZoom(11);
    }
    class PointOverlay extends Overlay{
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
                Bitmap markerBitmap = BitmapFactory.decodeResource(getApplicationContext().getResources(),R.drawable.marker);
                canvas.drawBitmap(markerBitmap,pt.x-markerBitmap.getWidth()/2 ,pt.y-markerBitmap.getHeight(),paint);
            }
        }
    }   
    
    class CircleOverlay extends Overlay{
    	private GeoPoint center;
    	private int locType;

    	public  CircleOverlay(GeoPoint center,int locType){
    		this.center = center;
    		this.locType = locType;
    	}
    
        @Override
        public void draw(Canvas canvas, MapView mapV, boolean shadow){
            if(shadow){
                Projection projection = mapV.getProjection();
                Point pt = new Point();
                projection.toPixels(center,pt);
                
                float circleRadius = 0;
                if(locType ==1) //set circle to 10 meters
                	circleRadius = metersToRadius(10, mapV, center.getLatitudeE6()/1000000);
                else                        //set circle to 10000 meters
                	circleRadius = metersToRadius(10000, mapV, center.getLatitudeE6()/1000000);
                
                Paint circlePaint = new Paint(Paint.ANTI_ALIAS_FLAG);
                int color = Color.argb(127,255,0,255);
                circlePaint.setColor(color);
                circlePaint.setStyle(Style.FILL_AND_STROKE);
                canvas.drawCircle((float)pt.x, (float)pt.y, circleRadius, circlePaint);
                circlePaint.setColor(0x99000000);
                circlePaint.setStyle(Style.STROKE);
                canvas.drawCircle((float)pt.x, (float)pt.y, circleRadius, circlePaint);
            }
        }
    }
    /**
     * processOverlay() adds all the location items to the taskOverlay
     * it also draws circle for the location, different locations will 
     * have different circles
     */
//    public void processOverlay(MapView mapView,PointOverlay taskOverlay,String[] locs){
//    	for(String loc:locs){
//    		GeoPoint point = getGeopoint(loc);
//    		//GeoPoint point = new GeoPoint(45000000,-93000000);
//	        if(locType(loc)==1){
//	        	G.map.getController().animateTo(point); // set center of map to the gps location
//	        OverlayItem overlayItem = new OverlayItem(point, "title","content");   
//	        taskOverlay.addOverlayItem(overlayItem);
//	        //drawCircle();
//	        }
//    	}  	
//    	G.map.getController().setZoom(12);
//    }
    
    public int locType(String  loc){ //if it contains digit, it is type 1; otherwise, it's type 2
    	//TODO: implement the function
    	 Pattern pattern=Pattern.compile("\\d");  
         Matcher matcher=pattern.matcher(loc);
         if(matcher.find()==true)
        	 return 1;
         return 2;
    }
    
    public GeoPoint getGeopoint(String loc){
    	//TODO: complete the function
		if(locType(loc) == 1){// if it is a gps location (lat,long)
	    	loc = loc.replaceAll(" ", "");
	    	String[] long_lat = loc.split(",");
			int longitude = Integer.parseInt(long_lat[0])*1000000;
			int latitude = Integer.parseInt(long_lat[1])*1000000;
			return new GeoPoint(latitude,longitude);
		}else if(locType(loc)==2){ //if it is (city,state)
			Geocoder  mygeoCoder=new Geocoder(this,Locale.getDefault());
			List<Address> lstAddress = null;
			try {
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
    
    /**
     * This function calculate the corresponding amount of pixels for the radius in meters
     * Merely use metersToEquatorPixels() will not work. Google Maps uses a Mercator projection. 
     * This means that the further you get from the equator the more distorted the distances become.
     * I got this function from: 
     * http://stackoverflow.com/questions/2077054/how-to-compute-a-radius-around-a-point-in-an-android-mapview
     */
    // 
    public static int metersToRadius(float meters, MapView map, double latitude) {
        return (int) (map.getProjection().metersToEquatorPixels(meters) * (1/ Math.cos(Math.toRadians(latitude))));         
    }
    
	@Override
	protected boolean isRouteDisplayed() {
		// TODO Auto-generated method stub
		return false;
	}
}