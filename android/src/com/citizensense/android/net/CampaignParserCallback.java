/* Copyright (c) 2006-2011 Regents of the University of Minnesota.
   For licensing terms, see the file LICENSE.
 */

package com.citizensense.android.net;


import com.citizensense.android.Campaign;

/** Contains the callback method which is called after a CampaignParser 
 * completes successfully
 * @author Phil Brown
 */
public interface CampaignParserCallback {

	/** This method hands a campaign object back to the class that made the call
	 * to the CampaignParser.*/
	public void handleNewCampaign(Campaign c);//handleNewCampaign
}//CampaignParserCallback
