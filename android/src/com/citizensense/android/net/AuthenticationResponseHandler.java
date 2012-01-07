package com.citizensense.android.net;

import java.io.IOException;

import org.apache.http.Header;
import org.apache.http.HttpResponse;
import org.apache.http.StatusLine;
import org.apache.http.client.HttpResponseException;
import org.apache.http.impl.client.BasicResponseHandler;

import android.app.Activity;
import android.content.Context;
import android.content.Intent;
import android.widget.Toast;

import com.citizensense.android.G;
import com.citizensense.android.conf.Constants;

/**
 * Handle an HttpResponse for LOGIN, REGISTER. It extends BasicResponseHandler
 * and overwrite the handleResponse() method, so that when the status code>300,
 * it won't throw exception as default.
 * 
 * @author Renji Yu
 */
public class AuthenticationResponseHandler extends BasicResponseHandler {
	/** The status code get from the reponse. */
	private int status_code;
	/** The type of authentication: LOGIN or REGISTER. */
	private int type;
	/** Cookie string */
	private String cookie;
	/** This is used for creating a dialog. */
	private Context context;

	/** Authentication type: LOGIN or REGISTER. */
	public static int LOGIN = 2, REGISTER = 3;
	/** Status code for different results. */
	private static final int LOGIN_SUCCESS = 200, WRONG_PASSWORD = 417,
			NO_USERNAME = 406, REGISTER_SUCCESS = 200, REGISTER_FAILURE = 406;

	public AuthenticationResponseHandler(Context context, int type) {
		this.context = context;
		this.type = type;
	}

	/** Handle response for LOGIN or REGISTER. Deal with success or failure.*/
	@Override
	public String handleResponse(HttpResponse response)
			throws HttpResponseException, IOException {
		if (response == null) {
			Toast.makeText(context, "Network error.Try later.",
					Toast.LENGTH_LONG).show();
			return null;
		}
		StatusLine statusLine = response.getStatusLine();
		status_code = statusLine.getStatusCode();
		if (type == LOGIN) {
			if (status_code == WRONG_PASSWORD) {// HttpServletResponse.SC_EXPECTATION_FAILED
				Toast.makeText(context,
						"Wrong password. Please try agaign.", Toast.LENGTH_LONG)
						.show();
				System.out.println("Wrong password");
			} else if (status_code == NO_USERNAME) {
				System.out.println("No username");
				Toast.makeText(context,
						"No such user name. Create a new account!",
						Toast.LENGTH_LONG).show();
			} else if (status_code == LOGIN_SUCCESS) {// HttpServletResponse.SC_OK
				Header[] headers = response.getAllHeaders();
				for (Header header : headers) {
					if (header.getName().contains("Cookie")) {
						this.setCookie(header.getValue());
					}
				}
				((Activity) context).finish();
			} else {
				throw new HttpResponseException(statusLine.getStatusCode(),
						statusLine.getReasonPhrase());
			}
		} else {// REGISTER
			if (status_code == REGISTER_FAILURE) {// HttpServletResponse.SC_EXPECTATION_FAILED
				Toast.makeText(context,
						"User name already exist. Please choose another one",
						Toast.LENGTH_LONG).show();
			} else if (status_code == REGISTER_SUCCESS) {// HttpServletResponse.SC_OK
				Header[] headers = response.getAllHeaders();
				for (Header header : headers) {
					if (header.getName().contains("Cookie")) {
						this.setCookie(header.getValue());
					}
				}
				Intent in = new Intent();
				((Activity) context).setResult(Constants.REGISTRATION_SUCCESS,
						in);
				((Activity) context).finish();
			} else {
				throw new HttpResponseException(statusLine.getStatusCode(),
						statusLine.getReasonPhrase());
			}
		}
		return null;
	}

	public int getStatus_code() {
		return status_code;
	}

	public void setStatus_code(int status_code) {
		this.status_code = status_code;
	}

	public int getType() {
		return type;
	}

	public void setType(int type) {
		this.type = type;
	}

	public void setCookie(String cookie) {
		this.cookie = cookie;
	}

	public String getCookie() {
		return cookie;
	}

}
