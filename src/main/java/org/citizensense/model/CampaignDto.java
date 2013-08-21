package org.citizensense.model;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import org.grouplens.common.dto.Dto;

public class CampaignDto extends Dto{
	
	public Long id;
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
		location = c.location;
		start_date = c.start_date;
		end_date = c.end_date;
		start_date_string = c.start_date_string;
		end_date_string = c.end_date_string;
		owner_id = c.owner_id;
		task_id = c.task_id;
		tasks = TaskDto.fromTaskArray(c.tasks);
	}
	public static List<CampaignDto> fromCampaignList(List<Campaign> camps){
		List<CampaignDto> cdtos = new ArrayList<CampaignDto>();
		for (Campaign c : camps){
			cdtos.add(new CampaignDto(c));
		}
		return cdtos;
	}
	
	
	
	public Campaign toCampaign(){
		return new Campaign(id, title, description, location, start_date, end_date, start_date_string, end_date_string, owner_id, task_id, TaskDto.toTaskArray(tasks));
	}

}
