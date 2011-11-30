/* Copyright (c) 2006-2011 Regents of the University of Minnesota.
   For licensing terms, see the file LICENSE.
 */

package com.citizensense.android;

import java.io.IOException;
import java.io.InputStream;
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

import com.citizensense.android.conf.Constants;
import com.citizensense.android.net.GetRequest;
import com.citizensense.android.net.XMLResponseHandler;
import com.citizensense.android.parsers.CampaignListParser;
import com.citizensense.android.parsers.FormParser;
import com.citizensense.android.parsers.LegacyCampaignParser;
import com.citizensense.android.parsers.TaskParser;

/**
 * The campaign browser allows users to view active campaigns in an "app-store"
 * style browser.
 * @author Phil Brown
 */
public class CampaignBrowser extends CampaignExplorer {
	
	/** The campaigns retrieved from the server */
	public ArrayList<Campaign> server_campaigns;
	
	/** Referenced in {@link #onContextItemSelected(MenuItem)} to know which
	 * item was clicked. */
	private boolean list_clicked;
	
	@Override
	public void onCreate(Bundle savedInstanceState) {
		server_campaigns = new ArrayList<Campaign>();
		super.onCreate(savedInstanceState);
	}//onCreate
	
	@Override
	public ArrayList<Campaign> getCampaigns() {
		
		// FIXME retrieve campaigns from the gallery. 
		 // The following code should do it:
		if (Constants.localCampaignsOnly) {
			try {
				InputStream stream = getAssets().open("samples/campaign_1.xml");
				Xml.parse(stream, Xml.Encoding.UTF_8, new LegacyCampaignParser(this, new LegacyCampaignParser.CampaignParserCallback() {
					
					@Override
					public void handleNewCampaign(Campaign c) {
						if (!server_campaigns.contains(c)) {
							server_campaigns.add(c);
						}
					}//handleNewCampaign
				}));
				stream = getAssets().open("samples/campaign_2.xml");
				Xml.parse(stream, Xml.Encoding.UTF_8, new LegacyCampaignParser(this, new LegacyCampaignParser.CampaignParserCallback() {
					
					@Override
					public void handleNewCampaign(Campaign c) {
						if (!server_campaigns.contains(c)) {
							server_campaigns.add(c);
						}
					}//handleNewCampaign
				}));
				
				//The below will also parse the campaigns in campaign_3.xml using the new format.
				/*
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
				*/
			} catch (IOException e) {
				e.printStackTrace();
			} catch (SAXException e) {
				e.printStackTrace();
			}
		}
		else {
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
								//G.currentCampaigns = campaigns;
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
		}
		//G.currentCampaigns = server_campaigns;
		return server_campaigns;
	}//getCampaigns

	@Override
	public void onCreateContextMenu(ContextMenu menu, View v,
			ContextMenuInfo menuInfo) {
		super.onCreateContextMenu(menu, v, menuInfo);
		MenuInflater inflater = getMenuInflater();
		switch(v.getId()) {
			case (R.id.campaign_gallery) : {
				menu.setHeaderTitle((campaigns.get(this.current_gallery_position)).getName());
				list_clicked = false;
				break;
			}
			case (android.R.id.list) : {
				menu.setHeaderTitle((campaigns.get(this.current_list_position)).getName());
				list_clicked = true;
				break;
			}
			default : {
				menu.setHeaderTitle("Campaign");
				list_clicked = false;
				break;
			}
		}
		inflater.inflate(R.menu.campaign_browser_context_menu, menu);
	}//onCreateContextMenu

	@Override
	public boolean onContextItemSelected(MenuItem item) {
		switch (item.getItemId()) {
		/* Add the campaign to the local database*/
		case R.id.download:
			if (this.list_clicked) {
				G.db.addCampaign(campaigns.get(this.current_list_position));
			} 
			else {
				G.db.addCampaign(campaigns.get(this.current_gallery_position));
			}
			return true;
		}
		return super.onContextItemSelected(item);
	}//onContextItemSelected

	/**
	 * Handle parsing a new {@link Campaign}
	 * @param c
	 */
	public void handleNewCampaign(final Campaign c) {
		if (!server_campaigns.contains(c)) {
			XMLResponseHandler handler = new XMLResponseHandler();
			handler.setCallback(new XMLResponseHandler.StringCallback() {
				
				@Override
				public void invoke(String xml) {
					try {
						Xml.parse(xml, new TaskParser(new TaskParser.Callback() {
	
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
			new GetRequest(this, Task.class, c.getId(), handler, true).execute();
		}
	}//handleNewCampaign
	
	/**
	 * Handle parsing a new {@link Task}
	 * @param c
	 * @param t
	 */
	public void handleNewTask(final Campaign c, final Task t) {
		c.setTask(t);
		/*
		XMLResponseHandler handler = new XMLResponseHandler();
		handler.setCallback(new XMLResponseHandler.StringCallback() {
			
			@Override
			public void invoke(String xml) {
				try {
					Xml.parse(xml, new FormParser(new FormParser.Callback() {

						@Override
						public void invoke(Form form) {
							handleNewForm(c, t, form);
						}
						
					}));
				} catch (SAXException e) {
					e.printStackTrace();
				}
			}
		});
		new GetRequest(this, Task.class, c.getId(), handler, true).execute();
		*/
		try {
			InputStream stream = getAssets().open("samples/form_1.xml");
			Xml.parse(stream, Xml.Encoding.UTF_8, new FormParser(new FormParser.Callback() {
				
				@Override
				public void invoke(Form form) {
					handleNewForm(c, t, form);
				}
			}));
		} catch (IOException e) {
			e.printStackTrace();
		} catch (SAXException e) {
			e.printStackTrace();
		}
	}//handleNewTask
	
	/**
	 * Handle parsing a new {@link Form} and store the final {@link Campaign}
	 * in {@link #server_campaigns}.
	 * @param c
	 * @param t
	 * @param f
	 */
	public void handleNewForm(Campaign c, Task t, Form f) {
		t.setForm(f);
		server_campaigns.add(c);
	}//handleNewForm
	
	/** In order to avoid the campaign browser to add multiples, this
	 * line is needed on onResume.*/
	@Override
	public void onResume() {
		this.server_campaigns = new ArrayList<Campaign>();
		super.onResume();
	}//onResume
	
}//CampaignBrowser
