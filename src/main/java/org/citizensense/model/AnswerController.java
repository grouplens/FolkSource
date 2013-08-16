package org.citizensense.model;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.struts2.ServletActionContext;
import org.citizensense.util.AnswerService;
import org.citizensense.util.SubmissionService;
import org.grouplens.common.dto.DtoContainer;

import com.opensymphony.xwork2.ModelDriven;

public class AnswerController implements ModelDriven<DtoContainer<AnswerDto>>{

	private DtoContainer<AnswerDto> content = new DtoContainer<AnswerDto>(AnswerDto.class, false); 
	
	@Override
	public DtoContainer<AnswerDto> getModel() {
		return content;
	}
	
	public String create() {
		
		HttpServletRequest req = ServletActionContext.getRequest();
		
		//Build Answer object from Request here!
		
		Answer a = null;		
		AnswerService.save(a);
		content.set(new AnswerDto(a));
		return "create";
	}

}
