package com.citizensense.android;

import java.util.Date;

import org.json.JSONObject;
import org.w3c.dom.Document;

import android.os.Parcel;

public class ServerSubmission implements Item {
	
	//This submissions unique id
	private int id;
	//The ID of the associated task
	private int task_id;
	//THe ID of the owning user
	private int user_id;
	//The timestamp the submission was made on
	private Date timestamp;
	//The GPS coordinates the submission was made at
	private String[] coords;
	//The Answers associated with the submission
	private Answer[] answers;
	
	
	public ServerSubmission() {
		//There's nothing here!
	}

	@Override
	public int describeContents() {
		// TODO Auto-generated method stub
		return 0;
	}

	@Override
	public void writeToParcel(Parcel dest, int flags) {
		// TODO Auto-generated method stub
		
	}

	@Override
	public String buildXML() {
		//FIXME THIS IS BROKEN
		return null;
	}

	@Override
	public void createFromXML(Document document) {
		// TODO Auto-generated method stub
		
	}

	@Override
	public void createFromXML(String string) {
		// TODO Auto-generated method stub
		
	}

	@Override
	public String buildJSON() {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public void createFromJSON(JSONObject object) {
		// TODO Auto-generated method stub
		
	}

	@Override
	public String getItemName() {
		return "submission";
	}

	public int getId() {
		return id;
	}

	public void setId(int id) {
		this.id = id;
	}

	public int getTask_id() {
		return task_id;
	}

	public void setTask_id(int task_id) {
		this.task_id = task_id;
	}

	public int getUser_id() {
		return user_id;
	}

	public void setUser_id(int user_id) {
		this.user_id = user_id;
	}

	public Date getTimestamp() {
		return timestamp;
	}

	public void setTimestamp(Date timestamp) {
		this.timestamp = timestamp;
	}

	public String[] getCoords() {
		return coords;
	}

	public void setCoords(String[] coords) {
		this.coords = coords;
	}

	public Answer[] getAnswers() {
		return answers;
	}

	public void setAnswers(Answer[] answers) {
		this.answers = answers;
	}

}
