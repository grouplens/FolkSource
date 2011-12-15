package org.citizensense.controller;


import java.util.Collection;

import org.citizensense.model.Task;
import org.citizensense.util.*;

import com.opensymphony.xwork2.ModelDriven;
import org.apache.struts2.rest.DefaultHttpHeaders;
import org.apache.struts2.rest.HttpHeaders;

public class TaskController implements ModelDriven<Object>{
	

	private Collection<Task> list;
	private int id;
	private Task task = new Task();
	
	
	/**
	 * @param args
	 */
	public static void main(String[] args) {
		// TODO Auto-generated method stub

	}


	@Override
	public Object getModel() {
		return (list != null ? list : task);
	}
	
	public HttpHeaders show() {
		return new DefaultHttpHeaders("show");
	}
	
	public void setId(String id) {
		if (id != null)
			this.task = TaskService.getTasks().get(Integer.parseInt(id)-1);
		this.id = Integer.parseInt(id);		
	}
	
	public int getId() {
		return this.id;
	}
	
	public HttpHeaders index() {
		list = TaskService.getTasks();
		return new DefaultHttpHeaders("index").disableCaching();
	}
	
	public HttpHeaders create()
	{
		TaskService.save(task);
		return new DefaultHttpHeaders("create");
	}

}
