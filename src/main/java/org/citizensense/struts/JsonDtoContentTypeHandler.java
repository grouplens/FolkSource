package org.citizensense.struts;

import java.io.IOException;
import java.io.Reader;
import java.io.Writer;

import org.apache.struts2.rest.handler.ContentTypeHandler;
import org.citizensense.model.Answer;
import org.citizensense.model.Submission;
import org.citizensense.model.TextAnswer;
import org.grouplens.common.dto.Dto;
import org.grouplens.common.dto.DtoContainer;
import org.grouplens.common.dto.DtoContentHandler;
import org.grouplens.common.dto.JsonDtoContentHandler;

public class JsonDtoContentTypeHandler implements ContentTypeHandler {
	private final DtoContentHandler handler = new JsonDtoContentHandler();
	
	@Override
	public void toObject(Reader in, Object target) throws IOException {
		
		handler.fromString(in, (DtoContainer) target);
		
		/*
		DtoContainer foo = (DtoContainer) target;
		
		System.out.println(target.getClass().getCanonicalName());
		
		System.out.println(foo.getDtoType().getName());
		
		Submission s = (Submission) foo.getSingle();
		Answer a = s.answers[0];
		System.out.println(a.getClass());
		TextAnswer b = (TextAnswer) a;
		System.out.println(b.getClass());
		*/
		
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
