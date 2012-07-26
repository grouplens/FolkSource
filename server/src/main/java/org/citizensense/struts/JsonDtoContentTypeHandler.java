package org.citizensense.struts;

import java.io.IOException;
import java.io.Reader;
import java.io.Writer;

import org.apache.struts2.rest.handler.ContentTypeHandler;
import org.grouplens.common.dto.DtoContainer;
import org.grouplens.common.dto.DtoContentHandler;
import org.grouplens.common.dto.JsonDtoContentHandler;

public class JsonDtoContentTypeHandler implements ContentTypeHandler {
	private final DtoContentHandler handler = new JsonDtoContentHandler();
	
	@Override
	public void toObject(Reader in, Object target) throws IOException {
		handler.fromString(in, (DtoContainer) target);
	}

	@Override
	public String fromObject(Object obj, String resultCode, Writer stream)
			throws IOException {
		handler.toString((DtoContainer) obj, stream);
		return resultCode;
	}

	@Override
	public String getContentType() {
		return "application/json";
	}

	@Override
	public String getExtension() {
		return "json";
	}

}
