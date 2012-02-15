/* Copyright (c) 2006-2011 Regents of the University of Minnesota.
   For licensing terms, see the file LICENSE.
 */

package com.citizensense.android.parsers;

import java.util.List;

import org.xml.sax.Attributes;
import org.xml.sax.SAXException;

import com.citizensense.android.Form;
import com.citizensense.android.Question;

/**
 * Parses a Form
 * @author Phil Brown
 */
public class FormParser extends XMLParser {

	/** {@link Form} used for storing Questions that are parsed. */
	private Form form;
	/** A reusable {@link Question} used during parsing */
	private Question question;
	
	private List<Question> questions;
	
	/** Constructs a new FormParser */
	public FormParser() {
		this(null);
	}//FormParser
	
	/**
	 * Constructs a new FormParser with the given {@link Callback}.
	 * @param callback
	 */
	public FormParser(Callback callback) {
		super(callback);
		this.form = new Form();
	}//FormCallback
	
	@Override
	public void characters(char[] ch, int start, int length)
			throws SAXException {
		super.characters(ch, start, length);
		if(this.isBuffering) {
            this.buffer.append(ch, start, length);
        }
	}//characters
	
	@Override
	public void endElement(String uri, String localName, String qName)
			throws SAXException {
		super.endElement(uri, localName, qName);
		if (localName.equalsIgnoreCase("question")) {
			this.form.addQuestion(this.question);
			this.question = null;
		}
		else {
			this.isBuffering = false; 
			String content = this.buffer.toString();
			if (localName.equalsIgnoreCase("question")) {
				question.setQuestion(content);
			}
			else if (localName.equalsIgnoreCase("type")) {
				if (content.equals("written_repsonse")) {
					question.setType(Question.WRITTEN_RESPONSE);
				}
				else {
					question.setType(Question.MULTIPLE_CHOICE);
				}
			}
			else if (localName.equalsIgnoreCase("single_line")) {
				question.setSingle_line(Boolean.parseBoolean(content));
			}
			else if (localName.equalsIgnoreCase("single_answer")) {
				question.setSingle_choice(Boolean.parseBoolean(content));
			}
			else if (localName.equalsIgnoreCase("answers")) {
				question.setAnswers(content.split("\\|"));
			}
		}
	}//endElement
	
	@Override
	public void startElement(String uri, String localName, String qName,
			Attributes atts) throws SAXException {
		super.startElement(uri, localName, qName, atts);
		if (localName.equalsIgnoreCase("org.citizensense.model.Question")) {
			this.question = new Question();
		}
		else {
			if (!localName.equalsIgnoreCase("list")) {
				this.buffer = new StringBuffer("");
				this.isBuffering = true;
			}
		}
	}//startElement
	
	@Override
	public String getTag() {
		return "FormParser";
	}//getTag

	@Override
	public Object getParsedObject() {
		return form;
	}//getParsedObject
	
	public interface Callback extends XMLParser.Callback<Form> {
		@Override
		public void invoke(Form form);
	}//Callback

}//FormParser
