package org.folksource.service;

import java.util.List;

import org.folksource.entities.Campaign;

public interface CampaignService {

	List<Campaign> getCampaigns();
	
	Campaign getCampaign(int id);
	
	void save(Campaign camp);
}
