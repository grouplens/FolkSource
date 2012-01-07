/* Copyright (c) 2006-2011 Regents of the University of Minnesota.
   For licensing terms, see the file LICENSE.
 */

package com.citizensense.android;

import android.app.Activity;
import android.app.AlertDialog;
import android.content.DialogInterface;
import android.content.Intent;
import android.os.Bundle;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;
import android.widget.Toast;

import com.citizensense.android.conf.Constants;

/**
 * Registration screen
 * @author Renji Yu
 */
public class Register extends Activity {

	@Override
	public void onCreate(Bundle savedInstanceState) {
		super.onCreate(savedInstanceState);
		setContentView(R.layout.register);
		final EditText uname = (EditText) findViewById(R.id.reg_username);
		final EditText passwd = (EditText) findViewById(R.id.reg_password);
		final EditText passwd2 = (EditText) findViewById(R.id.reg_password2);
		Button btn = (Button) findViewById(R.id.reg_btn);
		btn.setOnClickListener(new View.OnClickListener() {
			
			@Override
			public void onClick(View v) {
				String username = uname.getText().toString();
				String password = passwd.getText().toString();
				String password2 = passwd2.getText().toString();
				
				if (username == null || password == null ||password2 == null
				    || username.length() == 0 || password.length() == 0) {
					new AlertDialog.Builder(Register.this)
					       .setMessage("Fields cannot be empty!")
					       .setNeutralButton("Ok", new DialogInterface.OnClickListener() {
								@Override
								public void onClick(DialogInterface dialog, int which) {
									dialog.dismiss();
								}
					        })
					        .show();
				}
				else if(!password2.equals(password)){
					new AlertDialog.Builder(Register.this)
				       .setMessage("Password don't match!")
				       .setNeutralButton("Ok", new DialogInterface.OnClickListener() {
							@Override
							public void onClick(DialogInterface dialog, int which) {
								dialog.dismiss();
							}
				        })
				        .show();
				}
				else {
					register(username, password);
				}
			}
		});
	}//onCreate
	
	/**
	 * Register a new account for the user.
	 * @param username
	 * @param password
	 */
	public void register(String username, String password) {
		G.user.register(this,username, password);
	}//Register
}//Register
