/* Copyright (c) 2006-2011 Regents of the University of Minnesota.
   For licensing terms, see the file LICENSE.
 */

package com.citizensense.android.net;

import org.apache.http.impl.client.BasicResponseHandler;

import android.content.Context;

import com.citizensense.android.Item;
/**
 * HTTP POST request handled in a Non-UI Thread
 * @author Phil Brown
 */
public class PostRequest extends Request {

	/**
	 * Create a POST Request
	 * @param context used for updating the UI
	 * @param data the item to post. This must be a valid {@link Item}.
	 * @param format the format of the item to post. This must be either
	 * {@link Request#JSON}, {@link Request#XML}, or {@code null}. 
	 * null will be treated as {@link Request#XML}.
	 * @param handler where the return String is handled.
	 * @param showPopup true to display a dialog during HTTP transaction.
	 */
	public PostRequest(Context context, Item data, int format, 
			           BasicResponseHandler handler, boolean showPopup) {
		super(context, data, format, handler, showPopup);
	}//PostRequest
	
	/**
	 * Create a Post Request.
	 * Shortcut to {@link #PostRequest(Context, Item, int, 
	 * BasicResponseHandler, boolean)} 
	 * that automatically selects the data format as {@link Request#XML}.
	 */
	public PostRequest(Context context, Item data, 
			           BasicResponseHandler handler, boolean showPopup) {
		this(context, data, XML, handler, showPopup);
	}//PostRequest
	
}//PostRequest
