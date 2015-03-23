package org.folksource.controller;

import javax.servlet.http.HttpServletResponse;

import org.apache.struts2.ServletActionContext;
import org.apache.struts2.convention.annotation.Action;
import org.folksource.model.UserDetailDto;
import org.folksource.util.UserService;
import org.grouplens.common.dto.DtoContainer;

import com.opensymphony.xwork2.ActionSupport;
import com.opensymphony.xwork2.ModelDriven;

public class UserdetailController extends ActionSupport implements ModelDriven<DtoContainer<UserDetailDto>> {
	private DtoContainer<UserDetailDto> content = new DtoContainer<UserDetailDto>(UserDetailDto.class, false);

	private int id;
	
	@Override
	public DtoContainer<UserDetailDto> getModel() {
		return content;
	}
	
	public String show() {
		HttpServletResponse res = ServletActionContext.getResponse();
		res.addHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
		res.addHeader("Access-Control-Allow-Origin", "*");
		content.set(new UserDetailDto(UserService.getUserById(id)));
		return "show";//new DefaultHttpHeaders("show");
	}
	
	
	// Handles /submission GET requests
	//public HttpHeaders index() {
	public String index() {
		HttpServletResponse res = ServletActionContext.getResponse();
		res.addHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
		res.addHeader("Access-Control-Allow-Origin", "*");
		content = new DtoContainer<UserDetailDto>(UserDetailDto.class, true);
		content.set(UserDetailDto.fromUserList(UserService.getUsers()));
		
		//return new DefaultHttpHeaders("index").disableCaching();
		return "index";
	}
	
	@Action("test")
	public String test() {
		HttpServletResponse res = ServletActionContext.getResponse();
		res.addIntHeader("YEP", id);
//		res.addHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
//		res.addHeader("Access-Control-Allow-Origin", "*");
		content = new DtoContainer<UserDetailDto>(UserDetailDto.class, true);
		content.set(UserDetailDto.fromUserList(UserService.getUsers()));
		
		//return new DefaultHttpHeaders("index").disableCaching();
		return "s";
	}
	
	public void setId(String id) {
		this.id = Integer.parseInt(id);
	}
	public int getId() {
		return this.id;
	}

}
