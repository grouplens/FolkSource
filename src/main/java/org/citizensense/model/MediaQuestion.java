package org.citizensense.model;

public class MediaQuestion extends Question {

	public String media_type;
	public Integer size_limit; //if 0, no limit. Otherwise, limit in MBs
	
	public MediaQuestion(){
		super();
		this.type = "media";
		this.media_type = "";
		this.size_limit = 0;
	}
	
	public MediaQuestion(Integer id, Integer task_id, String question, Boolean required, Boolean revisable,
			Integer time_limit, Answer answer, String media_type, Integer size_limit) {
		super(id, task_id, question, "media", required, revisable, time_limit, answer);
		this.media_type = media_type;
		this.size_limit = size_limit;
	} 
	
	public String getMedia_type(){
		return media_type;
	}
	
	public void setMedia_type(String media_type){
		this.media_type = media_type;
	}
	
	public Integer getSize_limit(){
		return size_limit;
	}
	
	public void setSize_limit(Integer size_limit){
		this.size_limit = size_limit;
	}
	
}