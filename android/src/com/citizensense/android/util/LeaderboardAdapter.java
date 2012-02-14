/* Copyright (c) 2006-2011 Regents of the University of Minnesota.
   For licensing terms, see the file LICENSE.
 */

package com.citizensense.android.util;

import java.util.ArrayList;

import android.content.Context;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ArrayAdapter;
import android.widget.TextView;

import com.citizensense.android.R;
import com.citizensense.android.User;

/**
 * Inflates the leaderboard on the user's profile page
 * @author Phil Brown
 *
 */
public class LeaderboardAdapter extends ArrayAdapter<User> {

	/** context in order to allow access to resources and system services */
	private Context context;
	
	/** The leaderboard to inflate */
	private ArrayList<User> leaderboard;
	
	public LeaderboardAdapter(Context context, ArrayList<User> leaderboard) {
		super(context, 0, leaderboard);
		this.context = context;
		this.leaderboard = leaderboard;
	}//LeaderboardAdapter
	
	/** Inflate the leaderboard */
	@Override
	public View getView(int position, View convertView, ViewGroup parent) {
		View v = convertView;
		if (v == null) {
			LayoutInflater vi = 
				(LayoutInflater)context.getSystemService(
						Context.LAYOUT_INFLATER_SERVICE);
			v = vi.inflate(R.layout.leaderboard, null);
		}
		User user = leaderboard.get(position);
		TextView text = (TextView) v.findViewById(R.id.user_stats);
		text.setText((position + 1) + ". " + user.getUsername() + " points: " + user.points);
		return v;
	}//getView

}//LeaderboardAdapter
