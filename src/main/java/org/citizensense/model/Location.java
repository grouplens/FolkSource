package org.citizensense.model;

public class Location {
	private long[] loc = new long[2];
	
	public long[] getLocation() {
		return this.loc;
	}
	public void setLocation(long latitude, long longitude) {
		this.loc[0] = latitude;
		this.loc[1] = longitude;
	}
}


