/* Copyright (c) 2006-2011 Regents of the University of Minnesota.
   For licensing terms, see the file LICENSE.
 */

package com.citizensense.android.parsers;

import com.citizensense.android.Campaign;
import com.citizensense.android.Form;
import com.citizensense.android.Question;
import com.citizensense.android.Task;

/**
 * In the latest version of a campaign that is downloadable from the server, all
 * info in the campaign heirarchy is included. This parser contains the constructs
 * to parse a campaign, a task, and a form after a single http entity is received.
 * @author Phil Brown
 */
public class FinalCampaignParser extends XMLParser {

	private Campaign c;
	private Task t;
	private Form f;
	private Question q;
	
	@Override
	public String getTag() {
		return "FinalCampaignParser";
	}//getTag

	@Override
	public Object getParsedObject() {
		return c;
	}//getParsedObject
	
}//FinalCampaignParser
