package org.citizensense.controller;

import org.citizensense.model.Campaign;
import com.opensymphony.xwork2.ModelDriven;
import org.apache.struts2.rest.DefaultHttpHeaders;
import org.apache.struts2.rest.HttpHeaders;

public class CampaignController implements ModelDriven<Campaign>{
	
	Campaign camp = new Campaign();
	/**
	 * @param args
	 */
	public static void main(String[] args) {
		// TODO Auto-generated method stub

	}

	@Override
	public Campaign getModel() {
		// TODO Auto-generated method stub
		return this.camp;
	}
	
	public HttpHeaders show() {
		return new DefaultHttpHeaders("show");
	}
	
	public HttpHeaders index() {
		return new DefaultHttpHeaders("index");
	}

}
