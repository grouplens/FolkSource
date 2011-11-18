/* Copyright (c) 2006-2011 Regents of the University of Minnesota.
   For licensing terms, see the file LICENSE.
 */

package com.citizensense.android.parsers;

import java.text.SimpleDateFormat;

import org.xml.sax.Attributes;
import org.xml.sax.ContentHandler;
import org.xml.sax.Locator;
import org.xml.sax.SAXException;

import android.util.Log;

import com.citizensense.android.Item;
import com.citizensense.android.conf.Constants;

/**
 * Provides the constructs for creating a simple SAX Parser for {@link Item}s 
 * or {@code Item[]}s in Citizen Sense.
 * @author Phil Brown
 */
public abstract class XMLParser implements ContentHandler {

	/** The callback function for when the parser has completed*/
	@SuppressWarnings("rawtypes")
	protected Callback callback;
	/** DEBUG tag used for Logging*/
	protected String TAG = "XMLParser";
	/** Used for nicely formatting debug statements*/
	protected String tab = "";
	/** This is the date format required by start and end dates.*/
	protected final SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd hh:mm:ss");
	/** This indicates whether or not the SAX parser is currently buffering 
	 * characters. This is base, in part, on code found online.
	 * @see <a href="http://www.ctctlabs.com/index.php/blog/detail/parsing_xml_on_android/">
	 Parsing XML on Android</a>*/
	protected boolean isBuffering = false;
	/** This stores the buffer while {@link #isBuffering}==true.
	 * @see <a href="http://www.ctctlabs.com/index.php/blog/detail/parsing_xml_on_android/">
	 Parsing XML on Android</a>*/
	protected StringBuffer buffer;
	
	/** Construct a new XMLParser */
	protected XMLParser() {
		this(null);
	}//XMLParser
	
	/**
	 * Construct a new XMLParser with the given {@link Callback}
	 * @param callback
	 */
	@SuppressWarnings("rawtypes")
	protected XMLParser(Callback callback) {
		this.callback = callback;
		this.TAG = getTag();
	}//XMLParser
	
	/**
	 * Set the {@link Callback} to call after this {@link XMLParser} has 
	 * completed
	 * @param callback
	 */
	protected void setCallback(Callback<?> callback) {
		this.callback = callback;
	}//setCallback
	
	@Override
	public void characters(char[] ch, int start, int length)
			throws SAXException {
		if (Constants.DEBUG) {
			Log.d(TAG, "characters");
		}
	}//characters
	
	/** Invokes the callback after this parser has completed. */
	@SuppressWarnings("unchecked")
	@Override
	public void endDocument() throws SAXException {
		if (Constants.DEBUG) {
			Log.d(TAG, "End of Document");
		}
		this.callback.invoke(getParsedObject());
	}//endDocument

	@Override
	public void endElement(String uri, String localName, String qName)
			throws SAXException {
		tab = tab.substring(2);
		String content = this.buffer.toString();
		Log.i(TAG, tab + content);
		if (Constants.DEBUG)  {
			Log.d(TAG, tab + "</" + localName + ">");
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
	
	/** Returns the TAG used for debugging. */
	public abstract String getTag();
	
	/** Returns the callback item */
	public abstract Object getParsedObject();
	
	/** 
	 * Return the Object (generally an {@link Item} or {@code Item[]}) 
	 * after this {@link XMLParser} completes.
	 */
	protected interface Callback<T extends Object> {
		/** Handle the Object */
		public void invoke(T object);
	}//Callback
	
}//XMLParser
