package org.folksource.model;

public class ComplexCounterAnswer extends Answer {
	
	public String counts;
	
	public ComplexCounterAnswer(){
		super();
	}
	
	public ComplexCounterAnswer(Integer id, String answer_type, Integer q_id, Integer sub_id, String counts){
		super(id, answer_type, q_id, sub_id);
//		this.counts = counts;
	}
	
//	public String getCounts(){
//		return this.counts;
//	}
//	public void setCounts(String c){
//		this.counts = c;
//	}

}
