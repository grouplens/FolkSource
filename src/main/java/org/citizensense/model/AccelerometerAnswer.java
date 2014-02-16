package org.citizensense.model;

import java.util.Date;

public class AccelerometerAnswer extends Answer {

	public Float x;
	public Float y;
	public Float z;
	
	public AccelerometerAnswer(){
		super();
	}
	
	public AccelerometerAnswer(Integer id, Integer q_id, Integer sub_id, Float x, Float y, Float z){
		super(id, "accelerometer", q_id, sub_id);
		this.x = x;
		this.y = y;
		this.z = z;
	}
	
	public Float getX(){
		return x;
	}
	public void setX(Float x){
		this.x = x;
	}
	public Float getY(){
		return y;
	}
	public void setY(Float y){
		this.y = y;
	}
	public Float getZ(){
		return z;
	}
	public void setZ(Float z){
		this.z = z;
	}
}
