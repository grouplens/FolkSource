package org.folksource.controller;


import java.util.ArrayList;
import java.util.List;

import javax.servlet.http.HttpServletResponse;

import org.apache.struts2.ServletActionContext;
import org.folksource.model.Question;
import org.folksource.model.QuestionDto;
import org.folksource.util.*;
import org.grouplens.common.dto.DtoContainer;

import com.opensymphony.xwork2.ModelDriven;

public class QuestionController implements ModelDriven<DtoContainer<QuestionDto>>{
	
	DtoContainer<QuestionDto> content = new DtoContainer<QuestionDto>(QuestionDto.class, true);
	public Integer id;

	@Override
	public DtoContainer<QuestionDto> getModel() {
		return content;
	}
	public String show() {
		return "show";
	}
	public void setId(Integer id) {
		this.id = id;		
	}
	public Integer getId() {
		return this.id;
	}
	
	
	
	public String index() {
		HttpServletResponse res = ServletActionContext.getResponse();
		res.addHeader("Access-Control-Allow-Origin", "*");
		content = new DtoContainer<QuestionDto>(QuestionDto.class, true);
		content.set(QuestionDto.fromList(QuestionService.getQuestions()));
		return "index";
	}
	
	public String create()
	{
		HttpServletResponse res = ServletActionContext.getResponse();
		res.addHeader("Access-Control-Allow-Origin", "*");
		List<QuestionDto> questions = content.get();
		List<Question> questionsTwo = new ArrayList<Question>();
		for(QuestionDto q : questions) {
			Question ques = q.toQuestion();
			QuestionService.save(ques);
			questionsTwo.add(ques);
		}
		// Note: It may not be immediately obvious why it is necessary to set the content again. The reason is, is that
		// the QuestionDtos originally in content did not have its id set. QuestionService.save() modifies at least the id field
		content.set(QuestionDto.fromList(questionsTwo));
		return "create";
	}

}
