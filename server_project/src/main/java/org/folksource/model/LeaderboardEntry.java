package org.folksource.model;

import org.grouplens.common.dto.Dto;

public class LeaderboardEntry extends Dto implements Comparable<LeaderboardEntry> {
	public String name;
	public Integer id;
	public Integer points;

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public Integer getId() {
		return id;
	}

	public void setId(Integer id) {
		this.id = id;
	}

	public Integer getPoints() {
		if(points == null)
			points = 0;
		return points;
	}

	public void setPoints(Integer points) {
		this.points = points;
	}

	@Override
	public int compareTo(LeaderboardEntry arg0) {
		if (this.getPoints() > arg0.getPoints())
			return -1;
		if (this.getPoints() < arg0.getPoints())
			return 1;
		return 0;
	}

}
