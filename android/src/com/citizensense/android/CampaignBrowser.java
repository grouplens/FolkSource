/* Copyright (c) 2006-2011 Regents of the University of Minnesota.
   For licensing terms, see the file LICENSE.
 */

package com.citizensense.android;

import java.util.ArrayList;

import org.xml.sax.SAXException;

import android.os.Bundle;
import android.util.Log;
import android.util.Xml;
import android.view.ContextMenu;
import android.view.ContextMenu.ContextMenuInfo;
import android.view.MenuInflater;
import android.view.MenuItem;
import android.view.View;

import com.citizensense.android.net.GetRequest;
import com.citizensense.android.net.XMLResponseHandler;
import com.citizensense.android.parsers.CampaignListParser;
import com.citizensense.android.parsers.LegacyCampaignParser;

/**
 * The campaign browser allows users to view active campaigns in an "app-store"
 * style browser.
 * @author Phil Brown
 */
public class CampaignBrowser extends CampaignExplorer 
                             implements LegacyCampaignParser.CampaignParserCallback {

	/** The XML parser used when a campaign is downloaded from the server.*/
	LegacyCampaignParser parser;
	
	/** The campaigns retrieved from the server */
	ArrayList<Campaign> server_campaigns;
	
	@Override
	public void onCreate(Bundle savedInstanceState) {
		server_campaigns = new ArrayList<Campaign>();
		parser = new LegacyCampaignParser(this, this);
		super.onCreate(savedInstanceState);
	}//onCreate
	
	@Override
	public ArrayList<Campaign> getCampaigns() {
		
		// FIXME retrieve campaigns from the gallery. 
		 // The following code should do it:
		XMLResponseHandler handler = new XMLResponseHandler();
		handler.setCallback(new XMLResponseHandler.StringCallback() {
			
			@Override
			public void invoke(String xml) {
				try {
					Xml.parse(xml, new CampaignListParser(new CampaignListParser.Callback() {

						@Override
						public void invoke(ArrayList<Campaign> campaigns) {
							Log.i("CampaignBrowser", "Retrieved " 
									       + campaigns.size() + " campaigns.");
							//TODO remove this line.
							G.globalCampaigns = campaigns;
							for (Campaign c : campaigns) {
								handleNewCampaign(c);
							}
							CampaignBrowser.this.setCampaigns(campaigns);
						}
						
					}));
				} catch (SAXException e) {
					e.printStackTrace();
				}
			}
		});
		new GetRequest(this, Campaign.class, null, handler, true).execute();
		/*
		try {
			InputStream stream = getAssets().open("samples/campaign_1.xml");
			Xml.parse(stream, Xml.Encoding.UTF_8, parser);
			stream = getAssets().open("samples/campaign_2.xml");
			Xml.parse(stream, Xml.Encoding.UTF_8, parser);
			
			//The below will also parse the campaigns in campaign_3.xml using the new format.
			stream = getAssets().open("samples/campaign_3.xml");
			Xml.parse(stream, Xml.Encoding.UTF_8, new CampaignListParser(new CampaignListParser.Callback() {
				
				@Override
				public void invoke(ArrayList<Campaign> campaigns) {
					Toast.makeText(CampaignBrowser.this, "SUCCESS", Toast.LENGTH_SHORT).show();
					for (Campaign c : campaigns) {
						handleNewCampaign(c);
					}
				}
			}));
			
		} catch (IOException e) {
			e.printStackTrace();
		} catch (SAXException e) {
			e.printStackTrace();
		}
		*/
		return server_campaigns;
	}//getCampaigns

	@Override
	public void onCreateContextMenu(ContextMenu menu, View v,
			ContextMenuInfo menuInfo) {
		super.onCreateContextMenu(menu, v, menuInfo);
		MenuInflater inflater = getMenuInflater();
		menu.setHeaderTitle((campaigns.get(this.current_gallery_position)).getName());
		inflater.inflate(R.menu.campaign_browser_context_menu, menu);
	}//onCreateContextMenu

	@Override
	public boolean onContextItemSelected(MenuItem item) {
		switch (item.getItemId()) {
		/* Add the campaign to the local database*/
		case R.id.download:
			G.db.addCampaign(campaigns.get(this.current_gallery_position));
			return true;
		}
		return super.onContextItemSelected(item);
	}//onContextItemSelected

	@Override
	public void handleNewCampaign(Campaign c) {
		if (!server_campaigns.contains(c)) {
			server_campaigns.add(c);
		}
	}//handleNewCampaign
	
	/** In order to avoid the campaign browser to add multiples, this
	 * line is needed on onResume.*/
	@Override
	public void onResume() {
		this.server_campaigns = new ArrayList<Campaign>();
		super.onResume();
	}//onResume
	
}//CampaignBrowser
