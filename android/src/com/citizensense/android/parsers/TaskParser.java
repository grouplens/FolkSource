/* Copyright (c) 2006-2011 Regents of the University of Minnesota.
   For licensing terms, see the file LICENSE.
 */

package com.citizensense.android.parsers;

import org.xml.sax.Attributes;
import org.xml.sax.SAXException;

import com.citizensense.android.Task;

/**
 * Parses a Task
 * @author Phil Brown
 */
public class TaskParser extends XMLParser {

	/** The {@link Task} to parse */
	private Task task;
	
	/** Construct a new TaskParser */
	public TaskParser() {
		this(null);
	}//TaskParser
	
	/** 
	 * Construct a new TaskParser with the given {@link Callback}.
	 * @param callback 
	 */
	public TaskParser(Callback callback) {
		super(callback);
	}//TaskParser
	
	@Override
	public String getTag() {
		return "TaskParser";
	}//getTag

	@Override
	public Object getParsedObject() {
		return this.task;
	}//getParsedObject
	
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
		this.isBuffering = false; 
		String content = this.buffer.toString();
		if (localName.equalsIgnoreCase("id")) {
			//a name is not really needed, but used throughout the app.
			this.task.setName("");
		}
		else if (localName.equalsIgnoreCase("instructions")) {
			this.task.setInstructions(content);
		}
	}//endElement
	
	@Override
	public void startElement(String uri, String localName, String qName,
			Attributes atts) throws SAXException {
		super.startElement(uri, localName, qName, atts);
		if (localName.equalsIgnoreCase("org.citizensense.model.Task")) {
			this.task = new Task();
		}
		else {
			this.buffer = new StringBuffer("");
			this.isBuffering = true;
		}
	}//startElement
	
	/**
	 * Returns the parsed {@link Task} to the calling class
	 */
	public interface Callback extends XMLParser.Callback<Task> {
		@Override
		public void invoke(Task task);
	}//Callback

}//TaskParser