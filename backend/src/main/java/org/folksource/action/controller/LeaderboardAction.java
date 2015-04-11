package org.folksource.action.controller;

import javax.servlet.http.HttpServletResponse;

import org.apache.struts2.ServletActionContext;
import org.folksource.action.BaseAction;
//import org.folksource.controller.LeaderboardEntry;
import org.folksource.util.LeaderboardService;
import org.grouplens.common.dto.DtoContainer;

public class LeaderboardAction extends BaseAction{
	public String index() {
		HttpServletResponse res = ServletActionContext.getResponse();
		res.setHeader("Access-Control-Allow-Origin", "*");
		res.addHeader("Access-Control-Allow-Headers", "Authorization, AuthToken");
		res.addHeader("Access-Control-Expose-Headers", "Authorization, AuthToken");
		//content = new DtoContainer<LeaderboardEntry>(LeaderboardEntry.class, true);
		//content.set(LeaderboardService.getLeaderboard());
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
