package org.folksource.action.campaign;
import java.util.List;

import org.apache.struts2.convention.annotation.Action;
import org.apache.struts2.convention.annotation.ParentPackage;
import org.apache.struts2.convention.annotation.Result;
import org.folksource.action.BaseAction;
import org.folksource.entities.Campaign;
import org.folksource.service.CampaignService;

@ParentPackage("folksource-unsecured-pkg")
public class CampaignAction extends BaseAction{

	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	private List<Campaign> campaigns;
	private CampaignService campaignService;
	
	@Action(value="campaigns", results = {
		@Result(name = SUCCESS, type="json", params = {"root","campaigns"})
	})
	public String sendToken() {
		campaigns = campaignService.getCampaigns();
		return SUCCESS;
	}

	public List<Campaign> getCampaigns() {
		return campaigns;
	}

	public void setCampaigns(List<Campaign> campaigns) {
		this.campaigns = campaigns;
	}

	public CampaignService getCampaignService() {
		return campaignService;
	}

	public void setCampaignService(CampaignService campaignService) {
		this.campaignService = campaignService;
	}
}
