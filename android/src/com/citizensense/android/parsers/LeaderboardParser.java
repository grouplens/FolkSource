package com.citizensense.android.parsers;

import org.xml.sax.Attributes;
import org.xml.sax.SAXException;

import com.citizensense.android.Leaderboard;
import com.citizensense.android.LeaderboardEntry;

/**
 * Parses the leaderboard
 * @author Phil Brown
 */
public class LeaderboardParser extends XMLParser {

	private Leaderboard leaderboard;
	private LeaderboardEntry entry;
	
	/** Constructs a new LeaderboardParser */
	public LeaderboardParser() {
		this(null);
	}//LeaderboardParser
	
	/** Constructs a new LeaderboardParser with the given {@link Callback}
	 * @param callback */
	public LeaderboardParser(Callback callback) {
		super(callback);
		this.leaderboard = new Leaderboard();
	}//LeaderboardParser
	
	@Override
	public String getTag() {
		return "LeaderboardParser";
	}//getTag

	@Override
	public Object getParsedObject() {
		return this.leaderboard;
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
		if (localName.equalsIgnoreCase("org.citizensense.model.LeaderboardEntry")) {
			this.leaderboard.entries.add(this.entry);
		}
		else {
			this.isBuffering = false; 
			String content = this.buffer.toString();
			if (localName.equalsIgnoreCase("name")) {
				this.entry.name = content;
			}
			else if (localName.equalsIgnoreCase("id")) {
				this.entry.id = Integer.parseInt(content);
			}
			else if (localName.equalsIgnoreCase("points")) {
				this.entry.points = Integer.parseInt(content);
			}
		}
	}//endElement
	
	@Override
	public void startElement(String uri, String localName, String qName,
			Attributes atts) throws SAXException {
		super.startElement(uri, localName, qName, atts);
		if (localName.equalsIgnoreCase("org.citizensense.model.LeaderboardEntry")) {
			this.entry = new LeaderboardEntry();
		}
		else {
			this.buffer = new StringBuffer("");
			this.isBuffering = true;
		}
	}//startElement
	
	/**
	 * Returns the parsed {@link Leaderboard} to the calling class.
	 */
	public interface Callback extends XMLParser.Callback<Leaderboard> {
		@Override
		public void invoke(Leaderboard leaderboard);
	}//Callback

}//LeaderboardParser
