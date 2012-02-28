package com.citizensense.android.util;

import java.util.List;

import android.content.Context;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ArrayAdapter;
import android.widget.TextView;

import com.citizensense.android.LeaderboardEntry;
import com.citizensense.android.R;

public class LeaderboardAdapter extends ArrayAdapter<LeaderboardEntry> {

	/** context in order to allow access to resources and system services */
	private Context context;
	
	/** The leaderboard to inflate */
	private List<LeaderboardEntry> leaderboard;
	
	public LeaderboardAdapter(Context context, List<LeaderboardEntry> leaderboard) {
		super(context, 0, leaderboard);
		this.context = context;
		this.leaderboard = leaderboard;
	}//LegacyLeaderboardAdapter
	
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
		LeaderboardEntry entry = leaderboard.get(position);
		TextView text = (TextView) v.findViewById(R.id.user_stats);
		text.setText((position + 1) + ". " + entry.name + " points: " + entry.points);
		return v;
	}//getView
}//LeaderboardAdapter
