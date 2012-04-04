package com.citizensense.android;

import org.json.JSONObject;
import org.w3c.dom.Document;

import android.os.Parcel;

public class Answer implements Item {
	
	//The unique ID of this Answer
	private int id;
	//The actual response
	private String answer;
	//The type of response
	private String type;
	//The ID of the question associated with this answer
	private int q_id;
	//The ID of the submission associated with this answer
	private int sub_id;

	@Override
	public int describeContents() {
		// TODO Auto-generated method stub
		return 0;
	}

	@Override
	public void writeToParcel(Parcel arg0, int arg1) {
		// TODO Auto-generated method stub

	}

	@Override
	public String buildXML() {
		// TODO Auto-generated method stub
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
		// TODO Auto-generated method stub
		return null;
	}

	public int getId() {
		return id;
	}

	public void setId(int id) {
		this.id = id;
	}

	public String getAnswer() {
		return answer;
	}

	public void setAnswer(String answer) {
		this.answer = answer;
	}

	public String getType() {
		return type;
	}

	public void setType(String type) {
		this.type = type;
	}

	public int getQ_id() {
		return q_id;
	}

	public void setQ_id(int q_id) {
		this.q_id = q_id;
	}

	public int getSub_id() {
		return sub_id;
	}

	public void setSub_id(int sub_id) {
		this.sub_id = sub_id;
	}

}
