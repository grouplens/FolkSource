/* Copyright (c) 2006-2011 Regents of the University of Minnesota.
   For licensing terms, see the file LICENSE.
 */

package com.citizensense.android;

import java.io.IOException;
import java.io.InputStream;

import org.xml.sax.SAXException;

import android.app.Activity;
import android.os.Bundle;
import android.util.Log;
import android.util.Xml;
import android.widget.Gallery;
import android.widget.TextView;

import com.citizensense.android.net.CampaignParser;
import com.citizensense.android.net.CampaignParserCallback;
import com.citizensense.android.util.CampaignGalleryAdapter;

/**
 * This is the activity that is shown in the main tab, inside the campaign
 * browser.
 * TODO remove this class!!!
 * @author Phil Brown
 */
public class Home extends Activity implements CampaignParserCallback {
	
	/** The XML parser used when a campaign is downloaded from the server.*/
	CampaignParser parser;
	
	/** The textview used in the view. This is a temporary view that is used
	 * to help debug and show that the database is working.*/
	TextView textview;
	
	/** Initiate the parser and populate the gallery. */
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.campaign_browser);
        
        parser = new CampaignParser(this, this);
        
        textview = (TextView) findViewById(R.id.inf);
        
        try {
			InputStream stream = getAssets().open("samples/campaign_1.xml");
			Xml.parse(stream, Xml.Encoding.UTF_8, parser);
			stream = getAssets().open("samples/campaign_2.xml");
			Xml.parse(stream, Xml.Encoding.UTF_8, parser);
		} catch (IOException e) {
			e.printStackTrace();
		} catch (SAXException e) {
			e.printStackTrace();
		}
        
        Gallery gallery = (Gallery) findViewById(R.id.gallery);
        gallery.setAdapter(new CampaignGalleryAdapter(this, null));
    }//onCreate

    /** This is called after the parser finishes. It inserts the new campaign
     * into the database (if it does not already exist there) and displays 
     * its info in the textview. */
	@Override
	public void handleNewCampaign(Campaign c) {
		//Add campaign to the database
		if (G.db.getCampaign(c.getId()) == null){
			G.db.addCampaign(c);
		}
		//unpack campaign and display
		String name = c.getName();
		String start = c.getStartDate().toString();
		String end = c.getEndDate().toString();
		//TODO unpack full campaign
		String more = "More Details available";
		Task t = c.getTask();
		String tname = t.name;
		String tdesc = t.instructions;
		
		Form f = t.getForm();
		Question[] q = f.getQuestions();
		Log.i("HOME", "NUMBER OF QUESTIONS: " + q.length);
		String qs = "";
		for (int i=0; i<q.length; i++ ) {
			Log.i("Questions", qs);
			qs += q[i].toString();
		}
		String locs = "";
		String[] locations = c.getLocations();
		for (int i=0; i<locations.length; i++) {
			locs += "\n" + locations[i];
		}
		
		textview.setText(name + "\n"
						 + start + "\n"
						 + end + "\n"
						 + more + "\n"
						 + locs + "\n"
						 + "task: " + tname + "\n"
						 + tdesc + "\n"
						 + "form: " + "\n"
						 + qs);
		
	}//handleNewCampaign
}//Home