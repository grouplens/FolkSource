package org.folksource.controller;

import java.util.List;

import javax.servlet.http.HttpServletResponse;

import org.apache.struts2.ServletActionContext;
import org.folksource.model.Task;
import org.folksource.model.TaskDto;
import org.folksource.util.*;
import org.grouplens.common.dto.DtoContainer;
import org.hibernate.Session;

import com.opensymphony.xwork2.ModelDriven;

public class TaskController implements ModelDriven<DtoContainer<TaskDto>>{
	
	DtoContainer<TaskDto> content = new DtoContainer<TaskDto>(TaskDto.class, false);
	public Integer id;

	@Override
	public DtoContainer<TaskDto> getModel() {
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
		content = new DtoContainer<TaskDto>(TaskDto.class, true);
		content.set(TaskDto.fromList(TaskService.getTasks()));
		return "index";
	}
	
	public String create()
	{
		HttpServletResponse res = ServletActionContext.getResponse();
		res.addHeader("Access-Control-Allow-Origin", "*");
		Task task = content.getSingle().toTask();
		TaskService.save(task);
		// Note: It may not be immediately obvious why it is necessary to set the content again. The reason is, is that
		// the TaskDto originally in content did not have its id set. TaskService.save(task) may modify the task.
		content.set(new TaskDto(task));
		return "create";
	}

}
