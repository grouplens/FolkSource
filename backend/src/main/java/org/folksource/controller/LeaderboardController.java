package org.folksource.controller;


import java.util.Collection;

import javax.servlet.http.HttpServletResponse;

import org.folksource.model.LeaderboardEntry;
import org.folksource.util.*;
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
	
	public String index() {
		HttpServletResponse res = ServletActionContext.getResponse();
		res.setHeader("Access-Control-Allow-Origin", "*");
		res.addHeader("Access-Control-Allow-Headers", "Authorization, AuthToken");
		res.addHeader("Access-Control-Expose-Headers", "Authorization, AuthToken");
		content = new DtoContainer<LeaderboardEntry>(LeaderboardEntry.class, true);
		content.set(LeaderboardService.getLeaderboard());
		//list = LeaderboardService.getLeaderboard();
		return "index";
	}

	public String options() {
		HttpServletResponse res = ServletActionContext.getResponse();
		res.setHeader("Access-Control-Allow-Origin", "*");
		res.addHeader("Access-Control-Allow-Headers", "Authorization, AuthToken");
		res.addHeader("Access-Control-Expose-Headers", "Authorization, AuthToken");
		return "options_success";
	}
}
