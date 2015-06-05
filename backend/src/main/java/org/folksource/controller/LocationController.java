package org.folksource.controller;

import java.util.List;

import javax.servlet.http.HttpServletResponse;
import org.apache.struts2.ServletActionContext;
import org.folksource.model.LocationDto;
import org.folksource.util.LocationService;
import org.grouplens.common.dto.DtoContainer;

import com.opensymphony.xwork2.ModelDriven;

public class LocationController implements ModelDriven<DtoContainer<LocationDto>> {

	private int id;

	private DtoContainer<LocationDto> content = new DtoContainer<LocationDto>(LocationDto.class, true);
	
	@Override
	public DtoContainer<LocationDto> getModel() {
		return content;
	}

	public void setId(String id) {
		this.id = Integer.parseInt(id);
	}

	public int getId() {
		return this.id;
	}


	public String create() {
		HttpServletResponse res = ServletActionContext.getResponse();
		res.addHeader("Access-Control-Allow-Origin", "*");
		res.addHeader("Access-Control-Allow-Headers", "Cache-Control");
		List<LocationDto> locs = content.get();
		for(LocationDto l : locs) {
			LocationService.save(l.toLocation());
		}
		return "create";
	}
	
	/*
	 * REVISIT THIS WHEN WE DEPLOY TO REAL DEVICES, NEEDED FOR NOW ON iOS
	 */
	public String options() {
		HttpServletResponse res = ServletActionContext.getResponse();
		res.addHeader("Allow", "*");
		res.addHeader("Access-Control-Allow-Origin", "*");
		res.addHeader("Access-Control-Allow-Headers", "Content-Type");
		res.addHeader("Access-Control-Allow-Headers", "Cache-Control");
		return "options_success";
	}
	
}
