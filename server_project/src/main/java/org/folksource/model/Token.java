package org.folksource.model;

import java.sql.Timestamp;


public class Token{
	public Integer id;
	public Integer token;
	public Timestamp ttl;

	public Token(){
		super();
	}
	
	public Token(/*Integer id,*/ Integer token, Timestamp timestamp){
		super();
//		this.id = id;
		this.token = token;
		this.ttl = timestamp;
	}

	public Integer getId() {
		return id;
	}

	public void setId(Integer id) {
		this.id = id;
	}

	public Integer getToken() {
		return token;
	}

	public void setToken(Integer token) {
		this.token = token;
	}

	public Timestamp getTtl() {
		return ttl;
	}

	public void setTtl(Timestamp ttl) {
		this.ttl = ttl;
	}
	
}
