/* Copyright (c) 2006-2011 Regents of the University of Minnesota.
   For licensing terms, see the file LICENSE.
 */

package com.citizensense.android;

import java.io.IOException;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.Collections;

import org.xml.sax.SAXException;

import android.os.Bundle;
import android.util.Log;
import android.util.Xml;
import android.view.MenuItem;

import com.citizensense.android.conf.Constants;
import com.citizensense.android.net.GetRequest;
import com.citizensense.android.net.XMLResponseHandler;
import com.citizensense.android.parsers.CampaignListParser;
import com.citizensense.android.parsers.LegacyCampaignParser;
import com.citizensense.android.parsers.TaskParser;

/**
 * The campaign browser allows users to view active campaigns in an "app-store"
 * style browser.
 * 
 * @author Phil Brown
 */
public class CampaignBrowser extends CampaignExplorer {

//	/** The campaigns retrieved from the server */
//	public ArrayList<Campaign> this.campaigns;

	/**
	 * Referenced in {@link #onContextItemSelected(MenuItem)} to know which item
	 * was clicked.
	 */
	private boolean list_clicked;

	@Override
	public void onCreate(Bundle savedInstanceState) {
		this.campaigns = new ArrayList<Campaign>();
		super.onCreate(savedInstanceState);
	}// onCreate

	@Override
	public ArrayList<Campaign> getCampaigns() {

		// FIXME retrieve campaigns from the gallery.
		// The following code should do it:
		if (Constants.localCampaignsOnly) {
			try {
				InputStream stream = getAssets().open("samples/campaign_1.xml");
				Xml.parse(stream, Xml.Encoding.UTF_8, new LegacyCampaignParser(
						this,
						new LegacyCampaignParser.CampaignParserCallback() {

							@Override
							public void handleNewCampaign(Campaign c) {
								if (!campaigns.contains(c)) {
									campaigns.add(c);
								}
							}// handleNewCampaign
						}));
				stream = getAssets().open("samples/campaign_2.xml");
				Xml.parse(stream, Xml.Encoding.UTF_8, new LegacyCampaignParser(
						this,
						new LegacyCampaignParser.CampaignParserCallback() {

							@Override
							public void handleNewCampaign(Campaign c) {
								if (!campaigns.contains(c)) {
									campaigns.add(c);
								}
							}// handleNewCampaign
						}));

			} catch (IOException e) {
				e.printStackTrace();
			} catch (SAXException e) {
				e.printStackTrace();
			}
		} else {
			XMLResponseHandler handler = new XMLResponseHandler();
			handler.setCallback(new XMLResponseHandler.StringCallback() {

				@Override
				public void invoke(String xml) {
					try {
						Xml.parse(xml, new CampaignListParser(
								new CampaignListParser.Callback() {

									@Override
									public void invoke(
											ArrayList<Campaign> campaigns) {
										Log.i("CampaignBrowser", "Retrieved "
												+ campaigns.size()
												+ " campaigns.");
										// TODO remove this line.
										G.globalCampaigns = campaigns;
										for (Campaign c : campaigns) {
											handleNewCampaign(c);
										}
										CampaignBrowser.this
												.setCampaigns(campaigns);
									}

								}));
					} catch (SAXException e) {
						e.printStackTrace();
					}
				}
			});
			new GetRequest(this, Campaign.class, null, handler, true).execute();
		}
		Collections.sort(this.campaigns);
		G.globalCampaigns = this.campaigns;
		return this.campaigns;
	}// getCampaigns


	/**
	 * Handle parsing a new {@link Campaign}
	 * 
	 * @param c
	 */
	public void handleNewCampaign(final Campaign c) {
		if (!this.campaigns.contains(c)) {
			this.campaigns.add(c);	
			
			XMLResponseHandler handler = new XMLResponseHandler();
			handler.setCallback(new XMLResponseHandler.StringCallback() {

				@Override
				public void invoke(final String xml) {
					try {
						Xml.parse(xml, new TaskParser(
								new TaskParser.Callback() {

									@Override
									public void invoke(Task t) {
										handleNewTask(c, t);
									}

								}));
					} catch (SAXException e) {
						e.printStackTrace();
					}
				}
			});
			
			new GetRequest(this, Task.class, c.getTaskId(), handler, false).execute();
		}
	}// handleNewCampaign

	/**
	 * Handle parsing a new {@link Task}
	 * 
	 * @param c
	 * @param t
	 */

	public void handleNewTask(final Campaign c, final Task t) {
		if (t == null) {
			Log.d("DEBUG", "Task is null!");
			return;
		}
		t.setId(c.getTaskId());
		c.setTask(t);
	}//handleNewTask

	/**
	 * Handle parsing a new {@link Form} and store the final {@link Campaign} in
	 * {@link #this.campaigns}.
	 * 
	 * @param c
	 * @param t
	 * @param f
	 */
//	public void handleNewForm(Campaign c, Task t, Form f) {
//		t.setForm(f);
//		this.campaigns.add(c);
//	}// handleNewForm

	/**
	 * In order to avoid the campaign browser to add multiples, this line is
	 * needed on onResume.
	 */
//	@Override
//	public void onResume() {
//		this.campaigns = new ArrayList<Campaign>();
//		super.onResume();
//	}// onResume
}// CampaignBrowser
