package org.citizensense.controller;

import javax.servlet.http.HttpServletResponse;

import org.citizensense.model.Campaign;
import org.citizensense.util.*;
import org.grouplens.common.dto.DtoContainer;

import com.opensymphony.xwork2.ModelDriven;

import org.apache.struts2.ServletActionContext;
import org.apache.struts2.rest.DefaultHttpHeaders;
import org.apache.struts2.rest.HttpHeaders;

public class CampaignController implements ModelDriven<DtoContainer<Campaign>>{
	
	//Campaign camp = new Campaign();
	DtoContainer<Campaign> content = new DtoContainer<Campaign>(Campaign.class, false);
	//private Collection<Campaign> list;
	private int id;

	@Override
	public DtoContainer<Campaign> getModel() {
		return content;
	}
	
	public String show() {
		for (Campaign c : CampaignService.getCampaigns())
			if(c.getId().equals(((Integer)id).longValue()))
				content.set(c);
		//content.getSingle();
		return "show";
		//return new DefaultHttpHeaders("show").disableCaching();
	}
	
	public void setId(String id) {
//		if (id != null)
//			this.camp = CampaignService.getCampaigns(Integer.parseInt(id)).get(0);
		this.id = Integer.parseInt(id);		
	}
	
	public int getId() {
		return this.id;
	}
	
	public String index() {
		//list = CampaignService.getCampaigns();
		//return new DefaultHttpHeaders("index").disableCaching();
		content = new DtoContainer<Campaign>(Campaign.class, true);
		HttpServletResponse res = ServletActionContext.getResponse();
		content.set(CampaignService.getCampaigns());
		res.addHeader("Access-Control-Allow-Origin", "*");
		return "index";
	}
	
	public HttpHeaders create()
	{
		CampaignService.save(content.getSingle());
		return new DefaultHttpHeaders("create");
	}

}
