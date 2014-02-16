package org.citizensense.controller;

import java.util.Map;

import javax.servlet.http.HttpServletResponse;

import org.apache.struts2.ServletActionContext;
import org.citizensense.model.QuestionDto;
import org.citizensense.model.Question;
import org.citizensense.util.QuestionService;
import org.grouplens.common.dto.DtoContainer;

import com.opensymphony.xwork2.ModelDriven;

public class QuestionController implements ModelDriven<DtoContainer<QuestionDto>>{

	private DtoContainer<QuestionDto> content = new DtoContainer<QuestionDto>(QuestionDto.class, false);
	
	private int id;
	
	@Override
	public DtoContainer<QuestionDto> getModel() {
		return content; 
	}

	public String create() {
		
		HttpServletResponse res = ServletActionContext.getResponse();
		
		res.addHeader("Access-Control-Allow-Origin", "*");
		res.addHeader("Access-Control-Allow-Headers", "Cache-Control");
		
		QuestionDto qDto = content.getSingle();
		Question q = qDto.toQuestion();
				
		QuestionService.save(q);
		
		content.set(new QuestionDto(q));
		
		return "create";
	}
	
	// Handles /submission/{id} GET requests
	public String show() {
		HttpServletResponse res = ServletActionContext.getResponse();
		res.addHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
		res.addHeader("Access-Control-Allow-Origin", "*");
		content.set(new QuestionDto(QuestionService.getQuestion(id)));
		return "show";//new DefaultHttpHeaders("show");
	}
	
	
	// Handles /submission GET requests
	//public HttpHeaders index() {
	public String index() {
		
		HttpServletResponse res = ServletActionContext.getResponse();
		res.addHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
		res.addHeader("Access-Control-Allow-Origin", "*");
		content = new DtoContainer<QuestionDto>(QuestionDto.class, true);
		Map<String, String[]> paramMap = ServletActionContext.getRequest().getParameterMap();
		
		content.set(QuestionDto.fromQuestionList(QuestionService.getQuestions()));
	
		return "index";
	}
	
	
	public void setId(String id) {
		this.id = Integer.parseInt(id);
	}
	public int getId() {
		return this.id;
	}
	
}
