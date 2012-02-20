package org.citizensense.controller;

import java.util.Collection;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.struts2.ServletActionContext;
import org.apache.struts2.rest.DefaultHttpHeaders;
import org.apache.struts2.rest.HttpHeaders;
import org.citizensense.model.Submission;
import org.citizensense.util.SubmissionService;

import com.opensymphony.xwork2.ModelDriven;

public class SubmissionController implements ModelDriven<Object> {

	private Collection<Submission> list;
	private int id;
	private Submission submission = new Submission();

	@Override
	public Object getModel() {
		return (list != null ? list : submission);
	}

	// Handles /submission/{id} GET requests
	public HttpHeaders show() {
		return new DefaultHttpHeaders("show");
	}

	public void setId(String id) {
		if (	id != null)
			for (Submission s : SubmissionService.getSubmissions()) {
				if (s.getId() == Integer.parseInt(id))
					this.submission = s;
			}
		// SubmissionService.getSubmissions()..get(Integer.parseInt(id)-1);
		this.id = Integer.parseInt(id);
	}

	public int getId() {
		return this.id;
	}

	// Handles /submission GET requests
	public HttpHeaders index() {
		list = SubmissionService.getSubmissions();
		return new DefaultHttpHeaders("index").disableCaching();
	}
	public HttpHeaders create() {
		SubmissionService.save(submission);
		return new DefaultHttpHeaders("create");
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
