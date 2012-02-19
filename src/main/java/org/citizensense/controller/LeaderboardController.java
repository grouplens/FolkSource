package org.citizensense.controller;


import java.util.Collection;

import org.citizensense.model.LeaderboardEntry;
import org.citizensense.util.*;

import com.opensymphony.xwork2.ModelDriven;
import org.apache.struts2.rest.DefaultHttpHeaders;
import org.apache.struts2.rest.HttpHeaders;

public class LeaderboardController implements ModelDriven<Object>{
	

	private Collection<LeaderboardEntry> list;
	private LeaderboardEntry entry = new LeaderboardEntry();
	
	
	/**
	 * @param args
	 */
	public static void main(String[] args) {
		// TODO Auto-generated method stub

	}


	@Override
	public Object getModel() {
		return (list != null ? list : entry);
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
	
	public HttpHeaders index() {
		list = LeaderboardService.getLeaderboard();
		return new DefaultHttpHeaders("index").disableCaching();
	}
	
//	public HttpHeaders create()
//	{
//		IncentiveService.save(entry);
//		return new DefaultHttpHeaders("create");
//	}

}
