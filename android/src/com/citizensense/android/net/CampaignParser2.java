package com.citizensense.android.net;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;

import org.xml.sax.Attributes;
import org.xml.sax.ContentHandler;
import org.xml.sax.Locator;
import org.xml.sax.SAXException;

import android.util.Log;

import com.citizensense.android.Campaign;
import com.citizensense.android.conf.Constants;

/**
 * This SAX Parser will work with the new XML format, as created by the server
 * @author Phil Brown
 */
public class CampaignParser2 implements ContentHandler {

	/** {@link Campaign} that is being parsed */
	private Campaign campaign;
	/** {@link Campaign} Array used for storing Campaigns that are parsed as a list.*/
	private ArrayList<Campaign> campaigns;
	/** The callback function for when the parser has completed*/
	private Callback callback;
	/** DEBUG tag used for Logging*/
	private final String TAG = "CampaignParser";
	/** Used for nicely formatting debug statements*/
	private String tab = "";
	/** This is the date format required by start and end dates.*/
	public final SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd hh:mm:ss");
	/** This indicates whether or not the SAX parser is currently buffering 
	 * characters. This is base, in part, on code found online.
	 * @see <a href="http://www.ctctlabs.com/index.php/blog/detail/parsing_xml_on_android/">
	 Parsing XML on Android</a>*/
	private boolean isBuffering = false;
	/** This stores the buffer while {@link #isBuffering}==true.
	 * @see <a href="http://www.ctctlabs.com/index.php/blog/detail/parsing_xml_on_android/">
	 Parsing XML on Android</a>*/
	private StringBuffer buffer;
	
	/**
	 * Constructs a new Campaign Parser
	 */
	public CampaignParser2() {
		this.campaigns = new ArrayList<Campaign>();
	}
	
	/**
	 * Construct a new Campaign Parser and specifies a {@link Callback}.
	 * @param callback
	 */
	public CampaignParser2(Callback callback) {
		this();
		this.callback = callback;
	}//CampaignParser
	
	/**
	 * Set the callback for this XML Parser.
	 * @param callback
	 */
	public void setCallback(Callback callback) {
		this.callback = callback;
	}//setCallback
	
	@Override
	public void characters(char[] ch, int start, int length)
			throws SAXException {
		if (Constants.DEBUG) {
			Log.d(TAG, "characters");
		}
		if(this.isBuffering) {
            this.buffer.append(ch, start, length);
        }
	}//characters

	@Override
	public void endDocument() throws SAXException {
		if (Constants.DEBUG) {
			Log.d(TAG, "End of Document");
		}
		Campaign[] c = new Campaign[this.campaigns.size()];
		callback.handle(this.campaigns.toArray(c));
	}//endDocument

	@Override
	public void endElement(String uri, String localName, String qName)
			throws SAXException {
		tab = tab.substring(2);
		if (Constants.DEBUG)  {
			Log.d(TAG, tab + "</" + localName + ">");
		}
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
	public void endPrefixMapping(String prefix) throws SAXException {
		if (Constants.DEBUG)  {
			Log.d(TAG, "end prefix mapping");
		}
	}//endPrefixMapping

	@Override
	public void ignorableWhitespace(char[] ch, int start, int length)
			throws SAXException {
		if (Constants.DEBUG)  {
			Log.d(TAG, "ignorableWhitespace");
		}
	}//ignorableWhitespace

	@Override
	public void processingInstruction(String target, String data)
			throws SAXException {
		if (Constants.DEBUG)  {
			Log.d(TAG, "processingInstruction");
		}
	}//processingInstruction

	@Override
	public void setDocumentLocator(Locator locator) {
		if (Constants.DEBUG)  {
			Log.d(TAG, "setDocumentLocator");
		}
	}//setDocumentLocator

	@Override
	public void skippedEntity(String name) throws SAXException {
		if (Constants.DEBUG)  {
			Log.d(TAG, "skippedEntity");
		}
	}//skippedEntity

	@Override
	public void startDocument() throws SAXException {
		if (Constants.DEBUG)  {
			Log.d(TAG, "Document Start");
		}
	}//startDocument

	@Override
	public void startElement(String uri, String localName, String qName,
			Attributes atts) throws SAXException {
		if (Constants.DEBUG)  {
			Log.d(TAG, tab + "<" + localName + ">");
		}
		this.tab += "  ";
		if (Constants.DEBUG) {
			this.logAttributes(atts);
		}
		if (localName.equalsIgnoreCase("org.citizensense.model.Campaign")) {
			this.campaign = new Campaign();
		}
		else {
			this.buffer = new StringBuffer("");
			this.isBuffering = true;
		}
	}//startElement

	@Override
	public void startPrefixMapping(String prefix, String uri)
			throws SAXException {
		if (Constants.DEBUG)  {
			Log.d(TAG, "startPrefixMapping");
		}
	}//startPrefixMapping
	
	/**
	 * Print the attributes to the Log.
	 * @param atts The attributes to log.
	 */
	public void logAttributes(Attributes atts) {
		for (int i = 0; i < atts.getLength(); i++) {
			String v = atts.getValue(i);
			Log.i(TAG, tab + atts.getLocalName(i) + "=" + v);
		}
	}//logAttributes

	/**
	 * This callback returns Campaign[] back to the method that invoked
	 * this {@link CampaignParser2}.
	 * @author Phil Brown
	 */
	public interface Callback {
		/** Handle the newly-parsed {@link Campaigns}. */
		public void handle(Campaign[] campaigns);
	}//Callback
	
}//XMLParser
