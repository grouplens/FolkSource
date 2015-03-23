package org.folksource.model;

public  class LocationLayer {
	private String name;
	private int id;
	private int task_id;

	public LocationLayer() {
		
	}

	public String getName() {
		return name;
	}

	public void setName(String type) {
		this.name = type;
	}

	public int getTask_id() {
		return task_id;
	}

	public void setTask_id(int task_id) {
		this.task_id = task_id;
	}

	public int getId() {
		return id;
	}

	public void setId(int id) {
		this.id = id;
	}

}
