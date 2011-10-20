/* Copyright (c) 2006-2011 Regents of the University of Minnesota.
   For licensing terms, see the file LICENSE.
 */

package com.citizensense.android.net;

import java.text.ParseException;
import java.text.SimpleDateFormat;

import org.xml.sax.Attributes;
import org.xml.sax.ContentHandler;
import org.xml.sax.Locator;
import org.xml.sax.SAXException;

import android.content.Context;
import android.util.Log;

import com.citizensense.android.Campaign;
import com.citizensense.android.Question;
import com.citizensense.android.R;
import com.citizensense.android.conf.Constants;


public class CampaignParser implements ContentHandler {

	/** The callback function for when the parser has completed*/
	private CampaignParserCallback callback;
	/** The campaign to return via the callback*/
	private Campaign campaign;
	/** The campaign task to return */
	private Campaign.Task task;
	/** The campaign task's form to return*/
	private Campaign.Task.Form form;
	/** DEBUG tag used for Logging*/
	private final String TAG = "XML Parser";
	/** This is the date format required by start and end dates.*/
	public final SimpleDateFormat dateFormat = new SimpleDateFormat("mm/dd/yyyy");
	/** Used for nicely formatting debug statements*/
	public String tab = "";
	
	/** Context used for accessing resources.*/
	private Context c;

	/** Constructor */
	public CampaignParser(Context context, CampaignParserCallback callback) {
		this.c = context;
		this.callback = callback;
	}//Parser
	
	@Override
	public void characters(char[] arg0, int arg1, int arg2) throws SAXException {
		if (Constants.DEBUG) {
			Log.i(TAG, "characters");
		}
	}//characters

	/** call the callback function passing in the newly constructed Add Object. */
	@Override
	public void endDocument() throws SAXException {
		// TODO call handler
		if (Constants.DEBUG) {
			Log.i(TAG, "End of Document");
			Log.i(TAG, "calling callback");
		}
		callback.handleNewCampaign(this.campaign);
	}//endDocument

	@Override
	public void endElement(String uri, String localName, String qName)
			throws SAXException {
		tab = tab.substring(2);
		if (Constants.DEBUG)  {
			Log.i(TAG, tab + "</" + localName + ">");
		}
	}//endElement

	@Override
	public void endPrefixMapping(String prefix) throws SAXException {
		if (Constants.DEBUG)  {
			Log.i(TAG, "end prefix mapping");
		}
	}//endPrefixMapping

	@Override
	public void ignorableWhitespace(char[] ch, int start, int length)
			throws SAXException {
		if (Constants.DEBUG)  {
			Log.i(TAG, "ignorableWhitespace");
		}
	}//ignorableWhitespace

	@Override
	public void processingInstruction(String target, String data)
			throws SAXException {
		if (Constants.DEBUG)  {
			Log.i(TAG, "processingInstruction");
		}
	}//processingInstruction

	@Override
	public void setDocumentLocator(Locator locator) {
		if (Constants.DEBUG)  {
			Log.i(TAG, "setDocumentLocator");
		}
	}//setDocumentLocator

	@Override
	public void skippedEntity(String name) throws SAXException {
		if (Constants.DEBUG)  {
			Log.i(TAG, "skippedEntity");
		}
	}//skippedEntity

	/** When the document starts, initialize the campaign*/
	@Override
	public void startDocument() throws SAXException {
		if (Constants.DEBUG)  {
			Log.i(TAG, "Document Start");
		}
		this.campaign = new Campaign();
	}//startDocument

	/** This is the driver for this event-driven XML parser. When expected
	 * attributes are found, they are added to a campaign object.*/
	@Override
	public void startElement(String uri, String localName, String qName,
			Attributes atts) throws SAXException {
		if (Constants.DEBUG)  {
			Log.i(TAG, tab + "<" + localName + ">");
		}
		tab += "  ";
		if(localName.equalsIgnoreCase("CAMPAIGN")) {
			if (Constants.DEBUG) {
				this.logAttributes(atts);
			}
			campaign.setId(atts.getValue("id"));
			campaign.setName(atts.getValue("name"));
			campaign.setDescription(atts.getValue("description"));
			String startDate = atts.getValue("start_date");
			try {
				campaign.setStartDate(this.dateFormat.parse(startDate));
			} catch (ParseException e) {
				e.printStackTrace();
				Log.i("TAG", "Invalid Date Format: start_date=" 
						     + atts.getValue("start_date")
						     + ". Should use format" 
						     + dateFormat.toLocalizedPattern());
			}
			String endDate = atts.getValue("end_date");
			try {
				campaign.setEndDate(this.dateFormat.parse(endDate));
			} catch (ParseException e) {
				e.printStackTrace();
				Log.i("TAG", "Invalid Date Format: end_date=" 
					         + atts.getValue("end_date")
						     + ". Should use format" 
						     + dateFormat.toLocalizedPattern());
			}
			String times = atts.getValue("times");
			campaign.setTimes(times.split("\\|"));
			String locations = atts.getValue("location");
			campaign.setLocations(locations.split("\\|"));
			campaign.setOwner(atts.getValue("owner"));
		}
		if(localName.equalsIgnoreCase("TASK")) {
			if (Constants.DEBUG) {
				this.logAttributes(atts);
			}
			String reqs = atts.getValue("requirements");
			this.task = campaign.new Task(atts.getValue("name"), 
					                      atts.getValue("instructions"),
					                      reqs.split("\\|"));
			
		}
		if(localName.equalsIgnoreCase("FORM")) {
			this.form = this.task.new Form();
		}
		if(localName.equalsIgnoreCase("QUESTION")) {
			if (Constants.DEBUG) {
				logAttributes(atts);
			}
			String question = atts.getValue("question");
			String type = atts.getValue("type");
			int t = -1;
			boolean option = false;
			String[]answers = null;
			if (type.equals(c.getString(R.string.multiple_choice))) {
				t = Question.MULTIPLE_CHOICE;
				option = Boolean.parseBoolean(atts.getValue("single_answer"));
				answers = atts.getValue("answers").split("\\|");
			}
			else if (type.equals(c.getString(R.string.written_response))) {
				t = Question.WRITTEN_RESPONSE;
				option = Boolean.parseBoolean(atts.getValue("single_line"));
			}
			Question q = new Question(question, t, answers, option);
			this.form.addQuestion(q);
		}
		
	}//startElement

	@Override
	public void startPrefixMapping(String prefix, String uri)
			throws SAXException {
		if (Constants.DEBUG)  {
			Log.i(TAG, "startPrefixMapping");
		}
	}//startPrefixMapping
	
	/**
	 * Print the attributes to the logcat.
	 * @param atts The attributes to log.
	 */
	public void logAttributes(Attributes atts) {
		for (int i = 0; i < atts.getLength(); i++) {
			String v = atts.getValue(i);
			Log.i(TAG, tab + atts.getLocalName(i) + "=" + v);
		}
	}//logAttributes

}//CampaignParser
