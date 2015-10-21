package org.folksource.service;

import java.io.File;

public interface WikimediaService {

	public String getAuthUri(String username);

	public String verify(String verifier, String requestToken);
	
	public void uploadPhoto(File photo);
	
}
