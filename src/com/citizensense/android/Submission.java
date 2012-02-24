package com.citizensense.android;

import org.json.JSONObject;
import org.w3c.dom.Document;

import android.os.Parcel;

public class Submission implements Item {
	
	public String xml;
	
	public Submission(String xml) {
		this.xml = xml;
	}

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
		return this.xml;
	}

	@Override
	public void createFromXML(Document document) {
		// TODO Auto-generated method stub
		
	}

	@Override
	public void createFromXML(String string) {
		// TODO Auto-generated method stub
		
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
		return "submission";
	}

}
