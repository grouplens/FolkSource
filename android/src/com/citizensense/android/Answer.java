package com.citizensense.android;

import org.json.JSONObject;
import org.w3c.dom.Document;

import android.os.Parcel;
import android.os.Parcelable;

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

	public Answer(){
		
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
	
	/** This CREATOR is used to parcel this Object. */
	public static final Parcelable.Creator<Answer> CREATOR =
        new Parcelable.Creator<Answer>() {
     
		/** Construct and return an Ad from a Parcel*/
		@Override
		public Answer createFromParcel(Parcel in) {
			return new Answer(in);
		}//createFromParcel

		/**
		 * Creates a new array of Adds
		 */
		@Override
		public Answer[] newArray(int size) {
			return new Answer[size];
		}//newArray
	};
	

	public Answer(Parcel in) {
		this.id = in.readInt();
		this.answer = in.readString();
		this.type =in.readString();;
		this.q_id = in.readInt();
		this.sub_id = in.readInt();
	}
	

	@Override
	public void writeToParcel(Parcel out, int arg1) {
		out.writeInt(this.id);
		out.writeString(this.answer);
		out.writeString(this.type);
		out.writeInt(this.q_id);
		out.writeInt(this.sub_id);
	}

	@Override
	public int describeContents() {
		return 0;
	}


}
