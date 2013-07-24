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
		HttpServletResponse res = ServletActionContext.getResponse();
		res.addHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
		res.addHeader("Access-Control-Allow-Origin", "ugly.cs.umn.edu:8080");
		//res.addHeader("Access-Control-Allow-Methods", "GET");
		content.set(CampaignService.getCampaign(id));
		//content.getSingle();
		return "show";
		//return new DefaultHttpHeaders("show").disableCaching();
	}
	
	public void setId(String id) {
//		if (id != null)
//			this.camp = CampaignService.getCampaign(Integer.parseInt(id));
		this.id = Integer.parseInt(id);		
	}
	
	public int getId() {
		return this.id;
	}
	
	public String index() {
		//list = CampaignService.getCampaigns();
		//return new DefaultHttpHeaders("index").disableCaching();
		HttpServletResponse res = ServletActionContext.getResponse();
		res.addHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
		res.addHeader("Access-Control-Allow-Origin", "*");
		content = new DtoContainer<Campaign>(Campaign.class, true);
		content.set(CampaignService.getCampaigns());
		return "index";
	}
	
	public HttpHeaders create()
	{
		HttpServletResponse res = ServletActionContext.getResponse();
		res.addHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
		res.addHeader("Access-Control-Allow-Origin", "*");
		CampaignService.save(content.getSingle());
		return new DefaultHttpHeaders("create");
	}

}
