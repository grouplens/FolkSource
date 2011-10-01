package com.citizensense.android;

import java.io.IOException;
import java.io.InputStream;

import org.xml.sax.SAXException;

import android.app.Activity;
import android.os.Bundle;
import android.util.Log;
import android.util.Xml;
import android.widget.TextView;

import com.citizensense.android.Campaign.Task;
import com.citizensense.android.Campaign.Task.Form;
import com.citizensense.android.net.CampaignParser;
import com.citizensense.android.net.CampaignParserCallback;

public class Home extends Activity implements CampaignParserCallback {
	CampaignParser parser;
	TextView textview;
	//Remove this object later:
		//static Campaign c;
	
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        
        parser = new CampaignParser(this, this);
        
        textview = new TextView(this);
        
        try {
			InputStream stream = getAssets().open("samples/campaign_1.xml");
			Xml.parse(stream, Xml.Encoding.UTF_8, parser);
		} catch (IOException e) {
			e.printStackTrace();
		} catch (SAXException e) {
			e.printStackTrace();
		}
        
        setContentView(textview);
    }

    @Override
	public void handleNewCampaign(Campaign c) {
		//Add campaign to the database
		G.db.addCampaign(c);
		//unpack campaign and display
		String name = c.getName();
		String start = c.getStartDate().toString();
		String end = c.getEndDate().toString();
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
		
		textview.setText(name + "\n"
						 + start + "\n"
						 + end + "\n"
						 + more + "\n"
						 + "task: " + tname + "\n"
						 + tdesc + "\n"
						 + "form: " + "\n"
						 + qs);
		
	}
}