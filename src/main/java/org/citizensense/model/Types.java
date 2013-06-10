package org.citizensense.model;

public class Types {
	public Integer id;
	public String type;
	public String lower_bound;
	public String upper_bound;
	public String categories;
	public Integer getId() {
		return id;
	}
	public void setId(Integer id) {
		this.id = id;
	}
	public String getType() {
		return type;
	}
	public void setType(String type) {
		this.type = type;
	}
	public String getLower_bound() {
		return lower_bound;
	}
	public void setLower_bound(String lower_bound) {
		this.lower_bound = lower_bound;
	}
	public String getUpper_bound() {
		return upper_bound;
	}
	public void setUpper_bound(String upper_bound) {
		this.upper_bound = upper_bound;
	}
	public String getCategories() {
		return categories;
	}
	public void setCategories(String categories) {
		this.categories = categories;
	}
	
	
}
