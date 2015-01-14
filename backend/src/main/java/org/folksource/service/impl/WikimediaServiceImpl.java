package org.folksource.service.impl;

import net.sourceforge.jwbf.core.contentRep.Article;
import net.sourceforge.jwbf.mediawiki.bots.MediaWikiBot;

import org.folksource.service.WikimediaService;

public class WikimediaServiceImpl implements WikimediaService{
	 
	private final String USER_AGENT = "Mozilla/5.0";
	
	public String connect() {
		//return "Some message";
		String response = null;
		try {
			MediaWikiBot wikiBot = new MediaWikiBot("https://en.wikipedia.org/w/");
			Article article = wikiBot.getArticle("42");
			System.out.println(article.getText().substring(5, 42));
			response = article.getText().substring(5,42);
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		return response;
	}
}
