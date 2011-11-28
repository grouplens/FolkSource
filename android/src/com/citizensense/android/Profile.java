/* Copyright (c) 2006-2011 Regents of the University of Minnesota.
   For licensing terms, see the file LICENSE.
 */

package com.citizensense.android;

import java.io.InputStream;

import android.app.ListActivity;
import android.os.Bundle;
import android.util.Xml;
import android.widget.TextView;

import com.citizensense.android.parsers.IncentiveParser;
import com.citizensense.android.util.LeaderboardAdapter;

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
		try {
			InputStream stream = G.app_context.getAssets().open("samples/incentive_3.xml");
			Xml.parse(stream, 
					  Xml.Encoding.UTF_8, 
					  new IncentiveParser(new IncentiveParser.Callback() {
				/** set the list adapter using the retrieved leaderboard. */
				@Override
				public void invoke(Incentive i) {
					setListAdapter(new LeaderboardAdapter(Profile.this, 
							                              i.getLeaderbaord()));
				}
			}));
		} catch (Exception e) {
			e.printStackTrace();
		}
	}//getIncentive
}//Profile
