/** 
 * @Title: MySubmissionsAdapter.java 
 * @Package com.citizensense.android.util 
 * @author Renji Yu
 * @date 2012-4-9 
 */
package com.citizensense.android.util;

import java.util.ArrayList;

import android.content.Context;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ArrayAdapter;
import android.widget.TextView;

import com.citizensense.android.G;
import com.citizensense.android.R;
import com.citizensense.android.Submission;

/**
 * @ClassName: MySubmissionsAdapter
 * @Description: TODO
 * 
 */
public class MySubmissionsAdapter extends ArrayAdapter<Submission> {
	/** context in order to allow access to resources and system services */
	private Context context;
	/** The submissions to inflate */
	private ArrayList<Submission> mySubmissions;

	public MySubmissionsAdapter(Context context,
			ArrayList<Submission> mySubmissions) {
		super(context, 0, mySubmissions);
		this.context = context;
		this.mySubmissions = mySubmissions;
	}

	/** Inflate my submissions history */
	@Override
	public View getView(int position, View convertView, ViewGroup parent) {
		LayoutInflater inflater = (LayoutInflater) context
				.getSystemService(Context.LAYOUT_INFLATER_SERVICE);
		View rowView = inflater.inflate(R.layout.my_sub_item, parent, false);
		TextView textView = (TextView) rowView.findViewById(R.id.mySubItem);
		if(mySubmissions!=null){
			Submission sub = mySubmissions.get(position);
			textView.setText(G.user.getUsername() + " " + sub.getTimestamp());
		}
		return rowView;
	}// getView
}
