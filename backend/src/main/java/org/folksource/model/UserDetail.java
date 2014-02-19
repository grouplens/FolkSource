package org.folksource.model;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import org.grouplens.common.dto.Dto;

public class UserDetail extends Dto{
	public Integer Id;
	public String name;
    public String email;
	public Integer points;

	public Integer getId() {
		return Id;
	}
	public void setId(Integer id) {
		Id = id;
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
	public void setEmail(String email) {
		this.email = email;
	}
	public String getEmail() {
		return email;
	}
}
