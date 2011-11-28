/* Copyright (c) 2006-2011 Regents of the University of Minnesota.
   For licensing terms, see the file LICENSE.
 */

package com.citizensense.android;

import android.app.Activity;
import android.app.AlertDialog;
import android.content.DialogInterface;
import android.os.Bundle;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;

/**
 * Login screen
 * @author Phil Brown
 */
public class Login extends Activity {

	@Override
	public void onCreate(Bundle savedInstanceState) {
		super.onCreate(savedInstanceState);
		setContentView(R.layout.login);
		final EditText uname = (EditText) findViewById(R.id.username_field);
		final EditText passwd = (EditText) findViewById(R.id.password_field);
		Button btn = (Button) findViewById(R.id.login_btn);
		btn.setOnClickListener(new View.OnClickListener() {
			
			@Override
			public void onClick(View v) {
				String username = uname.getText().toString();
				String password = passwd.getText().toString();
				if (username == null || password == null
				    || username.length() == 0 || password.length() == 0) {
					new AlertDialog.Builder(Login.this)
					       .setMessage("Fields cannot be empty!")
					       .setNeutralButton("Ok", new DialogInterface.OnClickListener() {
								@Override
								public void onClick(DialogInterface dialog, int which) {
									dialog.dismiss();
								}
					        })
					        .show();
				}
				else {
					login(username, password);
				}
			}
		});
	}//onCreate
	
	/**
	 * Try to login to the server. This currently just finishes the activity.
	 * @param username
	 * @param password
	 */
	public void login(String username, String password) {
		//FIXME try logging in to server, handler errors
		G.user.login(username, password);
		finish();
	}//login
}//Login
