/* Copyright (c) 2006-2011 Regents of the University of Minnesota.
   For licensing terms, see the file LICENSE.
 */

package com.citizensense.android.parsers;

import java.text.ParseException;

import org.xml.sax.Attributes;
import org.xml.sax.SAXException;

import android.util.Log;

import com.citizensense.android.Campaign;

/**
 * This SAX Parser will work with the new XML format
 * @author Phil Brown
 */
public class CampaignParser extends XMLParser {

	/** The {@link Campaign} to parse */
	private Campaign campaign;
	
	/** Construct a new TaskParser */
	public CampaignParser() {
		super();
	}//TaskParser
	
	/** 
	 * Construct a new TaskParser with the given {@link Callback}.
	 * @param callback 
	 */
	public CampaignParser(Callback callback) {
		super(callback);
	}//TaskParser
	
	@Override
	public String getTag() {
		return "CampaignParser";
	}//getTag

	@Override
	public Object getParsedObject() {
		return campaign;
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
		if (!localName.equalsIgnoreCase("org.citizensense.model.Campaign")) {
			this.isBuffering = false; 
			String content = this.buffer.toString();
			if (localName.equalsIgnoreCase("id")) {
				this.campaign.setId(content);
			}
			else if (localName.equalsIgnoreCase("name")) {
				this.campaign.setName(content);
			}
			else if (localName.equalsIgnoreCase("description")) {
				this.campaign.setDescription(content);
			}
			else if (localName.equalsIgnoreCase("start__date")) {
				try {
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
			this.buffer = new StringBuffer("");
			this.isBuffering = true;
		}
	}//startElement
	
	/**
	 * Returns the parsed {@link Campaign} to the calling class
	 */
	public interface Callback extends XMLParser.Callback<Campaign> {
		@Override
		public void invoke(Campaign campaign);
	}//Callback

}//CampaignParser
