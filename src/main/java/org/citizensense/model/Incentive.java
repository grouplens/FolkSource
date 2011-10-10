package org.citizensense.model;

import javax.persistence.OneToMany;

public abstract class Incentive {
	private String type;
	private int id;
	@OneToMany(mappedBy="incentive")
	private int task_id;
	private String value;

	public String getType() {
		return type;
	}

	public void setType(String type) {
		this.type = type;
	}
	
	public abstract void  setValue(String value);
	public abstract String getValue();
	
	

}
