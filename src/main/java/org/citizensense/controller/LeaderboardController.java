package org.citizensense.controller;


import java.util.Collection;

import javax.servlet.http.HttpServletResponse;

import org.citizensense.model.LeaderboardEntry;
import org.citizensense.util.*;
import org.grouplens.common.dto.DtoContainer;

import com.opensymphony.xwork2.ModelDriven;

import org.apache.struts2.ServletActionContext;
import org.apache.struts2.rest.DefaultHttpHeaders;
import org.apache.struts2.rest.HttpHeaders;

public class LeaderboardController implements ModelDriven<DtoContainer<LeaderboardEntry>>{
	
	private DtoContainer<LeaderboardEntry> content = new DtoContainer<LeaderboardEntry>(LeaderboardEntry.class, false);
	
	@Override
	public DtoContainer<LeaderboardEntry> getModel() {
		return content;
	}
	
//	public HttpHeaders show() {
//		return new DefaultHttpHeaders("show");
//	}
	
//	public void setId(String id) {
//		if (id != null)
//			this.entry = IncentiveService.getIncentives().get(Integer.parseInt(id)-1);
//		this.id = Integer.parseInt(id);		
//	}
//	
//	public int getId() {
//		return this.id;
//	}
	
	public String index() {
		HttpServletResponse res = ServletActionContext.getResponse();
		res.addHeader("Access-Control-Allow-Origin", "*");
		content = new DtoContainer<LeaderboardEntry>(LeaderboardEntry.class, true);
		content.set(LeaderboardService.getLeaderboard());
		//list = LeaderboardService.getLeaderboard();
		return "index";
	}
	
//	public HttpHeaders create()
//	{
//		IncentiveService.save(entry);
//		return new DefaultHttpHeaders("create");
//	}

}
