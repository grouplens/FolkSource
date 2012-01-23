/* Copyright (c) 2006-2011 Regents of the University of Minnesota.
   For licensing terms, see the file LICENSE.
 */

package com.citizensense.android;

import java.io.InputStream;

import org.xml.sax.SAXException;

import android.app.ListActivity;
import android.os.Bundle;
import android.util.Xml;
import android.widget.TextView;

import com.citizensense.android.conf.Constants;
import com.citizensense.android.net.GetRequest;
import com.citizensense.android.net.XMLResponseHandler;
import com.citizensense.android.parsers.IncentiveParser;
import com.citizensense.android.parsers.LeaderboardParser;
import com.citizensense.android.util.LeaderboardAdapter;
import com.citizensense.android.util.LegacyLeaderboardAdapter;

/**
 * Replacement class for the profile
 * @author Phil Brown
 *
 */
public class Profile extends ListActivity {
	
	@Override
	public void onCreate(Bundle savedInstanceState) {
		super.onCreate(savedInstanceState);
		setContentView(R.layout.profile);
		TextView username = (TextView) findViewById(R.id.username);
		username.setText(G.user.getUsername());
		//TODO construct a request to get the leaderboard, providing the current username to the server
		getIncentive();
	}//onCreate
	
	/** Get the leaderboard incentive locally */
	private void getIncentive() { 
		//TODO get incentive from the server.
		if (Constants.localCampaignsOnly) {
			try {
				InputStream stream = G.app_context.getAssets().open("samples/incentive_3.xml");
				Xml.parse(stream, 
						  Xml.Encoding.UTF_8, 
						  new IncentiveParser(new IncentiveParser.Callback() {
					/** set the list adapter using the retrieved leaderboard. */
					@Override
					public void invoke(Incentive i) {
						setListAdapter(new LegacyLeaderboardAdapter(Profile.this, 
								                              i.getLeaderbaord()));
					}
				}));
			} catch (Exception e) {
				e.printStackTrace();
			}
		}
		else {
			XMLResponseHandler handler = new XMLResponseHandler();
			handler.setCallback(new XMLResponseHandler.StringCallback() {

				@Override
				public void invoke(String xml) {
					try {
						Xml.parse(xml, new LeaderboardParser(new LeaderboardParser.Callback() {
							
							@Override
							public void invoke(Leaderboard leaderboard) {
								setListAdapter(new LeaderboardAdapter(Profile.this, 
										                              leaderboard.entries));
							}
						}));
					} catch (SAXException e) {
						e.printStackTrace();
					}
				}
			});
			new GetRequest(this, Leaderboard.class, null, handler, true).execute();
		}
	}//getIncentive
}//Profile
