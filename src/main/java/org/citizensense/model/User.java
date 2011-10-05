package org.citizensense.model;

import java.util.ArrayList;

import javax.persistence.Column;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;

public class User {
	@Column(name="id")
	private int Id;
	@OneToMany(mappedBy="task")
	private ArrayList<Task> tasks;
	
}
