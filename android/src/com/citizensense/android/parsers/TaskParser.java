/* Copyright (c) 2006-2011 Regents of the University of Minnesota.
   For licensing terms, see the file LICENSE.
 */

package com.citizensense.android.parsers;

import java.util.ArrayList;

import org.xml.sax.Attributes;
import org.xml.sax.SAXException;

import com.citizensense.android.Form;
import com.citizensense.android.Question;
import com.citizensense.android.Task;

/**
 * Parses a Task
 * 
 * @author Phil Brown
 */
public class TaskParser extends XMLParser {

	/** The {@link Task} to parse */
	private Task task;
	/** The {@link Form} to parse */
	private Form form;
	/** The currently-parsed {@link Question} stored in {@link #form} */
	private Question question;
	/**
	 * Keeps track of whether or not the parser is currently reading the
	 * submission values.
	 */
	private boolean isParsingSubmission = false;

	private ArrayList<Question> questions;

	/** Construct a new TaskParser */
	public TaskParser() {
		this(null);
	}// TaskParser

	/**
	 * Construct a new TaskParser with the given {@link Callback}.
	 * 
	 * @param callback
	 */
	public TaskParser(Callback callback) {
		super(callback);
		this.isParsingSubmission = false;
	}// TaskParser

	@Override
	public String getTag() {
		return "TaskParser";
	}// getTag

	@Override
	public Object getParsedObject() {
		// this.task.setForm(this.form);
		return this.task;
	}// getParsedObject

	@Override
	public void endDocument() throws SAXException {
		this.task.setForm(this.form);
		super.endDocument();
	}// endDocument

	@Override
	public void characters(char[] ch, int start, int length)
			throws SAXException {
		super.characters(ch, start, length);
		if (this.isBuffering) {
			this.buffer.append(ch, start, length);
		}
	}// characters

	@Override
	public void endElement(String uri, String localName, String qName)
			throws SAXException {
		super.endElement(uri, localName, qName);
		this.isBuffering = false;
		String content = this.buffer.toString();
		 if (localName.equalsIgnoreCase("submissions")) {
		 this.isParsingSubmission = false;
		 }
		 else if (this.isParsingSubmission) {
			 return;
		 }
		// else if
		// (localName.equalsIgnoreCase("org.citizensense.model.Question")) {
		// this.form.addQuestion(this.question);
		// this.question = null;
		// }
		// else if (localName.equalsIgnoreCase("id")) {
		// //a name is not really needed, but used throughout the app.
		// if (this.question == null) {
		// this.task.setName("");
		// }
		// else {
		// this.question.id = Integer.parseInt(content);
		// }
		// }
		// else if (localName.equalsIgnoreCase("instructions")) {
		// this.task.setInstructions(content);
		// }
		// else if (localName.equalsIgnoreCase("required")) {
		// //TODO handle required/not required questions or tasks
		// }
		// else if (localName.equalsIgnoreCase("question")) {
		// this.question.setQuestion(content);
		// }
		// else if (localName.equalsIgnoreCase("type")) {
		// if (content.equalsIgnoreCase("exclusive_multiple_choice")) {
		// this.question.setSingle_choice(true);
		// this.question.setType(Question.MULTIPLE_CHOICE);
		// }
		// else if (content.equalsIgnoreCase("multiple_choice")) {//TODO is this
		// the correct term used? Ask Jake.
		// this.question.setSingle_choice(false);
		// this.question.setType(Question.MULTIPLE_CHOICE);
		// }
		// else if (content.equalsIgnoreCase("text")) {
		// this.question.setType(Question.WRITTEN_RESPONSE);
		// this.question.setSingle_choice(true);
		// this.question.setSingle_line(true);//unless otherwise specified...
		// }
		// }
		// else if (localName.equalsIgnoreCase("options")) {
		// this.question.setAnswers(content.split("\\|"));
		// }

		if (localName.equalsIgnoreCase("id")) {
			if (this.task.getId() == null)
				this.task.setId(content);
		} 
		else if (localName.equalsIgnoreCase("instructions")) {
			this.task.setInstructions(content);
		} 
//		else if (localName.equalsIgnoreCase("required")) {//for task or question
//			if(this.task.getRequired() == null)
//				this.task.setRequired(content.equalsIgnoreCase("true"));
//			//else this.question.setRequired(content.equalsIgnoreCase("true"));
//		} 
		else if (localName.equalsIgnoreCase("org.citizensense.model.Question")) {
			this.questions.add(this.question);
		} 
		else if (localName.equalsIgnoreCase("question")) {
			this.question.setQuestion(content);
		} 
		else if (localName.equalsIgnoreCase("type")) {
			if (content.equalsIgnoreCase("exclusive_multiple_choice")) {
				this.question.setSingle_choice(true);
				this.question.setType(Question.MULTIPLE_CHOICE);
			} 
			else if (content.equalsIgnoreCase("multiple_choice")) {//???ask Jake
				this.question.setSingle_choice(false);
				this.question.setType(Question.MULTIPLE_CHOICE);
			} 
			else if (content.equalsIgnoreCase("text")) {
				this.question.setType(Question.WRITTEN_RESPONSE);
				this.question.setSingle_choice(true);
				this.question.setSingle_line(true);// unless otherwise
			}
		} 
		else if (localName.equalsIgnoreCase("options")) {
			this.question.setAnswers(content.split("\\|"));
		}

	}// endElement

	@Override
	public void startElement(String uri, String localName, String qName,
			Attributes atts) throws SAXException {
		super.startElement(uri, localName, qName, atts);
		if (localName.equalsIgnoreCase("org.citizensense.model.Task")) {
			this.task = new Task();
		} 
		else if (localName.contains("submissions")) {
			 this.isParsingSubmission = true;
		} 
		else if (localName.equalsIgnoreCase("questions")) {
			this.form = new Form();
			this.questions = new ArrayList<Question>();
			this.form.setQuestions(this.questions);
			this.task.setForm(this.form);
		}
		else if (localName.equalsIgnoreCase("org.citizensense.model.Question")) {
			this.question = new Question();
		} 
		else{
			if(!this.isParsingSubmission){
				this.buffer = new StringBuffer("");
				this.isBuffering = true;
			}
		}

	}// startElement

	/**
	 * Returns the parsed {@link Task} to the calling class
	 */
	public interface Callback extends XMLParser.Callback<Task> {
		@Override
		public void invoke(Task task);
	}// Callback

}// TaskParser