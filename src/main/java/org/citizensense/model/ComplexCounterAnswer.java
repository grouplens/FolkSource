package org.citizensense.model;

public class ComplexCounterAnswer extends Answer {
	
	public String counts;
	
	public ComplexCounterAnswer(){
		super();
	}
	
	public ComplexCounterAnswer(Integer id, Integer q_id, Integer sub_id, String counts){
		super(id, "complexCounter", q_id, sub_id);
		this.counts = counts;
	}
	
	public String getCounts(){
		return this.counts;
	}
	public void setCounts(String c){
		this.counts = c;
	}

}
