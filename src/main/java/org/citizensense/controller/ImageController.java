package org.citizensense.controller;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;

import javax.servlet.ServletInputStream;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.struts2.ServletActionContext;
/**
 * This class deals with image upload.
 * @author Renji Yu
 * 
 * */
public class ImageController {

	private File userImage;

	private String userImageContentType;

	private String userImageFileName;

	/** Handles post request.
	 * FIXME: not completed yet */
	public String create() {
		HttpServletRequest req = ServletActionContext.getRequest();
		HttpServletResponse res = ServletActionContext.getResponse();

		try {
			FileOutputStream out = new FileOutputStream("d:/result.jpg");
			//ServletInputStream in = req.getInputStream();
			FileInputStream in = new  FileInputStream(getUserImage());
			byte[] buf = new byte[1024];
			int len;
			while ((len = in.read(buf)) > 0) {
				out.write(buf, 0, len);
				//out.flush();
			}
			out.close();
			in.close();
			System.out.println("Success");
		} catch (Exception e) {
			System.out.println("Fail");
			e.printStackTrace();
		} finally {
		}

		return "image_upload_success";
	}

	public File getUserImage() {
		return userImage;
	}

	public void setUserImage(File userImage) {
		this.userImage = userImage;
	}

	public String getUserImageContentType() {
		return userImageContentType;
	}

	public void setUserImageContentType(String userImageContentType) {
		this.userImageContentType = userImageContentType;
	}

	public String getUserImageFileName() {
		return userImageFileName;
	}

	public void setUserImageFileName(String userImageFileName) {
		this.userImageFileName = userImageFileName;
	}

}
