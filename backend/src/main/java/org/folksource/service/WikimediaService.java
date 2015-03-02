package org.folksource.service;


public interface WikimediaService {

	public String getAuthUri();

	public String verify(String verifier);
	
}
