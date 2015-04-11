package org.folksource.controller;

import javax.servlet.http.HttpServletResponse;

import org.folksource.model.Campaign;
import org.folksource.model.CampaignDto;
import org.folksource.util.*;
import org.grouplens.common.dto.DtoContainer;

import com.opensymphony.xwork2.ModelDriven;

import org.apache.struts2.ServletActionContext;
import org.apache.struts2.convention.annotation.ParentPackage;

public class CampaignController implements ModelDriven<DtoContainer<CampaignDto>>{
	
	DtoContainer<CampaignDto> content = new DtoContainer<CampaignDto>(CampaignDto.class, false);
	private int id;

	@Override
	public DtoContainer<CampaignDto> getModel() {
		return content;
	}
	
	public String show() {
		HttpServletResponse res = ServletActionContext.getResponse();
		res.setHeader("Access-Control-Allow-Origin", "*");
		content.set(new CampaignDto(CampaignService.getCampaign(id)));
		
		return "show";
	}
	
	public void setId(String id) {
		this.id = Integer.parseInt(id);		
	}
	
	public int getId() {
		return this.id;
	}
	
	public String index() {
		HttpServletResponse res = ServletActionContext.getResponse();
		res.setHeader("Access-Control-Allow-Origin", "*");
		res.addHeader("Access-Control-Allow-Headers", "Authorization, AuthToken");
		res.addHeader("Access-Control-Expose-Headers", "Authorization, AuthToken");
		content = new DtoContainer<CampaignDto>(CampaignDto.class, true);
		content.set(CampaignDto.fromCampaignList(CampaignService.getCampaigns()));
		return "index";
	}
	public String options() {
		HttpServletResponse res = ServletActionContext.getResponse();
		res.setHeader("Access-Control-Allow-Origin", "*");
		res.addHeader("Access-Control-Allow-Headers", "Authorization, AuthToken");
		res.addHeader("Access-Control-Expose-Headers", "Authorization, AuthToken");
		return "options_success";
	}
	public String create()
	{
		HttpServletResponse res = ServletActionContext.getResponse();
		res.setHeader("Access-Control-Allow-Origin", "*");
		res.addHeader("Access-Control-Allow-Headers", "Authorization, AuthToken");
		Campaign c = content.getSingle().toCampaign();
		CampaignService.save(c);
		
		// Note: It may not be immediately obvious why it is necessary to set the content again. The reason is, 
		// is that the CampaignDto originally in content did not have its id set. CampaignService.save(task) may
		// modify the Campaign.
		content.set(new CampaignDto(c));
		return "create";
	}

}
