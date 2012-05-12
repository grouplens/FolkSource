/** 
 * @Title: MySubmissionsAdapter.java 
 * @Package com.citizensense.android.util 
 * @author Renji Yu
 * @date 2012-4-9 
 */
package com.citizensense.android.util;

import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Random;

import android.content.Context;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ArrayAdapter;
import android.widget.TextView;

import com.citizensense.android.G;
import com.citizensense.android.LeaderboardEntry;
import com.citizensense.android.R;
import com.citizensense.android.Submission;

/**
 * @ClassName: MySubmissionsAdapter
 * @Description: TODO
 * 
 */
public class AllSubmissionsAdapter extends ArrayAdapter<Submission> {
	/** context in order to allow access to resources and system services */
	private Context context;
	/** The submissions to inflate */
	private ArrayList<Submission> allSubmissions;

	public AllSubmissionsAdapter(Context context,
			ArrayList<Submission> allSubmissions) {
		super(context, 0, allSubmissions);
		this.context = context;
		this.allSubmissions = allSubmissions;
	}

	/** Inflate my submissions history */
	@Override
	public View getView(int position, View convertView, ViewGroup parent) {
		View rowView = convertView;
		if(rowView == null){
			LayoutInflater inflater = (LayoutInflater) context
			.getSystemService(Context.LAYOUT_INFLATER_SERVICE);
			rowView = inflater.inflate(R.layout.all_sub_item, parent, false);
		}
		
		TextView nameView = (TextView) rowView.findViewById(R.id.allSubItemID);
		TextView dateView = (TextView) rowView.findViewById(R.id.allSubItemDate);
		TextView pointView = (TextView) rowView.findViewById(R.id.allSubItemPoints);
		
		TextView acceptView = (TextView) rowView.findViewById(R.id.thumbupText);
		TextView rejectView = (TextView) rowView.findViewById(R.id.thumbdownText);
		//FIXME: we set these values to random numbers now
		Random r = new Random();
		acceptView.setText(r.nextInt(10)+"");
		rejectView.setText(r.nextInt(10)+"");
		
		if(allSubmissions!=null){
			Submission sub = allSubmissions.get(position);
			SimpleDateFormat dateformat = new SimpleDateFormat("yyyy/MM/dd HH:mm");
			String time = dateformat.format(sub.getTimestamp());
			String userName = "";
			if(G.leaderboardMap!=null) {
				LeaderboardEntry entry = G.leaderboardMap.get(sub.getUser_id());
				if(entry!=null) userName = entry.name;
			}
			
			nameView.setText(userName + ""); // toString
			dateView.setText(time);
			pointView.setText(sub.getPoints() + ""); //toString
		}
		return rowView;
	}// getView
}
