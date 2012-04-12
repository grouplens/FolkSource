/** 
 * @Title: MySubmissionsAdapter.java 
 * @Package com.citizensense.android.util 
 * @author Renji Yu
 * @date 2012-4-9 
 */
package com.citizensense.android.util;

import java.text.SimpleDateFormat;
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
		LayoutInflater inflater = (LayoutInflater) context
				.getSystemService(Context.LAYOUT_INFLATER_SERVICE);
		View rowView = inflater.inflate(R.layout.all_sub_item, parent, false);
		TextView textView = (TextView) rowView.findViewById(R.id.allSubItem);
		if(allSubmissions!=null){
			Submission sub = allSubmissions.get(position);
			SimpleDateFormat dateformat = new SimpleDateFormat("yyyy/MM/dd HH:mm");
			String time = dateformat.format(sub.getTimestamp());
			textView.setText(sub.getUser_id() + "         "+time+"         "+sub.getPoints());
		}
		return rowView;
	}// getView
}
