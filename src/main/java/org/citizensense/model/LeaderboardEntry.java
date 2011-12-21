package org.citizensense.model;

public class LeaderboardEntry implements Comparable<LeaderboardEntry>{
	private String name;
	private int id;
	private int points;
	
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	public int getId() {
		return id;
	}
	public void setId(int id) {
		this.id = id;
	}
	public int getPoints() {
		return points;
	}
	public void setPoints(int points) {
		this.points = points;
	}
	
	@Override
	public int compareTo(LeaderboardEntry arg0) {
		if(this.getPoints() < arg0.getPoints())
			return -1;
		else if(this.getPoints() > arg0.getPoints())
			return 1;
		else
			return 0;
	}
	
}
