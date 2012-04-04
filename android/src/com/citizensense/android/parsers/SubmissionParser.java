/* Copyright (c) 2006-2011 Regents of the University of Minnesota.
   For licensing terms, see the file LICENSE.
 */

package com.citizensense.android.parsers;

import java.text.ParseException;

import org.xml.sax.Attributes;
import org.xml.sax.SAXException;

import android.util.Log;

import com.citizensense.android.Campaign;
import com.citizensense.android.ServerSubmission;

/**
 * This SAX Parser will work with the new XML format
 * @author Phil Brown
 */
public class SubmissionParser extends XMLParser {

	/** The {@link Campaign} to parse */
	private ServerSubmission submission;
	
	/** Construct a new TaskParser */
	public SubmissionParser() {
		super();
	}//TaskParser
	
	/** 
	 * Construct a new TaskParser with the given {@link Callback}.
	 * @param callback 
	 */
	public SubmissionParser(Callback callback) {
		super(callback);
	}//TaskParser
	
	@Override
	public String getTag() {
		return "SubmissionParser";
	}//getTag

	@Override
	public Object getParsedObject() {
		return submission;
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
		if (!localName.equalsIgnoreCase("org.citizensense.model.Submission")) {
			this.isBuffering = false; 
			String content = this.buffer.toString();
			if (localName.equalsIgnoreCase("id")) {
				this.submission.setId(Integer.parseInt(content));
			}
			else if (localName.equalsIgnoreCase("task__id")) {
				this.submission.setTask_id(Integer.parseInt(content));
			}
			else if (localName.equalsIgnoreCase("user__id")) {
				this.submission.setUser_id(Integer.parseInt(content));
			}
			else if (localName.equalsIgnoreCase("gps__location")) {
				this.submission.setCoords(content.split("|"));
			}
			else if (localName.equalsIgnoreCase("timestamp")) {
				try {
					submission.setTimestamp(this.dateFormat.parse(content));
				} catch (ParseException e) {
					Log.e("TAG", "Invalid Date Format: start_date=" 
						     + content
						     + ". Should use format" 
						     + dateFormat.toLocalizedPattern());
					e.printStackTrace();
				}
			}
//			else if (localName.equalsIgnoreCase("end__date")) {
//				try {
//					submission.setEndDate(this.dateFormat.parse(content));
//				} catch (ParseException e) {
//					Log.e("TAG", "Invalid Date Format: start_date=" 
//						     + content
//						     + ". Should use format" 
//						     + dateFormat.toLocalizedPattern());
//					e.printStackTrace();
//				}
//			}
//			else if (localName.equalsIgnoreCase("owner__id")) {
//				//FIXME this will work for now
//				this.submission.setOwner(content);
//			}
//			else if (localName.equalsIgnoreCase("task__id")) {
//				this.submission.setTaskId(content);
//			}
		}
	}//endElement
	
	@Override
	public void startElement(String uri, String localName, String qName,
			Attributes atts) throws SAXException {
		super.startElement(uri, localName, qName, atts);
		if (localName.equalsIgnoreCase("org.citizensense.model.Submission")) {
			this.submission = new ServerSubmission();
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
