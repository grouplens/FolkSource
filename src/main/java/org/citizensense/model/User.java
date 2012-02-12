package org.citizensense.model;

import java.util.List;

public class User {
	private int Id;
	private String name;
	private String password;
    /** The base64 encoded salt value used to hash the password*/
    private String salt;
    private String email;
	private List<Incentive> tasks;
	private int points;
	private String badges;	
	/** Used to construct the link to find user's password. 
	 * findpwid is hashed value of a string: Id+findpwtime.*/
	private String findpwid;
	/** The time user reports forget password.*/
	private String findpwtime;

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
	public void setEmail(String email) {
		this.email = email;
	}
	public String getEmail() {
		return email;
	}
	public void setFindpwid(String findpwid) {
		this.findpwid = findpwid;
	}
	public String getFindpwid() {
		return findpwid;
	}
	public void setFindpwtime(String findpwtime) {
		this.findpwtime = findpwtime;
	}
	public String getFindpwtime() {
		return findpwtime;
	}

}
