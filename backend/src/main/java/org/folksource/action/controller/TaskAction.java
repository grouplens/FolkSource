package org.folksource.action.controller;

import javax.servlet.http.HttpServletResponse;

import org.apache.struts2.ServletActionContext;
import org.folksource.action.BaseAction;
import org.folksource.model.TaskDto;
import org.folksource.util.TaskService;
import org.grouplens.common.dto.DtoContainer;

public class TaskAction extends BaseAction{
	public String index() {
		HttpServletResponse res = ServletActionContext.getResponse();
		res.addHeader("Access-Control-Allow-Origin", "*");
		//content = new DtoContainer<TaskDto>(TaskDto.class, true);
		//content.set(TaskDto.fromList(TaskService.getTasks()));
		return "index";
	}
	
	public String create()
	{
		HttpServletResponse res = ServletActionContext.getResponse();
		res.addHeader("Access-Control-Allow-Origin", "*");
        //TODO FIX THIS WHEN DEALING WITH DEFINING CAMPAIGNS
//		Task task = content.getSingle().toTask();
//		TaskService.save(task);
		// Note: It may not be immediately obvious why it is necessary to set the content again. The reason is, is that
		// the TaskDto originally in content did not have its id set. TaskService.save(task) may modify the task.
//		content.set(new TaskDto(task));
		return "create";
	}
}
