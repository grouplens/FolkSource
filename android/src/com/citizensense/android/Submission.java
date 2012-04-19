package com.citizensense.android;

import java.util.ArrayList;
import java.util.Date;

import org.json.JSONObject;
import org.w3c.dom.Document;
import org.xml.sax.SAXException;

import android.content.Context;
import android.os.Parcel;
import android.os.Parcelable;
import android.util.Log;
import android.util.Xml;

import com.citizensense.android.net.GetRequest;
import com.citizensense.android.net.XMLResponseHandler;
import com.citizensense.android.parsers.SubmissionParser;

public class Submission implements Item, Comparable<Submission> {
	
	public String xml;
	/**This submissions unique id*/
	private int id;
	/**The ID of the associated task*/
	private int task_id;
	/**THe ID of the owning user*/
	private int user_id;
	/**The timestamp the submission was made on*/
	private Date timestamp;
	/**The GPS coordinates the submission was made at*/
	private String[] coords;
	/**The user's gps coordinates*/
	private String[] myCoords;
	/**The Answers associated with the submission*/
	private Answer[] answers;
	/** The points earned for submission*/
	//FIXME: set this to 1 point now, should get from server
	private int points = 1;
	/** The path of the image on the server*/
	//FIXME: get this from server
	private String imageUrl = "http://www-users.cs.umn.edu/~ryu/CitizenSense/bikerack.jpg";
	
	public Submission(String xml) {
		this.xml = xml;
	}
	
	public Submission() {
		//there's nothing here
	}


	@Override
	public String buildXML() {
		return this.xml;
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

	public void setMyCoords(String[] myCoords) {
		this.myCoords = myCoords;
	}

	public String[] getMyCoords() {
		return myCoords;
	}
	
	/** This CREATOR is used to parcel this Object. */
	public static final Parcelable.Creator<Submission> CREATOR =
        new Parcelable.Creator<Submission>() {
     
		@Override
		public Submission createFromParcel(Parcel in) {
			return new Submission(in);
		}//createFromParcel

		@Override
		public Submission[] newArray(int size) {
			return new Submission[size];
		}//newArray
	};
	
	/**
	 * Constructor to use when re-constructing object
	 * from a parcel
	 * @param in a parcel from which to read this object
	 */
	public Submission(Parcel in) {
		readFromParcel(in);
	}//Submission
	
	
	/**
	 * Called from the constructor to create this
	 * object from a parcel.
	 *
	 * @param in parcel from which to re-create object
	 */
	private void readFromParcel(Parcel in) {
		this.xml = in.readString();
		this.id = in.readInt();
		this.task_id = in.readInt();
		this.user_id = in.readInt();
		this.timestamp = new Date(in.readLong());
		this.coords = in.createStringArray();
		this.myCoords = in.createStringArray();
//		in.readTypedArray(this.answers,Answer.CREATOR);
		this.points = in.readInt();
	}
	
	@Override
	public void writeToParcel(Parcel out, int flags) {
		out.writeString(this.xml);
		out.writeInt(this.id);
		out.writeInt(this.task_id);
		out.writeInt(this.user_id);
		out.writeLong(this.timestamp.getTime());
		out.writeStringArray(this.coords);
		out.writeStringArray(this.myCoords);
//		out.writeTypedArray(this.answers,flags);
		out.writeInt(this.points);
	}
	
	@Override
	public int describeContents() {
		return 0;
	}
	
	public static ArrayList<Submission> getAllSubmissions(Context context, XMLResponseHandler handl) {
		new GetRequest(context, Submission.class, null, handl, false).execute();
		return G.globalSubmissions;
	}
	
	/**Get all submission for a campaign. Before calling this function, make sure G.globalSubmissions is updated.*/
	public static ArrayList<Submission> getSubmissionsByCampaign(Campaign campaign){
		ArrayList<Submission> submissionsForCampaign = new ArrayList<Submission>();
		if(G.globalSubmissions!=null){
			for(Submission s : G.globalSubmissions){
				//make sure the submission match the campaign
				if(s.getTask_id() == Integer.parseInt(campaign.getTaskId())){
					submissionsForCampaign.add(s);
				}
			}
		}
		return submissionsForCampaign;
	}
	
	
	/** Get all submissions at a location of campaign*/
	public static ArrayList<Submission> getSubmissionsAt(int[] coords, Campaign campaign){
		ArrayList<Submission> submissionsAt = new ArrayList<Submission>();
			for(Submission s : getSubmissionsByCampaign(campaign)){
				String[] subCoords = s.getCoords();
				double lat = (double)coords[0]/1000000;
				double lon = (double)coords[1]/1000000;
				if(lat==Double.parseDouble(subCoords[1]) && lon == Double.parseDouble(subCoords[0])){
					submissionsAt.add(s);
				}
			}
		return submissionsAt;
	}
	
	/** Get all my submissions at a location.*/
	public static ArrayList<Submission> getMySubmissionsAt(int[] coords, Campaign campaign){
		ArrayList<Submission> mySubmissionsAt = new ArrayList<Submission>();
		for(Submission s : getSubmissionsByCampaign(campaign)){
			String[] subCoords = s.getCoords();
			double lat = (double)coords[0]/1000000;
			double lon = (double)coords[1]/1000000;
			if(lat==Double.parseDouble(subCoords[1]) && lon == Double.parseDouble(subCoords[0])
					&& s.getUser_id() == G.user.id){
				mySubmissionsAt.add(s);
			}
		}
		return mySubmissionsAt;
	}

	@Override
	public int compareTo(Submission arg0) {
		if(this.getTimestamp().after(arg0.getTimestamp()))
			return -1;
		if(this.getTimestamp().before(arg0.getTimestamp()))
				return 1;
		return 0;
	}

	public void setPoints(int points) {
		this.points = points;
	}

	public int getPoints() {
		return points;
	}

	public void setImageUrl(String imageUrl) {
		this.imageUrl = imageUrl;
	}

	public String getImageUrl() {
		return imageUrl;
	}

}
