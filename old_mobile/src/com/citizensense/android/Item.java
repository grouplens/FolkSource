/* Copyright (c) 2006-2011 Regents of the University of Minnesota.
   For licensing terms, see the file LICENSE.
 */

package com.citizensense.android;

import org.json.JSONObject;
import org.w3c.dom.Document;

import android.os.Parcelable;

/**
 * Represents an item that is sent over the network or between classes by
 * enforcing some methods for changing the format of the Object.
 * @author Phil Brown
 */
public interface Item extends Parcelable {

	/** 
	 * Return the {@link Item} as a String representation of an XML document.
	 * @param item
	 * @return
	 */
	public String buildXML();
	
	/**
	 * Instantiate a new Item given an XML {@link Document} (using the DOM parser).
	 * @param document
	 */
	public void createFromXML(Document document);
	
	/**
	 * Instantiate a new Item given an XML as a String (using the SAX parser).
	 */
	public void createFromXML(String string);
	
	/** 
	 * Return the {@link Item} as a String representation of an JSON document.
	 * @param item
	 * @return
	 */
	public String buildJSON();
	
	/**
	 * Instantiate a new Item given a {@link JSONObject}
	 * @param object
	 */
	public void createFromJSON(JSONObject object);
	
	/**
	 * Get the name of the {@link Item}. This will be used in the URL that
	 * gets or sends data to the server, so it must be lowercase.
	 */
	public String getItemName();
	
}//Item
