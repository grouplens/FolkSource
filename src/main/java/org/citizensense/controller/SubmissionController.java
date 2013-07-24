package org.citizensense.controller;

import java.util.Arrays;
import java.util.Date;
import java.util.Map;

import javax.servlet.http.HttpServletResponse;
import org.apache.struts2.ServletActionContext;
import org.citizensense.model.Campaign;
import org.citizensense.model.Submission;
import org.citizensense.util.CampaignService;
import org.citizensense.util.SubmissionService;
import org.grouplens.common.dto.DtoContainer;

import com.opensymphony.xwork2.ModelDriven;

public class SubmissionController implements ModelDriven<DtoContainer<Submission>> {

	//private Collection<Submission> list;
	private int id;
	//private Submission submission = new Submission();

	private DtoContainer<Submission> content = new DtoContainer<Submission>(Submission.class, false);
	
	@Override
	public DtoContainer<Submission> getModel() {
		return content;
	}

	// Handles /submission/{id} GET requests
	public String show() {
		HttpServletResponse res = ServletActionContext.getResponse();
		res.addHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
		res.addHeader("Access-Control-Allow-Origin", "*");
		for (Submission s : SubmissionService.getSubmissions()) {
			if(s.getId().equals(id))
				content.set(s);
		}
		return "show";//new DefaultHttpHeaders("show");
	}

	public void setId(String id) {
		//if (id != null)
		//	for (Submission s : SubmissionService.getSubmissions()) {
		//		if (s.getId() == Integer.parseInt(id))
		//			this.submission = s;
		//	}
		// SubmissionService.getSubmissions()..get(Integer.parseInt(id)-1);
		this.id = Integer.parseInt(id);
	}

	public int getId() {
		return this.id;
	}

	// Handles /submission GET requests
	//public HttpHeaders index() {
	public String index() {
		
		HttpServletResponse res = ServletActionContext.getResponse();
		res.addHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
		res.addHeader("Access-Control-Allow-Origin", "*");
		content = new DtoContainer<Submission>(Submission.class, true);
		Map<String, String[]> paramMap = ServletActionContext.getRequest().getParameterMap();
		
		if (paramMap.get("after") != null){
			content.set(SubmissionService.getSubmissionsAfter(paramMap.get("after")[0]));
		} else {
			content.set(SubmissionService.getSubmissions());
		}
		//return new DefaultHttpHeaders("index").disableCaching();
		return "index";
	}
	
	public String create() {
		HttpServletResponse res = ServletActionContext.getResponse();
		res.addHeader("Access-Control-Allow-Origin", "*");
		res.addHeader("Access-Control-Allow-Headers", "Cache-Control");
//		res.addHeader("Access-Control-Expose-Headers", "X-Points");
//		res.addHeader("Access-Control-Expose-Headers", "X-Uid");
		res.addIntHeader("X-Points", SubmissionService.getSubUser(content.getSingle()).getPoints());
		SubmissionService.save(content.getSingle());
		return "create";//new DefaultHttpHeaders("create");
	}
	
	/*
	 * REVISIT THIS WHEN WE DEPLOY TO REAL DEVICES, NEEDED FOR NOW ON iOS
	 */
	public String options() {
		HttpServletResponse res = ServletActionContext.getResponse();
		res.addHeader("Allow", "*");
		res.addHeader("Access-Control-Allow-Origin", "*");
//		res.addHeader("Access-Control-Expose-Headers", "X-Points");
//		res.addHeader("Access-Control-Expose-Headers", "X-Uid");
////		res.addHeader("Access-Control-Allow-Methods", "GET, POST");
//		res.addHeader("Access-Control-Allow-Headers", "X-Points");
//		res.addHeader("Access-Control-Allow-Headers", "X-Uid");
		res.addHeader("Access-Control-Allow-Headers", "Content-Type");
		res.addHeader("Access-Control-Allow-Headers", "Cache-Control");
		return "options_success";
	}
	
//	 public String create() {
//		HttpServletRequest req = ServletActionContext.getRequest();
//	 	HttpServletResponse res = ServletActionContext.getResponse();
//	 	if (submission != null && SubmissionService.save(submission)) {
//	 		res.setStatus(HttpServletResponse.SC_OK);
//	 		return "post_submission_success";
//	 	} else {
//	 		res.setStatus(400);
//	 		return "post_submission_fail";
//	 	}
//	 }
}
