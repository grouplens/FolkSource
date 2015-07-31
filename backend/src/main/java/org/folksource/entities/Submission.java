
package org.folksource.entities;

import java.util.Arrays;
import java.util.Date;
import java.util.List;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;

//import org.folksource.model.Answer;

@Entity
@Table(name="task_submissions", schema="public")
public class Submission {
	
	@Id
	@Column(name = "id")
	public Integer id;
	
	@Column(name = "task_id")
	public Integer task_id;
	
	@Column(name = "user_id")
	public Integer user_id;
//	private String notes;
	
	@Column(name = "gps_location")
	public String gps_location;
	
	//public Answer[] answers;
	
	@Column(name = "timestamp")
	public Date timestamp;
	
	@Column(name = "img_path")
	public String img_path;
	
//	@Column(name = "location_id")
//    public Integer location_id;

}