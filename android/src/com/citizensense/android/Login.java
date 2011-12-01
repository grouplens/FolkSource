/* Copyright (c) 2006-2011 Regents of the University of Minnesota.
   For licensing terms, see the file LICENSE.
 */

package com.citizensense.android;

import com.citizensense.android.conf.Constants;

import android.app.Activity;
import android.app.AlertDialog;
import android.content.DialogInterface;
import android.content.Intent;
import android.os.Bundle;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;
import android.widget.Toast;

/**
 * Login screen
 * @author Phil Brown
 */
public class Login extends Activity {
	private int regRequestCode;

	@Override
	public void onCreate(Bundle savedInstanceState) {
		super.onCreate(savedInstanceState);
		setContentView(R.layout.login);
		final EditText uname = (EditText) findViewById(R.id.username_field);
		final EditText passwd = (EditText) findViewById(R.id.password_field);
		Button btn = (Button) findViewById(R.id.login_btn);
		Button reg_btn = (Button) findViewById(R.id.to_reg_btn);
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
		
		reg_btn.setOnClickListener(new View.OnClickListener() {
			@Override
			public void onClick(View v) {
				Intent intent = new Intent(v.getContext(),Register.class);
				startActivityForResult(intent, regRequestCode);
			}
		});
		
		
	}//onCreate
	
	@Override
    protected void onActivityResult(int requestCode, int resultCode, Intent data) {
        super.onActivityResult(requestCode, resultCode, data);
        if(resultCode== Constants.REGISTRATION_SUCCESS){
        	finish();
        }
        else{
        }
    }
	
	/**
	 * Try to login to the server. This currently just finishes the activity.
	 * @param username
	 * @param password
	 */
	public void login(String username, String password) {
		//FIXME try logging in to server, handler errors
		int login_result = G.user.login(username, password);
		if( login_result == Constants.LOGIN_SUCCESS){
			finish();
		}else if(login_result == Constants.LOGIN_WRONG_PASSWORD){
			Toast.makeText(this, "Wrong password. Please try agaign.", Toast.LENGTH_LONG).show();
		}else if(login_result == Constants.LOGIN_NO_USERNAME){
			Toast.makeText(this, "No such user name. Create a new account!", Toast.LENGTH_LONG).show();
		}
	}//login
	
}//Login
