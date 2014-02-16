package org.citizensense.model;

public class MediaAnswer extends Answer {

	public String path;
	public String mimeType;
	
	public MediaAnswer(){
		super();
	}
	
	public MediaAnswer(Integer id, Integer q_id, Integer sub_id, String path, String mimeType) {
		super(id, "media", q_id, sub_id);
		this.path = path;
		this.mimeType = mimeType;
	}
	
	public String getPath(){
		return path;
	}
	
	public void setPath(String path){
		this.path = path;
	}
	public String getMimeType(){
		return mimeType;
	}
	public void setMimeType(String t){
		this.mimeType = t;
	}

}
