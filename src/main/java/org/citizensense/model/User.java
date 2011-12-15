package org.citizensense.model;

import java.util.List;

public class User {
	private int Id;
	private String name;
	private String password;
    /** The base64 encoded salt value used to hash the password*/
    private String salt;
	private List<Incentive> tasks;
	private int points;
	private String badges;

	public int getId() {
		return Id;
	}
	public void setId(int id) {
		Id = id;
	}
	public String getBadges() {
		return badges;
	}
	public void setBadges(String badges) {
		this.badges = badges;
	}
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	public int getPoints() {
		return this.points;
	}
	public void setPoints(int points) {
		this.points = points;
	}
	public List<Incentive> getTasks() {
		return tasks;
	}
	public void setTasks(List<Incentive> tasks) {
		this.tasks = tasks;
	}
	public void setPassword(String password) {
		this.password = password;
	}
	public String getPassword() {
		return password;
	}
	public void setSalt(String salt) {
		this.salt = salt;
	}
	public String getSalt() {
		return salt;
	}
}
