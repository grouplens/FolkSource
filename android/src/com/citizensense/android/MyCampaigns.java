/* Copyright (c) 2006-2011 Regents of the University of Minnesota.
   For licensing terms, see the file LICENSE.
 */

package com.citizensense.android;

import java.util.ArrayList;

/** 
 * Shows the campaigns that the user has downloaded
 * @author Phil Brown
 */
public class MyCampaigns extends CampaignExplorer {

	@SuppressWarnings("unchecked")
	@Override
	public ArrayList<Campaign> getCampaigns() {
		return (ArrayList<Campaign>) G.db.getCampaigns();
	}//getCampaigns
	
}//MyCampaigns
