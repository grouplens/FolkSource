/* Copyright (c) 2006-2011 Regents of the University of Minnesota.
   For licensing terms, see the file LICENSE.
 */

package com.citizensense.android;

import java.util.regex.Matcher;
import java.util.regex.Pattern;

import android.app.Activity;
import android.app.AlertDialog;
import android.content.DialogInterface;
import android.os.Bundle;
import android.view.View;
import android.widget.Button;
import android.widget.CheckBox;
import android.widget.EditText;

/**
 * Registration screen
 * 
 * @author Renji Yu
 */
public class Register extends Activity {
	/** register button*/
	Button btn;
	/** EditText for email*/
	EditText email_text; 
	/** EditText for user name*/
	EditText uname;
	/** EditText for password*/
	EditText passwd;
	/** EditText for confirm password*/
	EditText passwd2;
	/** CheckBox for RememberMe*/
	CheckBox remember_cb;
	
	/** String corresponds to EditText email_text*/
	String email;
	/** String corresponds to EditText uname*/
	String username;
	/** String corresponds to EditText passwd*/
	String password;
	/** String corresponds to EditText passwd2*/
	String password2;

	@Override
	public void onCreate(Bundle savedInstanceState) {
		super.onCreate(savedInstanceState);
		setContentView(R.layout.register);
		email_text = (EditText) findViewById(R.id.reg_email);
		uname = (EditText) findViewById(R.id.reg_username);
		passwd = (EditText) findViewById(R.id.reg_password);
		passwd2 = (EditText) findViewById(R.id.reg_password2);
		btn = (Button) findViewById(R.id.reg_btn);
		remember_cb = (CheckBox) findViewById(R.id.reg_rem_cb);

		btn.setOnClickListener(new View.OnClickListener() {
			@Override
			public void onClick(View v) {
				email = email_text.getText().toString();
				username = uname.getText().toString();
				password = passwd.getText().toString();
				password2 = passwd2.getText().toString();
				if (checkFields(v))
					register(username, password, email);
			}
		});
		
		remember_cb.setOnClickListener(new View.OnClickListener() {
			@Override
			public void onClick(View v) {
				if(remember_cb.isChecked()){
					G.user.setRemembered(true);
				}
			}
		});
	}// onCreate

	/** Checks the inputs. Return true if all input fields are valid.*/
	public boolean checkFields(View v) {
		if (username == null || password == null || password2 == null
				|| email_text == null || username.length() == 0
				|| password.length() == 0 || email.length() == 0) {
			new AlertDialog.Builder(Register.this)
					.setMessage("Fields cannot be empty!")
					.setNeutralButton("Ok",
							new DialogInterface.OnClickListener() {
								@Override
								public void onClick(DialogInterface dialog,
										int which) {
									dialog.dismiss();
								}
							}).show();
			return false;
		} else if (!checkEmail(email)) {
			new AlertDialog.Builder(Register.this)
					.setMessage("Email format is not correct!")
					.setNeutralButton("Ok",
							new DialogInterface.OnClickListener() {
								@Override
								public void onClick(DialogInterface dialog,
										int which) {
									dialog.dismiss();
								}
							}).show();
			return false;

		} else if (username == "Anonymous") {
			// We do not allow user to register "Anonymous".
			// It is used for anonymous user.
			new AlertDialog.Builder(Register.this)
					.setMessage("This name is not allowed to register!")
					.setNeutralButton("Ok",
							new DialogInterface.OnClickListener() {
								@Override
								public void onClick(DialogInterface dialog,
										int which) {
									dialog.dismiss();
								}
							}).show();
			return false;
		} else if (!password2.equals(password)) {
			new AlertDialog.Builder(Register.this)
					.setMessage("Password don't match!")
					.setNeutralButton("Ok",
							new DialogInterface.OnClickListener() {
								@Override
								public void onClick(DialogInterface dialog,
										int which) {
									dialog.dismiss();
								}
							}).show();
			return false;
		} else
			return true;
	}

	/** Check the format of email. Return true if email is valid.*/
	public boolean checkEmail(String email) {
		String expression = "^[_A-Za-z0-9-]+(\\.[_A-Za-z0-9-]+)*@[A-Za-z0-9]+(\\.[A-Za-z0-9]+)*(\\.[A-Za-z]{2,})$";
		Pattern pattern = Pattern.compile(expression);
		Matcher matcher = pattern.matcher(email);
		return matcher.matches();
	}

	/**
	 * Register a new account for the user.
	 * 
	 * @param username
	 * @param password
	 */
	public void register(String username, String password, String email) {
		G.user.register(this, username, password, email);
	}// Register
}// Register
