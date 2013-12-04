package org.citizensense.controller;

import java.util.Map;

import javax.servlet.http.HttpServletResponse;

import org.apache.struts2.ServletActionContext;
import org.citizensense.model.SubmissionDto;
import org.citizensense.model.Submission;
import org.citizensense.util.HibernateUtil;
import org.citizensense.util.SubmissionService;
import org.grouplens.common.dto.DtoContainer;
import org.hibernate.Session;

import com.opensymphony.xwork2.ModelDriven;

public class SubmissionController implements ModelDriven<DtoContainer<SubmissionDto>>{

	private DtoContainer<SubmissionDto> content = new DtoContainer<SubmissionDto>(SubmissionDto.class, false);
	
	private int id;
	
	@Override
	public DtoContainer<SubmissionDto> getModel() {
		return content;
	}

	public String create() {
		
		HttpServletResponse res = ServletActionContext.getResponse();
		
		res.addHeader("Access-Control-Allow-Origin", "*");
		res.addHeader("Access-Control-Allow-Headers", "Cache-Control");
		
		SubmissionDto subDto = content.getSingle();
		Submission s = subDto.toSubmission();
				
		res.addIntHeader("X-Points", SubmissionService.getSubUser(s).getPoints());
				
		SubmissionService.save(s);
		
		// SubmissionService.save updates the submission object with the id that the db has assigned
		// to the object. We return a new SubmissionDto based on the updated submission object.
		content.set(new SubmissionDto(s));
		
		return "create";
	}
	
	// Handles /submission/{id} GET requests
	public String show() {
		Session session = HibernateUtil.getSession(true);
		HttpServletResponse res = ServletActionContext.getResponse();
		res.addHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
		res.addHeader("Access-Control-Allow-Origin", "*");
		content.set(new SubmissionDto(SubmissionService.getSubmission(id, session)));
		return "show";//new DefaultHttpHeaders("show");
	}
	
	
	// Handles /submission GET requests
	//public HttpHeaders index() {
	public String index() {
		
		HttpServletResponse res = ServletActionContext.getResponse();
		res.addHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
		res.addHeader("Access-Control-Allow-Origin", "*");
		content = new DtoContainer<SubmissionDto>(SubmissionDto.class, true);
		Map<String, String[]> paramMap = ServletActionContext.getRequest().getParameterMap();
		Session session = HibernateUtil.getSession(true);
		if (paramMap.get("after") != null){
			content.set(SubmissionDto.fromSubmissionList(SubmissionService.getSubmissionsAfter(paramMap.get("after")[0], session)));
		} else {
			content.set(SubmissionDto.fromSubmissionList(SubmissionService.getSubmissions(session)));
		}
		
		//return new DefaultHttpHeaders("index").disableCaching();
		return "index";
	}
	
	
	public void setId(String id) {
		this.id = Integer.parseInt(id);
	}
	public int getId() {
		return this.id;
	}
	
}
