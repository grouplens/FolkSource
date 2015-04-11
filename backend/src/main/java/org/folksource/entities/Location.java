package org.folksource.entities;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;

import org.folksource.model.LocationLayer;
import org.folksource.model.Submission;
import org.folksource.entities.Task;

//import com.vividsolutions.jts.geom.Geometry;

@Entity
@Table(name="location", schema="public")
public class Location{
	
	@Id
	@Column(name = "id")
	public Integer id;
	
	@Column(name = "task_id")
	public Integer task_id;
	//one to one task
    //public Task task;
	
//	@Column(name = "allowed")
//    public String allowed;
	
//	@Column(name = "imgURL")
//    public String imgURL;
	
    //public LocationLayer member_layer;
    //public Submission[] submissions;

//	@Exclude(ExcludeType.EXPORT)
	//private Geometry geometry;
	
	public Location() {
		
	}
	
	public Location(Integer id2, Integer task_id2/*, Geometry geometry2*/) {
		this.id = id2;
		this.task_id = task_id2;
		//this.geometry = geometry2;
	}
	public Integer getId() {
		return this.id;
	}
	public void setId(Integer id) {
		this.id = id;
	}
	public Integer getTask_id() {
		return this.task_id;
	}
	public void setTask_id(Integer task_id){
		this.task_id = task_id;
	}
	
//	public Geometry getGeometry() {
//		return geometry;
//	}
//
//	public void setGeometry(Geometry geometry) {
//		this.geometry = geometry;
//	}

//    public String getAllowed() {
//        return allowed;
//    }
//
//    public void setAllowed(String allowed) {
//        this.allowed = allowed;
//    }

//    public String getImgURL() {
//        return imgURL;
//    }
//
//    public void setImgURL(String imgURL) {
//        this.imgURL = imgURL;
//    }

//    public LocationLayer getMember_layer() {
//        return member_layer;
//    }
//
//    public void setMember_layer(LocationLayer member_layer) {
//        this.member_layer = member_layer;
//    }
//
//    public Submission[] getSubmissions() {
//        return submissions;
//    }
//
//    public void setSubmissions(Submission[] submissions) {
//        this.submissions = submissions;
//    }
}


