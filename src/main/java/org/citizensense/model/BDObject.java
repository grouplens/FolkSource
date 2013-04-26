package org.citizensense.model;

public class BDObject {
//	public Integer t_id;
	public String t_desc;
	public Integer s_id;
	public String loc;
	public Integer q_id;
	public String q;
	public String a;
	
	public BDObject(Object[] o) {
//		if(o[0] instanceof Integer)
//			this.t_id = (Integer) o[0];
		if(o[0] instanceof String)
			this.t_desc = (String) o[0];
		if(o[1] instanceof Integer)
			this.s_id = (Integer) o[1];
		if(o[2] instanceof String)
			this.loc = (String) o[2];
		if(o[3] instanceof Integer)
			this.q_id = (Integer) o[3];
		if(o[4] instanceof String)
			this.q = (String) o[4];
		if(o[5] instanceof String)
			this.a = (String) o[5];
	}

//	public Integer getT_id() {
//		return t_id;
//	}
//
//	public void setT_id(Integer t_id) {
//		this.t_id = t_id;
//	}

	public String getT_desc() {
		return t_desc;
	}

	public void setT_desc(String t_desc) {
		this.t_desc = t_desc;
	}

	public Integer getS_id() {
		return s_id;
	}

	public void setS_id(Integer s_id) {
		this.s_id = s_id;
	}

	public String getLoc() {
		return loc;
	}

	public void setLoc(String loc) {
		this.loc = loc;
	}

	public Integer getQ_id() {
		return q_id;
	}

	public void setQ_id(Integer q_id) {
		this.q_id = q_id;
	}

	public String getQ() {
		return q;
	}

	public void setQ(String q) {
		this.q = q;
	}

	public String getA() {
		return a;
	}

	public void setA(String a) {
		this.a = a;
	}
	
	
}
