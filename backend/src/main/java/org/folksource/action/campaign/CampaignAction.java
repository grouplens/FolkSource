package org.folksource.action.campaign;

import org.apache.struts2.convention.annotation.Action;
import org.apache.struts2.convention.annotation.Result;
import org.folksource.action.BaseAction;
import org.folksource.util.CampaignService;
import org.folksource.model.campaign;

public class CampaignAction extends BaseAction{
	
	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	private CampaignService campignService;
	
	private List<Campaign> campaigns;
	
	@Action(value="authuri", results = {
		@Result(name = SUCCESS, type="json", params = {"root","response"})
	})
	public String connect() {
		
		return SUCCESS;
	}
}
