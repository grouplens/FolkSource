package org.citizensense.controller;


import java.util.Collection;

import org.citizensense.model.Incentive;
import org.citizensense.util.*;

import com.opensymphony.xwork2.ModelDriven;
import org.apache.struts2.rest.DefaultHttpHeaders;
import org.apache.struts2.rest.HttpHeaders;

public class IncentiveController implements ModelDriven<Object>{
	

	private Collection<Incentive> list;
	private int id;
	private Incentive inc = new Incentive();
	
	
	/**
	 * @param args
	 */
	public static void main(String[] args) {
		// TODO Auto-generated method stub

	}


	@Override
	public Object getModel() {
		return (list != null ? list : inc);
	}
	
	public HttpHeaders show() {
		return new DefaultHttpHeaders("show");
	}
	
	public void setId(String id) {
		if (id != null)
			this.inc = IncentiveService.getIncentives().get(Integer.parseInt(id)-1);
		this.id = Integer.parseInt(id);		
	}
	
	public int getId() {
		return this.id;
	}
	
	public HttpHeaders index() {
		list = IncentiveService.getIncentives();
		return new DefaultHttpHeaders("index").disableCaching();
	}
	
	public HttpHeaders create()
	{
		IncentiveService.save(inc);
		return new DefaultHttpHeaders("create");
	}

}
