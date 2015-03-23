package org.folksource.controller;


import com.opensymphony.xwork2.ModelDriven;
import org.apache.struts2.ServletActionContext;
import org.folksource.geojson.GeoJSON;
import org.folksource.util.GeoJSONService;
import org.grouplens.common.dto.DtoContainer;

import javax.servlet.http.HttpServletResponse;

public class FeatureController implements ModelDriven<DtoContainer<GeoJSON>>{
	
	DtoContainer<GeoJSON> content = new DtoContainer<GeoJSON>(GeoJSON.class, false);
	public Integer id;

	@Override
	public DtoContainer<GeoJSON> getModel() {
		return content;
	}
	public String show() {
		return "show";
	}
	public void setId(Integer id) {
		this.id = id;		
	}
	public Integer getId() {
		return this.id;
	}
	
	
	
	public String index() {
		HttpServletResponse res = ServletActionContext.getResponse();
		res.addHeader("Access-Control-Allow-Origin", "*");
//		content = new DtoContainer<FeatureCollection>(FeatureCollection.class, false);
		content.set(GeoJSONService.getGeometries());
		return "index";
	}

	/*
	 * WE BREAK THE REST CONCEPT HERE, RE-FACTOR LATER
	 */
	public String create()
	{
		GeoJSON f = content.getSingle();
//		GeoJSONService.checkNearby(f.getGeometries());
//		HttpServletResponse res = ServletActionContext.getResponse();
//		res.addHeader("Access-Control-Allow-Origin", "*");
//		List<QuestionDto> questions = content.get();
//		List<Question> questionsTwo = new ArrayList<Question>();
//		for(QuestionDto q : questions) {
//			Question ques = q.toQuestion();
//			QuestionService.save(ques);
//			questionsTwo.add(ques);
//		}
//		// Note: It may not be immediately obvious why it is necessary to set the content again. The reason is, is that
//		// the QuestionDtos originally in content did not have its id set. QuestionService.save() modifies at least the id field
//		content.set(QuestionDto.fromList(questionsTwo));
		return "create";
	}

}
