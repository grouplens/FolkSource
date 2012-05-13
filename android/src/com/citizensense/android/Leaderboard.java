package com.citizensense.android;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

import org.json.JSONObject;
import org.w3c.dom.Document;
import org.xml.sax.SAXException;

import android.content.Context;
import android.os.Handler;
import android.os.Message;
import android.os.Parcel;
import android.util.Xml;
import android.widget.ArrayAdapter;
import android.widget.ListView;
import android.widget.TextView;

import com.citizensense.android.net.GetRequest;
import com.citizensense.android.net.XMLResponseHandler;
import com.citizensense.android.parsers.CampaignParser;
import com.citizensense.android.parsers.LeaderboardParser;

/**
 * Handles the leaderboard object
 * 
 * @author Phil Brown
 */
public class Leaderboard implements Item {

	/** The entries that compose the leaderbaord. */
	public List<LeaderboardEntry> entries;

	public Leaderboard() {
		this.entries = new ArrayList<LeaderboardEntry>();
	}// Leaderboard

	@Override
	public int describeContents() {
		// TODO Auto-generated method stub
		return 0;
	}// describeContents

	@Override
	public void writeToParcel(Parcel dest, int flags) {
		// TODO Auto-generated method stub

	}// writeToParcel

	@Override
	public String buildXML() {
		// TODO Auto-generated method stub
		return null;
	}// buildXML

	@Override
	public void createFromXML(Document document) {
		// TODO Auto-generated method stub

	}// creatFromXML

	@Override
	public void createFromXML(String xml) {
		try {
			Xml.parse(xml, new CampaignParser(new CampaignParser.Callback() {

				@Override
				public void invoke(Campaign campaign) {
					// TODO
				}
			}));
		} catch (SAXException e) {
			e.printStackTrace();
		}
	}// creatFromXML

	@Override
	public String buildJSON() {
		// TODO Auto-generated method stub
		return null;
	}// buildJSON

	@Override
	public void createFromJSON(JSONObject object) {
		// TODO Auto-generated method stub

	}// createFromJSON

	@Override
	public String getItemName() {
		return "leaderboard";
	}// getItemName


}// Leaderboard
