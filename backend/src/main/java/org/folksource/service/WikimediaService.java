package org.folksource.service;

import javax.ws.rs.core.Response;

public interface WikimediaService {

	public String getAuthUri();

	public void verify(String verifier);
	
}
