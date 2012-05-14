/* Copyright (c) 2006-2011 Regents of the University of Minnesota.
   For licensing terms, see the file LICENSE.
 */

package com.citizensense.android.parsers;

import java.text.ParseException;
import java.util.ArrayList;

import org.xml.sax.Attributes;
import org.xml.sax.SAXException;

import android.util.Log;

import com.citizensense.android.Answer;
import com.citizensense.android.Campaign;
import com.citizensense.android.Submission;

/**
 * This SAX Parser will work with the new XML format
 * 
 * @author Phil Brown
 */
public class SubmissionParser extends XMLParser {

	/** The {@link Campaign} to parse */
	private ArrayList<Submission> subs;
	private Submission submission;
	
	private ArrayList<Answer> answers;
	private Answer answer;
	
	/** There are 'id' in both submission and answer, we need to 
	 * distinguish them*/
	private boolean isParsingAnswer = false;
	

	/** Construct a new TaskParser */
	public SubmissionParser() {
		this(null);
	}// TaskParser

	/**
	 * Construct a new TaskParser with the given {@link Callback}.
	 * 
	 * @param callback
	 */
	public SubmissionParser(Callback callback) {
		super(callback);
		this.subs = new ArrayList<Submission>();
	}// TaskParser

	@Override
	public String getTag() {
		return "SubmissionParser";
	}// getTag

	@Override
	public Object getParsedObject() {
		return subs;
	}// getParsedObject

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
		if (localName.equalsIgnoreCase("org.citizensense.model.Submission")) {
			this.subs.add(submission);
			if(submission!=null && answers!=null)
				this.submission.setAnswers(answers.toArray(new Answer[answers.size()]));
			this.submission = null;
			this.answers = null;
		} 

		else {
			this.isBuffering = false;
			String content = this.buffer.toString();
			
			if(localName.equalsIgnoreCase("org.citizensense.model.Answer")){
				isParsingAnswer = false;
				answer = null;
			}
			else if (localName.equalsIgnoreCase("id")) {
				if(isParsingAnswer == false)
					this.submission.setId(Integer.parseInt(content));
				else
					this.answer.setId(Integer.parseInt(content));
			} else if (localName.equalsIgnoreCase("task__id")) {
				this.submission.setTask_id(Integer.parseInt(content));
			} else if (localName.equalsIgnoreCase("user__id")) {
				this.submission.setUser_id(Integer.parseInt(content));
			} else if (localName.equalsIgnoreCase("gps__location")) {
				int index = content.indexOf(";");
				if(index == -1){
					this.submission.setCoords(content.split("\\|"));
				}else{
					this.submission.setCoords(content.substring(0,index).split("\\|"));
					this.submission.setMyCoords(content.substring(index+1).split("\\|"));
				}
				
			} else if (localName.equalsIgnoreCase("timestamp")) {
				try {
					submission.setTimestamp(this.dateFormat.parse(content));
				} catch (ParseException e) {
					Log.e("TAG",
							"Invalid Date Format: start_date=" + content
									+ ". Should use format"
									+ dateFormat.toLocalizedPattern());
					e.printStackTrace();
				}
			}
			else if (localName.equalsIgnoreCase("img__path")) {
				submission.setImageUrl(content);
			}
			//parse answer
			else if(localName.equalsIgnoreCase("answer")){
				answer.setAnswer(content);
			}
			else if(localName.equalsIgnoreCase("type")){
				answer.setType(content);
			}
			else if(localName.equalsIgnoreCase("q__id")){
				answer.setQ_id(Integer.parseInt(content));
			}
			else if(localName.equalsIgnoreCase("sub__id")){
				answer.setSub_id(Integer.parseInt(content));
				// In the XML, there is "<org.citizensense.model.Answer reference="../../bag/org.citizensense.model.Answer"/>"
				// thus we should't add answer when when see this start element "org.citizensense.model.Answer"
				// add the answer object when we see the end element "sub_id"
				if(answers!=null) answers.add(answer);
			}
			
			
		}
	}// endElement

	@Override
	public void startElement(String uri, String localName, String qName,
			Attributes atts) throws SAXException {
		super.startElement(uri, localName, qName, atts);
		if (localName.equalsIgnoreCase("org.citizensense.model.Submission")) {
			submission = new Submission();
			answers = new ArrayList<Answer>();
		} else if(localName.equalsIgnoreCase("org.citizensense.model.Answer")){
			isParsingAnswer = true;
			answer = new Answer();
		}
		else if (!localName.equalsIgnoreCase("list")) {
				this.buffer = new StringBuffer("");
				this.isBuffering = true;
			}
	}// startElement

	/**
	 * Returns the parsed {@link Campaign} to the calling class
	 */
	public interface Callback extends XMLParser.Callback<ArrayList<Submission>> {
		@Override
		public void invoke(ArrayList<Submission> submissions);
	}// Callback

}// CampaignParser
