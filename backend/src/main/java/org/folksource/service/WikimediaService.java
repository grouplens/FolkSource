package org.folksource.service;

import java.io.File;

import org.glassfish.jersey.client.ClientConfig;

public interface WikimediaService {

	public String getAuthUri(String username);

	public String verify(String verifier, String requestToken);

	public void uploadPhoto(String username, File upload);

	public void addRowToFolkSourceBot(String username, String locationName, String fileName);
	
}
