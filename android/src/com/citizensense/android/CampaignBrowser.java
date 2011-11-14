/* Copyright (c) 2006-2011 Regents of the University of Minnesota.
   For licensing terms, see the file LICENSE.
 */

package com.citizensense.android;

import java.io.IOException;
import java.io.InputStream;
import java.util.ArrayList;

import org.xml.sax.SAXException;

import android.content.Context;
import android.content.Intent;
import android.os.Bundle;
import android.util.Xml;
import android.view.ContextMenu;
import android.view.ContextMenu.ContextMenuInfo;
import android.view.MenuInflater;
import android.view.MenuItem;
import android.view.View;

import com.citizensense.android.net.CampaignParser;
import com.citizensense.android.net.CampaignParserCallback;

/**
 * The campaign browser allows users to view active campaigns in an "app-store"
 * style browser.
 * @author Phil Brown
 */
public class CampaignBrowser extends CampaignExplorer implements CampaignParserCallback {

	/** The XML parser used when a campaign is downloaded from the server. */
	CampaignParser parser;
	
	/** The campaigns retrieved from the server */
	ArrayList<Campaign> server_campaigns;
	
	@Override
	public void onCreate(Bundle savedInstanceState) {
		server_campaigns = new ArrayList<Campaign>();
		parser = new CampaignParser(this, this);
		super.onCreate(savedInstanceState);

	}// onCreate

	@Override
	public ArrayList<Campaign> getCampaigns() {
		// FIXME retrieve campaigns from the gallery
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
		return server_campaigns;
	}// getCampaigns

	@Override
	public void onCreateContextMenu(ContextMenu menu, View v,
			ContextMenuInfo menuInfo) {
		super.onCreateContextMenu(menu, v, menuInfo);
		MenuInflater inflater = getMenuInflater();
		menu.setHeaderTitle((campaigns.get(this.current_gallery_position))
				.getName());
		inflater.inflate(R.menu.campaign_browser_context_menu, menu);
	}// onCreateContextMenu

	@Override
	public boolean onContextItemSelected(MenuItem item) {
		switch (item.getItemId()) {
		/* Add the campaign to the local database */
		case R.id.download:{
			G.db.addCampaign(campaigns.get(this.current_gallery_position));
			G.resetLocationService();
		}
			return true;
		}
		return super.onContextItemSelected(item);
	}// onContextItemSelected

	@Override
	public void handleNewCampaign(Campaign c) {
		if (!server_campaigns.contains(c)) {
			server_campaigns.add(c);
		}
	}// handleNewCampaign

	/**
	 * In order to avoid the campaign browser to add multiples, this line is
	 * needed on onResume.
	 */
	@Override
	public void onResume() {
		this.server_campaigns = new ArrayList<Campaign>();
		super.onResume();
	}// onResume

}// CampaignBrowser
