package org.citizensense.controller;

import java.io.File;
import java.io.FileOutputStream;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.struts2.ServletActionContext;
import org.citizensense.util.Base64;

/**
 * This class deals with image upload.
 * 
 * @author Renji Yu
 * 
 * */
public class ImageController {

	/** The file name of the image: Username_CampaignName_Time.jpg */
	private String imageFileName;
	/** The image file is encoded into a string. */
	private String imageString;
	/** The name of the user who uploaded the image.*/
	private String userName;

	/** The base directory to save the uploaded image. */
	public static String base_dir = "./UploadImage/";



	/**
	 * Handles post request. 
	 */
	public String create() {
		HttpServletRequest req = ServletActionContext.getRequest();
		HttpServletResponse res = ServletActionContext.getResponse();

		String[] temp = imageFileName.split("_",2);
		String campaign = temp[0];
		String time = temp[1];

		String dir = base_dir + userName + File.separator + campaign;

		try {
			File dirFile = new File(dir);
			if (!dirFile.exists()) {// create directory if not exist
				if (!dirFile.mkdirs()){
					res.setStatus(HttpServletResponse.SC_NOT_ACCEPTABLE);
					return "image_upload_fail";
				}
			}

			File imageFile = new File(dir + File.separator + time);
			FileOutputStream out = new FileOutputStream(imageFile);
			byte[] buf = Base64.decode(imageString);
			out.write(buf);
			out.close();
		} catch (Exception e) {
			e.printStackTrace();
			res.setStatus(HttpServletResponse.SC_NOT_ACCEPTABLE);
			return "image_upload_fail";
		} 
		res.setStatus(HttpServletResponse.SC_OK);
		return "image_upload_success";
	}

	public String getImageFileName() {
		return imageFileName;
	}

	public void setImageFileName(String userImageFileName) {
		this.imageFileName = userImageFileName;
	}

	public void setImageString(String imageString) {
		this.imageString = imageString;
	}

	public String getImageString() {
		return imageString;
	}
	
	public String getUserName() {
		return userName;
	}

	public void setUserName(String userName) {
		this.userName = userName;
	}

	/* Used for test
	private File image;
	private String imageContentType;

	public File getImage() {
		return image;
	}

	public void setImage(File image) {
		this.image = image;
	}

	public String getImageContentType() {
		return imageContentType;
	}

	public void setImageContentType(String imageContentType) {
		this.imageContentType = imageContentType;
	}*/
}
