/* Copyright (c) 2006-2011 Regents of the University of Minnesota.
   For licensing terms, see the file LICENSE.
 */

package com.citizensense.android;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Locale;
import java.util.concurrent.ExecutionException;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import org.apache.http.HttpResponse;
import org.xml.sax.SAXException;

import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences.Editor;
import android.content.res.Configuration;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.graphics.Canvas;
import android.graphics.Color;
import android.graphics.Paint;
import android.graphics.Paint.Style;
import android.graphics.Point;
import android.graphics.PointF;
import android.location.Address;
import android.location.Geocoder;
import android.location.Location;
import android.net.Uri;
import android.os.AsyncTask;
import android.os.AsyncTask.Status;
import android.os.Bundle;
import android.util.Log;
import android.util.Xml;
import android.view.Menu;
import android.view.MenuItem;
import android.view.View;
import android.view.Window;
import android.view.MotionEvent;
import android.widget.Toast;

import com.citizensense.android.conf.Constants;
import com.citizensense.android.net.GetRequest;
import com.citizensense.android.net.XMLResponseHandler;
import com.citizensense.android.parsers.SubmissionParser;
import com.citizensense.android.util.ActivityHeader;
import com.google.android.maps.GeoPoint;
import com.google.android.maps.MapActivity;
import com.google.android.maps.MapView;
import com.google.android.maps.MyLocationOverlay;
import com.google.android.maps.Overlay;
import com.google.android.maps.Projection;

/**
 * Map activity
 * 
 * @author Phil Brown
 * @author Renji Yu
 */
public class Map extends MapActivity {

	/**
	 * Contains the {@link Campaign Campaign} currently displayed on the map
	 */
	protected Campaign campaign;

	private List<Overlay> mapOverlays;

	/** Overlay for the user's location */
	private MyLocationOverlay myLocation;

	/** GeoPoint for the user's location */
	private GeoPoint myPoint;

	/**
	 * Submissions for the current campaign.
	 */
	private ArrayList<Submission> submissions;
	private boolean findOrientation;

	/** Boolean value whether to zoom to span */
	// I feel it is more user friendly that we only call zoomToSpan once
	private boolean zoomToSpan;

	/** Reference to the header view */
	private View headerView;
	/** Designed to update the header view */
	private ActivityHeader header;

	/** Initialize the map */
	@Override
	public void onCreate(Bundle savedInstanceState) {
		super.onCreate(savedInstanceState);
		requestWindowFeature(Window.FEATURE_NO_TITLE);
		setContentView(R.layout.map);

		headerView = findViewById(R.id.header);
		header = new ActivityHeader(headerView);

		G.map = (MapView) findViewById(R.id.mapview);
		G.map.setBuiltInZoomControls(true);
		mapOverlays = G.map.getOverlays();
		zoomToSpan = true;
		handleIntent();
	}// onCreate

	/** Get campaign object from intent */
	public void handleIntent() {
		campaign = getIntent().getParcelableExtra("campaign");
	}

	/** Update submissions and then update the UI */
	public void updateSubmissions() {
		XMLResponseHandler handl = new XMLResponseHandler();
		handl.setCallback(new XMLResponseHandler.StringCallback() {
			@Override
			public void invoke(String xml) {
				try {
					Xml.parse(xml, new SubmissionParser(
							new SubmissionParser.Callback() {
								@Override
								public void invoke(
										ArrayList<Submission> submissions) {
									G.globalSubmissions = submissions;
									Map.this.submissions = Submission
											.getSubmissionsByCampaign(campaign);
									drawOverlays();
								}
							}));
				} catch (SAXException e) {
					e.printStackTrace();
				}
			}
		});
		Submission.getAllSubmissions(this, handl);
	}

	@Override
	public void onResume() {
		super.onResume();

		header.updateHeader();

		// setup MyLocationOverlay
		// TODO
		myLocation = new PointableLocationOverlay(this, G.map, 15);
		myLocation.enableMyLocation();
		myLocation.enableCompass();
		myPoint = myLocation.getMyLocation();
		updateSubmissions();
		Toast.makeText(this,
				"Tap on the location that you want to make a submission from.",
				Toast.LENGTH_LONG).show();
	}// onResume

	private void drawOverlays() {
		PointOverlay pointOverlay;
		CircleOverlay circleOverlay;
		int lowLat = Integer.MAX_VALUE;
		int highLat = Integer.MIN_VALUE;
		int lowLong = Integer.MAX_VALUE;
		int highLong = Integer.MIN_VALUE;
		int overlay;

		// When we open the map, clear the overlay first
		mapOverlays.clear();
		mapOverlays.add(myLocation);

		for (String loc : campaign.getLocations()) {
			overlay = Constants.NO_SUBMISSION;
			if (getLocType(loc) == Constants.NONEXACT_LOCATION) 
				continue;
			String[] locCoords = loc.split("\\,");
			Log.d("Locations", "locCoords:"+loc);
			
			// match submission with campaign
			for (Submission sub : submissions) {
				String[] subCoords = sub.getCoords();
				double lon = Double.parseDouble(locCoords[0]);
				double lat = Double.parseDouble(locCoords[1]);
				// if (subCoords[0].equals(locCoords[0])&&
				// subCoords[1].equals(locCoords[1])) {
				if (lon == Double.parseDouble(subCoords[0])
						&& lat == Double.parseDouble(subCoords[1])) {
					if (G.user.id == sub.getUser_id()) {
						overlay = Constants.I_MADE_SUBMISSION;
					} else {
						overlay = Constants.OTHERS_MADE_SUBMISSION;
					}
				}
			}

			GeoPoint point = getGeopoint(loc);
			if (point == null) {
				Toast.makeText(
						this,
						"Geocoder failed, can't show some campaigns, please try later.",
						Toast.LENGTH_LONG).show();
				continue;
			}
			if (getLocType(loc) == Constants.EXACT_LOCATION) {
				pointOverlay = new PointOverlay(point, campaign, overlay);
				mapOverlays.add(pointOverlay);
			}
			circleOverlay = new CircleOverlay(point, getRadius(loc), campaign);
			mapOverlays.add(circleOverlay);

			if (zoomToSpan == false)
				continue;
			if (point.getLatitudeE6() < lowLat)
				lowLat = point.getLatitudeE6();
			if (point.getLatitudeE6() > highLat)
				highLat = point.getLatitudeE6();
			if (point.getLongitudeE6() < lowLong)
				lowLong = point.getLongitudeE6();
			if (point.getLongitudeE6() > highLong)
				highLong = point.getLongitudeE6();
		}
		if (zoomToSpan) {
			G.map.getController().zoomToSpan(Math.abs(highLong - lowLong),
					Math.abs(highLat - lowLat));
			zoomToSpan = false;
		}

		if (this.findOrientation) {
			Intent streetView = new Intent(android.content.Intent.ACTION_VIEW,
					Uri.parse("google.streetview:cbll="
							+ myLocation.getMyLocation().getLatitudeE6() + ","
							+ myLocation.getMyLocation().getLongitudeE6()
							+ "&cbp=" + myLocation.getOrientation()
							+ ",99.56,,1,-5.27&mz=21"));
			Log.d("MAP", "streetview");
			startActivity(streetView);
		}
	}

	protected void setSubmissions(ArrayList<Submission> submissions) {
		this.submissions = submissions;

	}

	/**
	 * Required by MapActivity. Currently unused.
	 */
	@Override
	protected boolean isRouteDisplayed() {
		return false;
	}// isRouteDisplayed

	/**
	 * Get campaigns from the local database. FIXME get campaigns should unpack
	 * the intent.
	 */
	ArrayList<Campaign> getCampaigns() {
		ArrayList<Campaign> results = new ArrayList<Campaign>();
		for (String campaignID : G.user.getCampaignIDs()) {
			results.add((Campaign) G.db.getCampaign(campaignID));
		}
		return results;
	}// getCampaigns

	/**
	 * Get locations of the campaign from database by searching the campaign's
	 * id.
	 */
	public String[] getLocsByCampaignId(String id) {
		Campaign c = (Campaign) G.db.getCampaign(id);
		return c.getLocations();
	}// getLocsByCampaignId

	/**
	 * Get the type of the location. {@link Constants#EXACT_LOCATION
	 * EXACT_LOCATION} refers to an exact (longitude,latitude) point, whereas
	 * {@link Constants#NONEXACT_LOCATION NONEXACT_LOCATION} refers to a (city,
	 * state) reference.
	 */
	public static boolean getLocType(String loc) {
		Pattern pattern = Pattern.compile("\\d");
		Matcher matcher = pattern.matcher(loc);
		if (matcher.find() == true) {
			return Constants.EXACT_LOCATION;
		}
		return Constants.NONEXACT_LOCATION;
	}// getLocType

	/**
	 * Get the radius of the circle centered at the given location. If the given
	 * location is an {@link Constants#EXACT_LOCATION EXACT_LOCATION}, set the
	 * radius to 10 meters, otherwise, set the radius to 10000 meters. This
	 * function may be updated if we can get more geo information, such as the
	 * size of cities. TODO improve this based on database information.
	 */
	public static float getRadius(String loc) {
		if (getLocType(loc) == Constants.EXACT_LOCATION) {
			return 10;
		} else {
			return 10000;
		}
	}// getRadius

	/**
	 * Parse an address (as a String) and return a {@link GeoPoint GeoPoint} for
	 * that location.
	 * 
	 * @param loc
	 *            the String parameter
	 * @return the geopoint object, or null if {@link #getLocType(String)
	 *         getLocType(loc)} is not {@link Constants#EXACT_LOCATION
	 *         EXACT_LOCATION} or {@link Constants#NONEXACT_LOCATION
	 *         NONEXACT_LOCATION}.
	 */
	public GeoPoint getGeopoint(String loc) {
		if (getLocType(loc) == Constants.EXACT_LOCATION) {
			loc = loc.replaceAll(" ", "");
			String[] long_lat = loc.split(",");
			int longitude = (int) (Double.parseDouble(long_lat[0]) * 1E6);
			int latitude = (int) (Double.parseDouble(long_lat[1]) * 1E6);
			return new GeoPoint(latitude, longitude);
		} else if (getLocType(loc) == Constants.NONEXACT_LOCATION) {
			Geocoder mygeoCoder = new Geocoder(this, Locale.getDefault());
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

	/**
	 * This function calculate the corresponding amount of pixels for the radius
	 * in meters. Rarely does metersToEquatorPixels() work. Google Maps uses a
	 * "Mercator" projection. This means that the further you get from the
	 * equator, the more distorted the distances become.
	 * 
	 * @param meters
	 *            The meters to convert
	 * @param map
	 *            The current MapView
	 * @param latitude
	 *            The latitude of the center point
	 * @see <a
	 *      href="http://stackoverflow.com/questions/2077054/how-to-compute-a-radius-around-a-point-in-an-android-mapview">
	 *      How to compute a radius around a point in an Android MapView?</a>
	 */
	public int getPixelsFromMeters(float meters, MapView map, double latitude) {
		double m = (map.getProjection().metersToEquatorPixels(meters) * (1 / Math
				.cos(Math.toRadians(latitude))));
		return (int) m;
	}// getPixelsFromMeters

	/** static function to be used for LocationService */
	public static GeoPoint getGeopoint(Context context, String loc) {
		if (getLocType(loc) == Constants.EXACT_LOCATION) {
			loc = loc.replaceAll(" ", "");
			String[] long_lat = loc.split(",");
			int longitude = (int) (Double.parseDouble(long_lat[0]) * 1E6);
			int latitude = (int) (Double.parseDouble(long_lat[1]) * 1E6);
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

	/**
	 * PointOverlay is an inner class for showing a location as a marker on the
	 * map.
	 */
	class PointOverlay extends Overlay {

		/** The GeoPoint to be displayed. */
		private GeoPoint geoPoint;
		/** The campaign associated with the point */
		private Campaign campaign;
		private int overlay;

		/**
		 * Constructs a new {@link #PointOverlay PointOverlay} Object and
		 * initializes the {@link #geoPoint geoPoint}.
		 * 
		 * @param geoPoint
		 * @param overlay
		 */
		public PointOverlay(GeoPoint geoPoint, Campaign campaign, int overlay) {
			this.geoPoint = geoPoint;
			this.campaign = campaign;
			this.overlay = overlay;
		}// PointOverlay

		@Override
		public void draw(Canvas canvas, MapView mapV, boolean shadow) {
			if (shadow) {
				Projection projection = mapV.getProjection();
				Point pt = new Point();
				projection.toPixels(geoPoint, pt);
				Paint paint = new Paint();
				int markerVal = R.drawable.marker;
				if (this.overlay == Constants.I_MADE_SUBMISSION)
					markerVal = R.drawable.gmarker;
				else if (this.overlay == Constants.OTHERS_MADE_SUBMISSION)
					markerVal = R.drawable.bmarker;
				Bitmap marker = BitmapFactory.decodeResource(
						getApplicationContext().getResources(), markerVal);
				// center the bitmap so that it points to the center of pt
				canvas.drawBitmap(marker, pt.x - (marker.getWidth() / 2), pt.y
						- marker.getHeight(), paint);
				marker.recycle();
			}
			// TODO else statement...
		}// draw

		@Override
		public boolean onTap(GeoPoint p, MapView view) {
			Point tapPt = new Point();
			Point markerPt = new Point();
			Point locPt = new Point();
			boolean inside = false;

			view.getProjection().toPixels(p, tapPt);
			view.getProjection().toPixels(this.geoPoint, markerPt);
			if (myPoint != null) {
				view.getProjection().toPixels(myPoint, locPt);
				System.out
						.println("current location available---------------!!");
			}
			Bitmap marker = BitmapFactory.decodeResource(
					getApplicationContext().getResources(), R.drawable.marker);

			if (locPt.x >= (markerPt.x - marker.getWidth() / 2)
					&& locPt.x <= (markerPt.x + marker.getWidth() / 2))
				if (locPt.y >= (markerPt.y - marker.getHeight())
						&& locPt.y <= (markerPt.y))
					inside = true;

			if (tapPt.x >= (markerPt.x - marker.getWidth() / 2)
					&& tapPt.x <= (markerPt.x + marker.getWidth() / 2))
				if (tapPt.y >= (markerPt.y - marker.getHeight())
						&& tapPt.y <= (markerPt.y)) {
					Intent i = new Intent(view.getContext(),
							SubmissionHistory.class);
					i.putExtra("campaign", campaign);
					int[] taskLocation = { geoPoint.getLatitudeE6(),
							geoPoint.getLongitudeE6() };
					i.putExtra("taskLocation", taskLocation);
					// make sure the order is correct ??
					if (myPoint != null) {
						int[] myLocation = { myPoint.getLatitudeE6(),
								myPoint.getLongitudeE6() };
						i.putExtra("myLocation", myLocation);
					}
					i.putExtra("inside", inside);
					view.getContext().startActivity(i);
					return true;
				}

			return false;
		}

	}// PointOverlay

	/**
	 * CircleOverlay is an inner class for drawing a circle on the map. Its
	 * constructor receives two parameters, the first parameter is a GeoPoint
	 * indicating the center of the circle, the second parameter is the radius
	 * of the circle.
	 */
	class CircleOverlay extends Overlay {

		/** The center GeoPoint of the circle. */
		private GeoPoint center;
		/** The radius of the circle. */
		private float radius;
		private Campaign campaign;
		private float farLeft;
		private float farRight;

		public CircleOverlay(GeoPoint center, float radius, Campaign campaign) {
			this.center = center;
			this.radius = radius; // radius received should be in meters
			this.campaign = campaign;
		}// CircleOverlay

		@Override
		public void draw(Canvas canvas, MapView mapV, boolean shadow) {
			if (shadow) {
				Projection projection = mapV.getProjection();
				Point pt = new Point();
				projection.toPixels(center, pt);

				float radiusInPixels = getPixelsFromMeters(radius, mapV,
						center.getLatitudeE6() / 1000000);
				this.farLeft = pt.x - radiusInPixels;
				this.farRight = pt.x + radiusInPixels;

				// Log.d("WIDTH", "set: "+this.farLeft + ":" + this.farRight);
				Paint circlePaint = new Paint(Paint.ANTI_ALIAS_FLAG);
				// set color and style for the inner part of the circle
				int color = Color.argb(127, 255, 0, 255); // set color
				circlePaint.setColor(color);
				circlePaint.setStyle(Style.STROKE);
				circlePaint.setStrokeWidth(7);
				canvas.drawCircle((float) pt.x, (float) pt.y, radiusInPixels,
						circlePaint);
				// set color and style for the border
				// circlePaint.setColor(0x99000000);
				// circlePaint.setStyle(Style.STROKE);
				// canvas.drawCircle((float) pt.x, (float) pt.y, radiusInPixels,
				// circlePaint);
			}
		}// draw

		@Override
		public boolean onTap(GeoPoint p, MapView view) {
			/*
			 * Point tapPt = new Point(); Point cPt = new Point(); Point locPt =
			 * new Point(); boolean inside = false;
			 * view.getProjection().toPixels(p, tapPt);
			 * view.getProjection().toPixels(center, cPt); if (myPoint != null)
			 * view.getProjection().toPixels(myPoint, locPt); float
			 * radiusInPixels = getPixelsFromMeters(radius, view,
			 * center.getLatitudeE6() / 1000000);
			 * 
			 * if (locPt.x >= (this.farLeft) && locPt.x <= (this.farRight)) if
			 * (locPt.y >= (cPt.y - radiusInPixels) && locPt.y <= (cPt.y +
			 * radiusInPixels)) inside = true;
			 * 
			 * if (tapPt.x >= (this.farLeft) && tapPt.x <= (this.farRight)) if
			 * (tapPt.y >= (cPt.y - radiusInPixels) && tapPt.y <= (cPt.y +
			 * radiusInPixels)) { Intent i = new Intent(view.getContext(),
			 * SubmissionHistory.class); i.putExtra("campaign", campaign); int[]
			 * taskLocation = { center.getLatitudeE6(), center.getLongitudeE6()
			 * }; i.putExtra("taskLocation", taskLocation);
			 * 
			 * if (myPoint != null) { int[] myLocation = {
			 * myPoint.getLatitudeE6(), myPoint.getLongitudeE6() };
			 * i.putExtra("myLocation", myLocation); } i.putExtra("inside",
			 * inside); view.getContext().startActivity(i); return true; }
			 */
			return false;
		}
	}// CircleOverlay

	class PointableLocationOverlay extends MyLocationOverlay {

		/** The center GeoPoint of the circle. */
		private GeoPoint myLocation;
		/** The radius of the circle. */
		private float radius;
		private boolean activated;
		private int color;
		private PointF touchPoint;
		private int tapCount;
		private PointF oldTp;
		private int zoomCount;
		private Point LocCenterPt;
		private int circSize;
		private float bearing;
		private PointF lockPt;

		public PointableLocationOverlay(Context context, MapView mapView,
				int radius) {
			super(context, mapView);
			this.color = Color.argb(255, 128, 128, 128);
			this.radius = radius;
			// TODO Auto-generated constructor stub
		}

		@Override
		protected void drawMyLocation(Canvas canvas, MapView mapV,
				Location lastFix, GeoPoint myLocation, long when) {
			this.myLocation = myLocation;
			Projection projection = mapV.getProjection();
			LocCenterPt = new Point();
			projection.toPixels(myLocation, LocCenterPt);

			float radiusInPixels = getPixelsFromMeters(radius, mapV,
					myLocation.getLatitudeE6() / 1000000);

			this.circSize = (int) radiusInPixels + 10;

			// set activated color
			if (this.activated)
				this.color = Color.argb(100, 0, 0, 255);

			// draw GPS point
			makeACircle(canvas, Style.STROKE, LocCenterPt, this.circSize);

			// set the bearing if it's not user-defined
			if (touchPoint == null && oldTp == null && lockPt == null)
				this.bearing = this.getOrientation();
			else if (this.activated)
				this.bearing = getAngleToPoint(oldTp);
			else
				this.bearing = getAngleToPoint(lockPt);

			// draw bearing point
			PointF p = getCirclePoint(this.bearing, this.circSize);
			makeACircle(canvas, Style.FILL_AND_STROKE, p, this.circSize / 4);
		}// draw

		private PointF getCirclePoint(float bearing, int rad) {
			double x = LocCenterPt.x + rad * Math.cos(bearing);
			double y = LocCenterPt.y + rad * Math.sin(bearing);
			PointF p = new PointF(new Float(x), new Float(y));
			return p;
		}

		private float getAngleToPoint(PointF pt) {
			return new Float(Math.atan2((pt.y) - LocCenterPt.y, pt.x
					- (LocCenterPt.x + radius)));
		}

		// **************** REFACTOR THIS TO MAP ******************
		private void makeACircle(Canvas canvas, Style style, PointF pt,
				float radPix) {
			Paint circlePaint = new Paint(Paint.ANTI_ALIAS_FLAG);
			circlePaint.setColor(color);
			circlePaint.setStyle(style);
			circlePaint.setStrokeWidth(10);
			canvas.drawCircle(pt.x, pt.y, radPix, circlePaint);
		}

		private void makeACircle(Canvas canvas, Style style, Point pt,
				float radPix) {
			Paint circlePaint = new Paint(Paint.ANTI_ALIAS_FLAG);
			circlePaint.setColor(color);
			circlePaint.setStyle(style);
			circlePaint.setStrokeWidth(5);
			canvas.drawCircle(pt.x, pt.y, radPix, circlePaint);
		}

		// *******************************************************

		public boolean locTapped(MotionEvent e, Point p) {
			if (e.getX() <= (p.x + (this.circSize))
					&& e.getX() >= (p.x - (this.circSize))) {
				if (e.getY() <= (p.y + (this.circSize))
						&& e.getY() >= (p.y - (this.circSize))) {
					return true;
				}
			}
			return false;
		}

		@Override
		public boolean onTouchEvent(MotionEvent e, MapView mapView) {
			if (this.getMyLocation() != null) {
				Projection projection = mapView.getProjection();
				Point p = new Point();
				if (this.myLocation == null)
					return false;
				projection.toPixels(myLocation, p);

				if (locTapped(e, p) || this.activated) {
					if (e.getAction() == MotionEvent.ACTION_UP) {
						if (this.tapCount == 2) {
							this.tapCount = 0;
							this.activated = !this.activated;
							if (!this.activated)
								this.lockPt = oldTp;
						} else
							this.tapCount++;

					} else if (e.getAction() == MotionEvent.ACTION_MOVE) {
						if (this.activated) {
							this.touchPoint = new PointF(e.getX(), e.getY());
							oldTp = touchPoint;

						}
					}

					if (this.activated) {// we're turning
						this.color = Color.argb(100, 0, 0, 255);
						while (mapView.getController().zoomInFixing(p.x, p.y))
							zoomCount++;
					} else {
						this.color = Color.argb(255, 128, 128, 128);
						// this.touchPoint = null;
						while (zoomCount != 0
								&& mapView.getController().zoomOut())
							zoomCount--;
					}
					return true;
				}
			}
			return false;
			// return super.onTouchEvent(e, mapView);
		}
	}// CircleOverlay

	/* Create menu. */
	public boolean onCreateOptionsMenu(Menu menu) {
		// FIXME: add more options later
		menu.add(0, 0, 0, "Switch User");
		menu.add(0, 1, 1, "Logout");
		return true;
	}

	/* Handle menu options. */
	public boolean onOptionsItemSelected(MenuItem item) {
		int item_id = item.getItemId();

		switch (item_id) {
		case 0: // Switch User
			String username = G.memory.getString("username", "");
			if (!username.equals("")) { // remove the current user's data
				Editor e = G.memory.edit();
				e.remove("username");
				e.remove("password");
				e.remove("cookie");
				e.commit();
			}
			Intent intent = new Intent(this, Login.class);
			intent.setFlags(Intent.FLAG_ACTIVITY_CLEAR_TOP);
			startActivity(intent);
			break;
		case 1: // Logout, Quit the app.
			System.exit(0);
			break;
		}
		return true;
	}

	@Override
	// This is called when the user rotate the screen
	public void onConfigurationChanged(Configuration newConfig) {
		super.onConfigurationChanged(newConfig);
	}

}// Map