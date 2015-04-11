package org.folksource.entities;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name="answers", schema="public")
public class Answer {
	
	@Id
	@Column(name = "id")
	public Integer id;
	
	@Column(name = "answer_type")
	public String answer_type;
	
	@Column(name = "q_id")
	public Integer q_id;
	
	//public Question question;
	
	@Column(name = "sub_id")
	public Integer sub_id;
	
	//@Exclude(ExcludeType.EXPORT)
	//public Submission submission;
	
	public Answer(){
		super();
	}
	
	public Answer(Integer id, String answer_type, Integer q_id, Integer sub_id){
		super();
		this.id = id;
		this.answer_type = answer_type;
		this.q_id = q_id;
		//this.question = QuestionService.getQuestionById(this.q_id);
		this.sub_id = sub_id;
	}
	
	public Integer getId() {
		return id;
	}
	public void setId(int id) {
		this.id = id;
	}
	
	public String getAnswer_type() {
		return answer_type;
	}
	public void setAnswer_type(String type) {
		this.answer_type = type;
	}
	
	public Integer getQ_id() {
		return q_id;
	}
	public void setQ_id(int q_id) {
		this.q_id = q_id;
	}
//	public Question getQuestion() {
//		return question;
//	}
//	public void setQuestion(Question question) {
//		this.question = question;
//	}
	public Integer getSub_id() {
		return sub_id;
	}
	public void setSub_id(int sub_id) {
		this.sub_id = sub_id;
	}
	
//	public Submission getSubmission() {
//		return submission;
//	}
//	public void setSubmission(Submission submission) {
//		this.submission = submission;
//	}
}
