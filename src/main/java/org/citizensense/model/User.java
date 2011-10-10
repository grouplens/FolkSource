package org.citizensense.model;

public class User {
	private int Id;
	private String name;
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
		return points;
	}
	public void setPoints(int points) {
		this.points = points;
	}
}
