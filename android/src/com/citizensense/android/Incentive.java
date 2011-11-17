/* Copyright (c) 2006-2011 Regents of the University of Minnesota.
   For licensing terms, see the file LICENSE.
 */

package com.citizensense.android;

import org.json.JSONObject;
import org.w3c.dom.Document;

import android.os.Parcel;

/**
 * Incentive Item
 * @author Phil Brown
 *
 */
public class Incentive implements Item {

	@Override
	public int describeContents() {
		// TODO Auto-generated method stub
		return 0;
	}

	@Override
	public void writeToParcel(Parcel dest, int flags) {
		// TODO Auto-generated method stub
		
	}

	@Override
	public String buildXML() {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public void createFromXML(Document document) {
		// TODO Auto-generated method stub
		
	}
	

	@Override
	public void createFromXML(String string) {
		
	}

	@Override
	public String buildJSON() {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public void createFromJSON(JSONObject object) {
		// TODO Auto-generated method stub
		
	}

	@Override
	public String getItemName() {
		return "incentive";
	}//getItemName

}
