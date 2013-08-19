package org.citizensense.controller;

import java.io.File;
import java.io.IOException;
import java.util.Date;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.io.FileUtils;
import org.apache.struts2.ServletActionContext;
import org.citizensense.model.AnswerDto;
import org.citizensense.model.MediaAnswer;
import org.citizensense.util.AnswerService;
import org.citizensense.util.SubmissionService;
import org.grouplens.common.dto.DtoContainer;

import com.opensymphony.xwork2.ModelDriven;

public class AnswerController implements ModelDriven<DtoContainer<AnswerDto>>{

	private DtoContainer<AnswerDto> content = new DtoContainer<AnswerDto>(AnswerDto.class, false);
	
	//MediaAnswer fields
	String mimeType;
	File media;
	/** The base directory to save uploaded photos. */
	public static final String BASE_DIR = "CSenseUploadedPhotos/";
	
	
	@Override
	public DtoContainer<AnswerDto> getModel() {
		return content;
	}
	
	public String create() {
		//System.out.println("[LOG] AnswerController is running... in create.");
		HttpServletRequest req = ServletActionContext.getRequest();
		Map<String, String[]> params = req.getParameterMap();
		
		String answer_type = params.get("answer_type")[0];
		//System.out.println("[LOG] Before assertion");
		assert(answer_type.equals("media"));
		//System.out.println("[LOG] After assertion");
		Integer q_id = Integer.parseInt(params.get("q_id")[0]);
		Integer sub_id = Integer.parseInt(params.get("sub_id")[0]);
		//System.out.println("[LOG] After parsing ints");
		Integer id = 0;
		String path = saveMedia();
		//System.out.println("[LOG] After saving photo");
		
		MediaAnswer a = new MediaAnswer(id, "media", q_id, sub_id, path, getPhotoContentType());
		//System.out.println("[LOG] After initing phot obj");
		//System.out.println("[LOG] PhotoAnswer.path = " + a.path);
		AnswerService.save(a);
		//System.out.println("[LOG] After saving answer to db");
		//System.out.println("[LOG] PhotoAnswer.path = " + a.path);
		
		content.set(new AnswerDto(a));
		//System.out.println("[LOG] After setting content");
		return "create";
	}
	
	private String saveMedia(){
		
		//build the path
		HttpServletRequest req = ServletActionContext.getRequest();
		Map<String, String[]> params = req.getParameterMap();
		String name = params.get("username")[0] + "-"+ params.get("q_id")[0] + "-" + new Date().getTime();
		//TODO: Escape/validate file name
		String path = BASE_DIR + name + getExtension(getPhotoContentType());
		File storageLocation = new File(path);
		
		//save the file
		try {
			FileUtils.copyFile(media, storageLocation);
		} catch (IOException e) {
			System.out.println("Copying File Failed!");
			e.printStackTrace();
		}
		
		return path;
	}
		
	private String getExtension(String mimeType){
		// We should decide on our acceptable mimeTypes and
		// throw an exception if the mimeType is not one of our acceptable formats.
		if (mimeType.equals("image/jpeg")){
			return ".jpg";
		}
		if (mimeType.equals("image/png")){
			return ".png";
		}
		return "";
	}
	
	
	//Getters and Setters
	public String getPhotoContentType(){
		return this.mimeType;
	}
	public void setPhotoContentType(String photoContentType) {
		this.mimeType = photoContentType;
	}
	public void setPhoto(File photo) {
		this.media = photo;
	}
	public File getPhoto() {
		return this.media;
	}

}
