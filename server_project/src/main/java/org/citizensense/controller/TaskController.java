package org.citizensense.controller;

import javax.servlet.http.HttpServletResponse;

import org.apache.struts2.ServletActionContext;
import org.citizensense.model.Task;
import org.citizensense.util.*;
import org.grouplens.common.dto.DtoContainer;

import com.opensymphony.xwork2.ModelDriven;

public class TaskController implements ModelDriven<DtoContainer<Task>>{
	
	DtoContainer<Task> content = new DtoContainer<Task>(Task.class, false);
	//private Collection<Task> list;
	public Integer id;
	//private Task task = new Task();

	@Override
	public DtoContainer<Task> getModel() {
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
		content = new DtoContainer<Task>(Task.class, true);
		content.set(TaskService.getTasks());
		return "index";
	}
	
	public String create()
	{
		HttpServletResponse res = ServletActionContext.getResponse();
		res.addHeader("Access-Control-Allow-Origin", "*");
		TaskService.save(content.getSingle());
		return "create";
	}

}
