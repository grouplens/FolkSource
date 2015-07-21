package org.folksource.action.controller;

import java.util.ArrayList;
import java.util.List;

import javax.servlet.http.HttpServletResponse;

import org.apache.struts2.ServletActionContext;
import org.folksource.action.BaseAction;
//import org.folksource.controller.Question;
//import org.folksource.controller.QuestionDto;

import org.grouplens.common.dto.DtoContainer;

public class QuestionAction extends BaseAction{
	public String index() {
		HttpServletResponse res = ServletActionContext.getResponse();
		res.addHeader("Access-Control-Allow-Origin", "*");
		//content = new DtoContainer<QuestionDto>(QuestionDto.class, true);
		//content.set(QuestionDto.fromList(QuestionService.getQuestions()));
		return "index";
	}
	
	public String create()
	{
		HttpServletResponse res = ServletActionContext.getResponse();
		res.addHeader("Access-Control-Allow-Origin", "*");
		//List<QuestionDto> questions = content.get();
		//List<Question> questionsTwo = new ArrayList<Question>();
		//for(QuestionDto q : questions) {
		//	Question ques = q.toQuestion();
		//	QuestionService.save(ques);
		//	questionsTwo.add(ques);
		//}
		// Note: It may not be immediately obvious why it is necessary to set the content again. The reason is, is that
		// the QuestionDtos originally in content did not have its id set. QuestionService.save() modifies at least the id field
		//content.set(QuestionDto.fromList(questionsTwo));
		return "create";
	}
}
