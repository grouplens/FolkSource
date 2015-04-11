package org.folksource.action.controller;

import java.util.List;

import org.apache.struts2.convention.annotation.Action;
import org.apache.struts2.convention.annotation.Result;
import org.folksource.action.BaseAction;
import org.folksource.entities.Campaign;
import org.folksource.service.CampaignService;


public class CampaignAction extends BaseAction{
	
	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	private CampaignService campaignService;
	
	private Campaign campaign;
	private List<Campaign> campaigns;
	private Integer id;


	@Action(value="campaign/index", results = {
		@Result(name = SUCCESS, type="json", params = {"root","campaigns"})
	})
	public String index() {
		campaigns = campaignService.getCampaigns();
		return SUCCESS;
	}
	
	@Action(value="campaign/show", results = {
		@Result(name = SUCCESS, type="json", params = {"root","campaign"})
	})
	public String show() {
		campaign = campaignService.getCampaign(id);
		return SUCCESS;
	}
	
	@Action(value="campaign/save", results = {
		@Result(name = SUCCESS, type = "json", params = { "root", "response", "statusCode", "200" })
	})
	public String save() {
		campaignService.save(campaign);
		return SUCCESS;
	}

	
	public CampaignService getCampaignService() {
		return campaignService;
	}

	public void setCampaignService(CampaignService campaignService) {
		this.campaignService = campaignService;
	}

	public Campaign getCampaign() {
		return campaign;
	}

	public void setCampaign(Campaign campaign) {
		this.campaign = campaign;
	}

	public List<Campaign> getCampaigns() {
		return campaigns;
	}

	public void setCampaigns(List<Campaign> campaigns) {
		this.campaigns = campaigns;
	}

	public Integer getId() {
		return id;
	}

	public void setId(Integer id) {
		this.id = id;
	}


}
