package com.citizensense.android.net;

import com.citizensense.android.Campaign;
import com.citizensense.android.Campaign.Task;
import com.citizensense.android.Campaign.Task.Form;

public interface CampaignParserCallback {

	public void handleNewCampaign(Campaign c);
}
