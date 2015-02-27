package org.folksource.model;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Date;
import java.util.LinkedHashSet;
import java.util.List;

import org.grouplens.common.dto.Dto;

public class CampaignDto extends Dto{
	
	public Integer id;
	public String title;
	public String description;
	public String location;
	public Date start_date;
	public Date end_date;
	public String start_date_string;
	public String end_date_string;
	public Integer owner_id;
	public Integer task_id;

	public TaskDto[] tasks;
	
	public CampaignDto(){
		super();
	}
	public CampaignDto(Campaign c){
		super();
		id = c.id;
		title = c.title;
		description = c.description;
//		location = c.location;
		start_date = c.start_date;
		end_date = c.end_date;
		start_date_string = c.start_date_string;
		end_date_string = c.end_date_string;
		owner_id = c.owner_id;
		task_id = c.task_id;
		if (c.tasks == null){tasks = null;}
		else {tasks = TaskDto.fromTaskArray(c.tasks.toArray(new Task[c.tasks.size()]));}
	}
	public static List<CampaignDto> fromCampaignList(List<Campaign> camps){
		List<CampaignDto> cdtos = new ArrayList<CampaignDto>();
		for (Campaign c : camps){
			cdtos.add(new CampaignDto(c));
		}
		return cdtos;
	}
	
	
	
	public Campaign toCampaign(){
		Task[] ts = null;
		if (tasks != null) {ts = TaskDto.toTaskArray(tasks);}
		return new Campaign(id, title, description, location, start_date, end_date, start_date_string, end_date_string, owner_id, task_id, new LinkedHashSet<Task>(Arrays.asList(ts)));
	}

}
