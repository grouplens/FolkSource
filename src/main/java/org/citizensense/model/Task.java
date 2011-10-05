package org.citizensense.model;

import javax.persistence.Column;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;

public class Task {
	@Column(name="name")
	private String name;
	@Column(name="instructions")
	private String instructions;
	@Column(name="requirements")
	private String requirements; // possibly wrong datatype, but for now
	private Form form;
	private Location loc;
	@Column(name="id")
	private int ID;

	@ManyToOne
	@JoinColumn(name="campaign_id", nullable=false)
	private Campaign camp;
	
	@ManyToOne
	@JoinColumn(name="user_id", nullable=false)
	
	@Column(name="incentive")
	private Incentive incentive;

	public Location getLocation() {
		return loc;
	}

	public void setLocation(Location loc) {
		this.loc = loc;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getInstructions() {
		return instructions;
	}

	public void setInstructions(String instructions) {
		this.instructions = instructions;
	}

	public String getRequirements() {
		return requirements;
	}

	public void setRequirements(String requirements) {
		this.requirements = requirements;
	}

	public Form getForm() {
		return form;
	}

	public void setForm(Form form) {
		this.form = form;
	}
}
