package org.citizensense.controller;

import org.citizensense.model.Task;
import org.citizensense.util.*;
import org.grouplens.common.dto.DtoContainer;

import com.opensymphony.xwork2.ModelDriven;

public class TaskController implements ModelDriven<DtoContainer<Task>>{
	
	DtoContainer<Task> content = new DtoContainer<Task>(Task.class, false);
	//private Collection<Task> list;
	private int id;
	//private Task task = new Task();

	@Override
	public DtoContainer<Task> getModel() {
		return content;
	}
	
	public String show() {
		return "show";
	}
	
//	public void setId(String id) {
//		if (id != null)
//			this.task = TaskService.getTasks().get(Integer.parseInt(id)-1);
//		this.id = Integer.parseInt(id);		
//	}
	public void setId(String id) {
//		if (id != null)
//			this.task = TaskService.getTaskById(Integer.parseInt(id));
		this.id = Integer.parseInt(id);		
	}
	
	public int getId() {
		return this.id;
	}
	
	public String index() {
		content = new DtoContainer<Task>(Task.class, true);
		content.set(TaskService.getTasks());
		return "index";
	}
	
	public String create()
	{
		TaskService.save(content.getSingle());
		return "create";
	}

}
