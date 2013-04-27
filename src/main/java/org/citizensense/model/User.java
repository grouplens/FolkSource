package org.citizensense.model;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import org.grouplens.common.dto.Dto;

public class User extends Dto{
	private Integer Id;
	private String name;
	private String password;
    /** The base64 encoded salt value used to hash the password*/
    private String salt;
    private String email;
	private Incentive[] tasks;
	private Integer points;
	private String badges;	
	/** Used to construct the link to find user's password. 
	 * findpwid is hashed value of a string: Id+findpwtime.*/
	private String findpwid;
	/** The time user reports forget password.*/
	private String findpwtime;
	private Double reputation;
	
	public Double getReputation() {
		return reputation;
	}
	
	public void setReputation(Double reputation) {
		this.reputation = reputation;
	}

	public Integer getId() {
		return Id;
	}
	public void setId(Integer id) {
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
	public Integer getPoints() {
		return this.points;
	}
	public void setPoints(Integer points) {
		this.points = points;
	}
	public List<Incentive> getTasks() {
		if(tasks != null)
			return Arrays.asList(tasks);
		
		return new ArrayList<Incentive>();
	}
	public void setTasks(List<Incentive> tasks) {
		this.tasks = tasks.toArray(new Incentive[tasks.size()]);
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
