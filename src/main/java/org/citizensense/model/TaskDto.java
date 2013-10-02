package org.citizensense.model;

import java.util.ArrayList;
import java.util.List;

import org.grouplens.common.dto.Dto;

public class TaskDto extends Dto{
	
	public Integer id;
	public String name;
	public String instructions;
	public Boolean required;

	public SubmissionDto[] submissions;
	public LocationDto[] locations;
	public Question[] questions;
	
	
	//// Methods that create TaskDtos or collections of TaskDtos
	public TaskDto(){
		super();
	}
	public TaskDto(Task t){
		super();
		id = t.id;
		name = t.name;
		instructions = t.instructions;
		required = t.required;
		if (t.submissions == null){submissions = null;}
		else{submissions = SubmissionDto.fromSubmissionArray(t.submissions);}
		locations = LocationDto.fromLocationArray(t.locations);
		questions = t.questions;
	}
	public static List<TaskDto> fromList(List<Task> tasks){
		List<TaskDto> tdtos = new ArrayList<TaskDto>();
		for (Task t : tasks){
			tdtos.add(new TaskDto(t));
		}
		return tdtos;
	}
	//TODO: the naming of this method and the previous are inconsistent
	public static TaskDto[] fromTaskArray(Task[] tasks){
		TaskDto[] tdtos = new TaskDto[tasks.length];
		for (int i = 0; i < tasks.length; i++) {
			tdtos[i] = new TaskDto(tasks[i]);
		}
		return tdtos;
	}
	
	
	//// Methods that create Tasks or collections of Tasks
	public Task toTask(){
		
		Submission[] subs = null;
		if (submissions != null){
			subs = SubmissionDto.toSubmissionArray(submissions);
		}
		
		Location[] locs = null;
		if (locations != null) {
			locs = LocationDto.toLocationArray(locations);
		}
		
		return new Task(id, name, instructions, required, subs, questions, locs);
	}
	public static Task[] toTaskArray(TaskDto[] tdtos){
		Task[] tasks = new Task[tdtos.length];
		for (int i = 0; i < tasks.length; i++) {
			tasks[i] = tdtos[i].toTask();
		}
		return tasks;
	}
}
