package org.folksource.entities;

import java.io.Serializable;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name="folksource_users", schema="public")
public class User implements Serializable{

	private static final long serialVersionUID = 1L;

	@Id
	@Column(name = "id")
	private int id;

	@Column(name = "name")
	private String name;
	
	@Column(name = "password")
	private String password;
	
	@Column(name = "points")
	private Integer points;
	
	@Column(name = "badges")
	private String badges;
	
	@Column(name = "salt")
	private String salt;
	
	@Column(name = "email")
	private String email;

	@Column(name = "findpwid")
	private String findpwid;
	
	@Column(name = "findpwtime")
	private String findpwtime;
	
	@Column(name = "token")
	private Integer token;
	
	@Column(name = "token_oauth_wiki")
	private String wikiToken;
	
	public int getId() {
		return id;
	}

	public void setId(int id) {
		this.id = id;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getPassword() {
		return password;
	}

	public void setPassword(String password) {
		this.password = password;
	}

	public Integer getPoints() {
		return points;
	}

	public void setPoints(Integer points) {
		this.points = points;
	}

	public String getBadges() {
		return badges;
	}

	public void setBadges(String badges) {
		this.badges = badges;
	}

	public String getSalt() {
		return salt;
	}

	public void setSalt(String salt) {
		this.salt = salt;
	}

	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	public String getFindpwid() {
		return findpwid;
	}

	public void setFindpwid(String findpwid) {
		this.findpwid = findpwid;
	}

	public String getFindpwtime() {
		return findpwtime;
	}

	public void setFindpwtime(String findpwtime) {
		this.findpwtime = findpwtime;
	}

	public Integer getToken() {
		return token;
	}

	public void setToken(Integer token) {
		this.token = token;
	}

	public String getWikiToken() {
		return wikiToken;
	}

	public void setWikiToken(String wikiToken) {
		this.wikiToken = wikiToken;
	}


	
}
