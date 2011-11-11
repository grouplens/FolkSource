/* Copyright (c) 2006-2011 Regents of the University of Minnesota.
   For licensing terms, see the file LICENSE.
 */

package com.citizensense.android.net;

import org.apache.http.client.ResponseHandler;

import android.content.Context;

import com.citizensense.android.Item;
/**
 * HTTP GET request handled in a Non-UI Thread
 * @author Phil Brown
 */
public class GetRequest extends Request {

	/**
	 * Constructs the GET Request 
	 * @param context used to update the UI Thread
	 * @param itemType The type of Item to be sent. Must be a valid
	 * {@link Item} Object.
	 * @param id The id of the {@link Item} to get. If {@code null}, this will
	 * return a list of all {@link Item}s of type {@code itemType}.
	 * @param handler Must be either {@link XMLResponseHandler} or 
	 * {@link JSONResponseHandler}. This also defines the returned format of
	 * the request.
	 * @param showPopup whether or not this get request should be visible to
	 * the user.
	 */
	public GetRequest(Context context, Class<?> itemType, String id, 
			ResponseHandler<?> handler, boolean showPopup) {
		super(context, itemType, id, handler, showPopup);
	}//GetRequest
}//GetRequest
