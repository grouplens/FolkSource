package org.citizensense.controller;

import java.util.Collection;

import org.citizensense.model.Campaign;
import org.citizensense.util.*;

import com.opensymphony.xwork2.ModelDriven;
import org.apache.struts2.rest.DefaultHttpHeaders;
import org.apache.struts2.rest.HttpHeaders;

public class CampaignController implements ModelDriven<Object>{
	
	Campaign camp = new Campaign();
	private Collection<Campaign> list;
	private int id;

	@Override
	public Object getModel() {
		return (list != null ? list : camp);
	}
	
	public HttpHeaders show() {
		return new DefaultHttpHeaders("show").disableCaching();
	}
	
	public void setId(String id) {
		if (id != null)
			this.camp = CampaignService.getCampaigns(Integer.parseInt(id)).get(0);
		//this.id = Integer.parseInt(id);		
	}
	
	public int getId() {
		return this.id;
	}
	
	public HttpHeaders index() {
		list = CampaignService.getCampaigns();
		return new DefaultHttpHeaders("index").disableCaching();
	}
	
	public HttpHeaders create()
	{
		CampaignService.save(camp);
		return new DefaultHttpHeaders("create");
	}

}
