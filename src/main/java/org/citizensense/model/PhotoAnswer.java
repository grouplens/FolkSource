package org.citizensense.model;

public class PhotoAnswer extends Answer {

	public String path;
	
	public PhotoAnswer(){
		super();
	}
	
	public PhotoAnswer(Integer id, String answer_type, Integer q_id, Integer sub_id, String path) {
		super(id, answer_type, q_id, sub_id);
		this.path = path;
	}

}
