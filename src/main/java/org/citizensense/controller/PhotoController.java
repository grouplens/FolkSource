package org.citizensense.controller;

import java.io.File;
import java.io.IOException;

import org.apache.commons.io.FileUtils;

import java.util.Arrays;
import java.util.Date;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.struts2.ServletActionContext;
import org.citizensense.model.Photo;
import org.citizensense.model.Submission;
import org.citizensense.util.PhotoService;
import org.citizensense.util.SubmissionService;
import org.grouplens.common.dto.DtoContainer;

import com.opensymphony.xwork2.ModelDriven;

public class PhotoController implements ModelDriven<DtoContainer<Photo>>{
	
	private File photo;
	/**The name of the photo provided in FileUploadOptions.fileName*/
	private String photoFileName; // At present this is unused
	private String photoMimeType;
	
	private DtoContainer<Photo> content = new DtoContainer<Photo>(Photo.class, false);
	
	/** The base directory to save the uploaded photo. */
	public static final String BASE_DIR = "CSenseUploadedPhotos/";
	
	
	public String create() {
		
		//System.out.println("In PhotoController.create()!");
		//System.out.println("photoFileName: " + photoFileName);
		//System.out.println("photo absolute path: " + photo.getAbsolutePath());
		
		HttpServletRequest req = ServletActionContext.getRequest();
		Map<String, String[]> params = req.getParameterMap();
		
		//Build a path for the file
		String name = params.get("username")[0] + "-"+ params.get("qid")[0] + "-" + new Date().getTime();
		//TODO: Escape/validate file name
		String path = BASE_DIR + name + getExtension(getPhotoContentType());
		File storageLocation = new File(path);
		
		//Put the file at that path
		try {
			FileUtils.copyFile(photo, storageLocation);
		} catch (IOException e) {
			// TODO Auto-generated catch block
			System.out.println("Copying File Failed!");
			e.printStackTrace();
		}
		
		//Put the proper information into the db
		Photo photoObj = new Photo();
		photoObj.setUrl(path);
		PhotoService.save(photoObj);
		
		//Return the newly created object (id is set by save)
		content.set(photoObj);
		
		return "create";
	}
	
	private String getExtension(String mimeType){
		// We should decide on our acceptable mimeTypes and perhaps
		// throw an exception if the mimeType is not one of our acceptable formats.
		if (mimeType.equals("image/jpeg")){
			return ".jpg";
		}
		if (mimeType.equals("image/png")){
			return ".png";
		}
		return "";
	}
	
	
	@Override
	public DtoContainer<Photo> getModel() {
		return content;
	}
	
	
	public void setPhotoFileName(String photoFileName) {
		System.out.println("setPhotoFileName got called!");
		this.photoFileName = photoFileName;
	}
	public String getPhotoFileName() {
		return this.photoFileName;
	}
	
	public void setPhotoContentType(String photoContentType) {
		System.out.println("setPhotoContentType got called!");
		this.photoMimeType = photoContentType;
	}
	public String getPhotoContentType(){
		return this.photoMimeType;
	}
	
	
	public void setPhoto(File photo) {
		System.out.println("setPhoto got called!");
		this.photo = photo;
	}
	public File getPhoto() {
		return this.photo;
	}

}