package com.citizensense.android.parsers;

import java.text.ParseException;
import java.util.ArrayList;

import org.xml.sax.Attributes;
import org.xml.sax.SAXException;

import android.util.Log;

import com.citizensense.android.Campaign;

/**
 * Parses a list of Campaigns
 * @author Phil Brown
 */
public class CampaignListParser extends XMLParser {

	/** {@link Campaign} Array used for storing Campaigns that are parsed as a list.*/
	private ArrayList<Campaign> campaigns;
	/** A reusable {@link Campaign} used during parsing */
	private Campaign campaign;
	
	/** Constructs a new CampaignListParser */
	public CampaignListParser() {
		this(null);
	}//CampaignListParser
	
	/**
	 * Constructs a new CampaignListParse with the given {@link Callback}
	 * @param callback
	 */
	public CampaignListParser(Callback callback) {
		super(callback);
		this.campaigns = new ArrayList<Campaign>();
	}//CampaignListParser
	
	@Override
	public String getTag() {
		return "CampaignListParser";
	}//getTag

	@Override
	public Object getParsedObject() {
		return campaigns;
	}//getParsedObject
	
	@Override
	public void characters(char[] ch, int start, int length)
			throws SAXException {
		super.characters(ch, start, length);
		if(this.isBuffering) {
            this.buffer.append(ch, start, length);
        }
	}//characters
	
	@Override
	public void endElement(String uri, String localName, String qName)
			throws SAXException {
		super.endElement(uri, localName, qName);
		if (localName.equalsIgnoreCase("org.citizensense.model.Campaign")) {
			this.campaigns.add(campaign);
			this.campaign = null;
		}
		else {
			this.isBuffering = false; 
			String content = this.buffer.toString();
			if (localName.equalsIgnoreCase("id")) {
				this.campaign.setId(content);
			}
			else if (localName.equalsIgnoreCase("title")) {
				this.campaign.setName(content);
			}
			else if (localName.equalsIgnoreCase("description")) {
				this.campaign.setDescription(content);
			}
			else if (localName.equalsIgnoreCase("start__date")) {
				try {
					//FIXME: should change the time (server side) to timestamp with timezone
					campaign.setStartDate(this.dateFormat.parse(content));
				} catch (ParseException e) {
					Log.e("TAG", "Invalid Date Format: start_date=" 
						     + content
						     + ". Should use format" 
						     + dateFormat.toLocalizedPattern());
					e.printStackTrace();
				}
			}
			else if (localName.equalsIgnoreCase("end__date")) {
				try {
					campaign.setEndDate(this.dateFormat.parse(content));
				} catch (ParseException e) {
					Log.e("TAG", "Invalid Date Format: start_date=" 
						     + content
						     + ". Should use format" 
						     + dateFormat.toLocalizedPattern());
					e.printStackTrace();
				}
			}
			else if (localName.equalsIgnoreCase("owner__id")) {
				//FIXME this will work for now
				this.campaign.setOwner(content);
			}
			else if (localName.equalsIgnoreCase("task__id")) {
				this.campaign.setTaskId(content);
			}
			else if (localName.equalsIgnoreCase("location")) {
				this.campaign.setLocations(content.split("\\|"));
			}
		}
	}//endElement
	
	@Override
	public void startElement(String uri, String localName, String qName,
			Attributes atts) throws SAXException {
		super.startElement(uri, localName, qName, atts);
		if (localName.equalsIgnoreCase("org.citizensense.model.Campaign")) {
			this.campaign = new Campaign();
		}
		else {
			if (!localName.equalsIgnoreCase("list")) {
				this.buffer = new StringBuffer("");
				this.isBuffering = true;
			}
		}
	}//startElement
	
	/**
	 * Returns the parsed {@link Campaign}s as an {@link ArrayList}.
	 */
	public interface Callback extends XMLParser.Callback<ArrayList<Campaign>> {
		@Override
		public void invoke(ArrayList<Campaign> campaigns);
	}//Callback

}//CampaignListParser
