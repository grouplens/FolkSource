package org.citizensense.model;

import org.grouplens.common.dto.Dto;

public class Photo extends Dto{

	public Integer id;
	public String url;
	
	public void setId(Integer id){
		this.id = id;
	}
	public Integer getId(){
		return this.id;
	}
	public void setUrl(String url){
		this.url = url;
	}
	public String getUrl(){
		return this.url;
	}
}
