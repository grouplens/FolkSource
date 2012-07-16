package com.citizensense.android;

import java.util.regex.Matcher;
import java.util.regex.Pattern;

import android.app.Activity;
import android.app.AlertDialog;
import android.content.DialogInterface;
import android.os.Bundle;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;

public class ForgetPassword extends Activity {
	/** Button for submit. */
	Button submit_btn;
	/** EditText for email field. */
	EditText email_text;
	/** String corresponds to EditText email_text. */
	String email;

	@Override
	public void onCreate(Bundle savedInstanceState) {
		super.onCreate(savedInstanceState);
		setContentView(R.layout.forget_password);

		submit_btn = (Button) findViewById(R.id.submit_btn);
		email_text = (EditText) findViewById(R.id.email_text);

		submit_btn.setOnClickListener(new View.OnClickListener() {
			@Override
			public void onClick(View v) {
				email = email_text.getText().toString();
				String expression = "^[_A-Za-z0-9-]+(\\.[_A-Za-z0-9-]+)*@[A-Za-z0-9]+(\\.[A-Za-z0-9]+)*(\\.[A-Za-z]{2,})$";
				Pattern pattern = Pattern.compile(expression);
				Matcher matcher = pattern.matcher(email);
				String message = "";

				if (matcher.matches()) {
					if (findPassword()) {
						message = "An email of instruction is sent to you.";
					} else {
						message = "Network error. Please try later.";
					}
				} else {
					message = "Email format is not correct!";
				}
				new AlertDialog.Builder(ForgetPassword.this)
						.setMessage(message)
						.setNeutralButton("Ok",
								new DialogInterface.OnClickListener() {
									@Override
									public void onClick(DialogInterface dialog,
											int which) {
										dialog.dismiss();
									}
								}).show();
				// FIXME:Couldn't use finish(). It destroys the dialog
				// immediately, thus the user couldn't see the dialog.
				// Now the user have to press "Back" manually after submitting
				// the email.
				// if (matcher.matches())
				// ((Activity) v.getContext()).finish();
			}
		});
	}

	/** Send find password request to server. */
	public boolean findPassword() {
		// FIXME:to be implemented
		return true;
	}
}
