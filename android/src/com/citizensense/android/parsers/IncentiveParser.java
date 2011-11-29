/* Copyright (c) 2006-2011 Regents of the University of Minnesota.
   For licensing terms, see the file LICENSE.
 */

package com.citizensense.android.parsers;

import java.util.ArrayList;

import org.xml.sax.Attributes;
import org.xml.sax.SAXException;

import com.citizensense.android.Incentive;
import com.citizensense.android.User;

/**
 * Parses an Incentive given in XML form
 * @author Phil Brown
 */
public class IncentiveParser extends XMLParser {

	/** The {@link Incentive} to parse */
	private Incentive incentive;
	
	/** The current user that is being parsed, if {@link Incentive#getType()}
	 * == {@link Incentive#LEADERBOARD} */
	private User user;

	/** Construct a new IncentiveParser */
	public IncentiveParser() {
		this(null);
	}//IncentiveParser
	
	/** 
	 * Construct a new IncentiveParser with the given {@link Callback}.
	 * @param callback 
	 */
	public IncentiveParser(Callback callback) {
		super(callback);
	}//IncentiveParser
	
	@Override
	public String getTag() {
		return "IncentiveParser";
	}//getTag

	@Override
	public Object getParsedObject() {
		return incentive;
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
		if (localName.equalsIgnoreCase("type")) {
			if (content.equalsIgnoreCase("points")) {
				this.incentive.setType(Incentive.POINTS);
			}
			else if (content.equalsIgnoreCase("badge")) {
				this.incentive.setType(Incentive.BADGES);
			}
			else {
				this.incentive.setType(Incentive.LEADERBOARD);
			}
		}
		else if (localName.equalsIgnoreCase("id")) {
			this.incentive.setId(Integer.parseInt(content));
		}
		else if (localName.equalsIgnoreCase("task__id")) {
			this.incentive.setTask_id(Integer.parseInt(content));
		}
		else if (localName.equalsIgnoreCase("value")) {
			this.incentive.setValue(Integer.parseInt(content));
		}
		else if (localName.equalsIgnoreCase("user")) {
			this.incentive.leaderboard.add(this.user);
			this.user = null;
		}
		else if (localName.equalsIgnoreCase("userid")) {
			this.user.id = Integer.parseInt(content);
		}
		else if (localName.equalsIgnoreCase("name")) {
			this.user.setUsername(content);
		}
		else if (localName.equalsIgnoreCase("score")) {
			this.user.setScore(Integer.parseInt(content));
		}
	}//endElement
	
	@Override
	public void startElement(String uri, String localName, String qName,
			Attributes atts) throws SAXException {
		super.startElement(uri, localName, qName, atts);
		if (localName.equalsIgnoreCase("org.citizensense.model.Incentive")) {
			this.incentive = new Incentive();
			this.incentive.leaderboard = new ArrayList<User>();
		}
		else if (localName.equalsIgnoreCase("user")) {
			this.user = new User();
		}
		else {
			this.buffer = new StringBuffer("");
			this.isBuffering = true;
		}
	}//startElement
	
	/**
	 * Returns the parsed {@link Incentive} to the calling class.
	 */
	public interface Callback extends XMLParser.Callback<Incentive> {
		@Override
		public void invoke(Incentive incentive);
	}//Callback

}//IncentiveParser
