/* Copyright (c) 2006-2011 Regents of the University of Minnesota.
   For licensing terms, see the file LICENSE.
 */

package com.citizensense.android;

import java.io.File;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;

import android.app.Activity;
import android.content.Intent;
import android.graphics.Color;
import android.net.Uri;
import android.os.Bundle;
import android.os.Environment;
import android.provider.MediaStore;
import android.util.Log;
import android.view.Gravity;
import android.view.View;
import android.view.View.OnClickListener;
import android.widget.Button;
import android.widget.CheckBox;
import android.widget.CompoundButton;
import android.widget.CompoundButton.OnCheckedChangeListener;
import android.widget.EditText;
import android.widget.LinearLayout;
import android.widget.RadioButton;
import android.widget.TextView;
import android.widget.Toast;

/**
 * Complete a task, or "Sense"
 * @author Phil Brown
 */
public class Sense extends Activity {

	/** Contains the campaign object that the user is completing a task for.*/
	private Campaign campaign;
	
	/** The index of the currently-selected question in the form. */
	private int questionsIndex;
	
	/** Used for receiving Intent back from the camera. */
	public static final int CAMERA_CAPTURE_REQUEST_CODE = 100;
	
	@Override
	protected void onActivityResult(int requestCode, int resultCode, Intent data) {
	    if (requestCode == CAMERA_CAPTURE_REQUEST_CODE) {
	        if (resultCode == RESULT_OK) {
	        	//data.getData() contains the fileUri where the file is saved.
	        	CheckBox hasTakenPhoto = (CheckBox) findViewById(R.id.chkbox_photo_complete);
	        	hasTakenPhoto.setChecked(true);
	        	TextView uploadComplete = (TextView) findViewById(R.id.upload_text);
	        	uploadComplete.setText("Photo updated successfully!");
	        } else if (resultCode == RESULT_CANCELED) {
	            // User canceled the image capture. Do nothing
	        } else {
	            // Image capture failed
	        	Toast.makeText(this, "could not use incompatible camera app", 
	        			       Toast.LENGTH_SHORT).show();
	        }
	    }
	}//onActivityResult
	
	@Override
	public void onCreate(Bundle savedInstanceState) {
		super.onCreate(savedInstanceState);
		handleIntent(this.getIntent());
		setContentView(R.layout.sense);
		TextView title = (TextView) findViewById(R.id.campaign_title);
		title.setText(campaign.getName());
		Button capture = (Button) findViewById(R.id.capture_photo);
		capture.setOnClickListener(new OnClickListener() {
			@Override
			public void onClick(View v) {
				Intent intent = new Intent(MediaStore.ACTION_IMAGE_CAPTURE);

			    Uri fileUri = getOutputImageUri(); // create a file to save the image
			    intent.putExtra(MediaStore.EXTRA_OUTPUT, fileUri); // set the image file name

			    // start the image capture Intent
			    startActivityForResult(intent, CAMERA_CAPTURE_REQUEST_CODE);
			}
		});
		final LinearLayout form_container = (LinearLayout) findViewById(R.id.form_container);
		final LinearLayout[] layouts = this.renderForm();
		this.questionsIndex = 0;
		form_container.addView(layouts[questionsIndex]);
		Button next = (Button) findViewById(R.id.next_question);
		next.setOnClickListener(new OnClickListener() {
			@Override
			public void onClick(View v) {
				if (questionsIndex == layouts.length - 1) {
					questionsIndex = 0;
				}
				else {
					questionsIndex++;
				}
				form_container.removeAllViews();
				form_container.addView(layouts[questionsIndex]);
			}
		});
		Button previous = (Button) findViewById(R.id.previous_question);
		previous.setOnClickListener(new OnClickListener() {
			@Override
			public void onClick(View v) {
				if (questionsIndex == 0) {
					questionsIndex = layouts.length - 1;
				}
				else {
					questionsIndex--;
				}
				form_container.removeAllViews();
				form_container.addView(layouts[questionsIndex]);
			}
		});
	}//onCreate
	
	/** Unpacks passed-in campaign from the intent. */
	public void handleIntent(Intent i) {
		this.campaign = i.getParcelableExtra("campaign");
	}//handleIntent
	
	/** Returns the index of the currently-selected question. */
	public int getQuestionsIndex() {
		return this.questionsIndex;
	}//getQuestionsIndex
	
	/** Subclasses can set the question index. */
	protected void setQuestionsIndex(int index) {
		this.questionsIndex = index;
	}//setQuestionsIndex
	
	/** Create a File for saving an image */
	private static Uri getOutputImageUri(){
	    // To be safe, you should check that the SDCard is mounted
	    File mediaStorageDir = new File(Environment.getExternalStorageState(), "CitizenSense");
	    if (! mediaStorageDir.exists()){
	        if (! mediaStorageDir.mkdirs()){
	            Log.d("CitizenSense", "failed to create directory");
	            return null;
	        }
	    }
	    // Create a media file name
	    String timeStamp = new SimpleDateFormat("yyyyMMdd_HHmmss").format(new Date());
	    File mediaFile = new File(mediaStorageDir.getPath() + File.separator +
	        "IMG_"+ timeStamp + ".jpg");
	    return Uri.fromFile(mediaFile);
	}//getOutputImageUri
	
	/**
	 * Inflates the form object. This takes attributes from each of the
	 * questions on the form and find the best layout for them. For example,
	 * Multiple choice, single response questions use radio buttons.
	 * Multiple choice, multiple response questions use checkboxes.
	 * Written response also has a single line/multiline option.
	 * @return An array of question layouts associated with this form.
	 */
	public LinearLayout[] renderForm() {
		Form f = campaign.getTask().getForm();
		Question[] questions = f.getQuestions();
		LinearLayout[] layouts = new LinearLayout[questions.length];
		for(int i = 0; i < questions.length; i++) {
			layouts[i] = new LinearLayout(this);
			layouts[i].setOrientation(LinearLayout.VERTICAL);
			layouts[i].setLayoutParams(new LinearLayout.LayoutParams(
										LinearLayout.LayoutParams.FILL_PARENT, 
										LinearLayout.LayoutParams.FILL_PARENT));
			/* Question text */
			TextView question = new TextView(this);
			question.setText(questions[i].getQuestion());
			question.setTextColor(Color.BLACK);
			question.setGravity(Gravity.CENTER_HORIZONTAL);
			question.setLayoutParams(new LinearLayout.LayoutParams(
										LinearLayout.LayoutParams.WRAP_CONTENT, 
										LinearLayout.LayoutParams.FILL_PARENT));
			layouts[i].addView(question);
			/* Responses */
			if (questions[i].type == Question.MULTIPLE_CHOICE) {
				String[] answers = questions[i].getAnswers();
				final ArrayList<RadioButton> radiogroup = new ArrayList<RadioButton>();
				for (String option : answers) {
					LinearLayout ans = new LinearLayout(this);
					ans.setOrientation(LinearLayout.HORIZONTAL);
					ans.setLayoutParams(new LinearLayout.LayoutParams(
							LinearLayout.LayoutParams.WRAP_CONTENT, 
							LinearLayout.LayoutParams.FILL_PARENT));
					if (questions[i].isSingleChoice()) {
						final RadioButton rb = new RadioButton(this);
						rb.setLayoutParams(new LinearLayout.LayoutParams(
								LinearLayout.LayoutParams.FILL_PARENT, 
								LinearLayout.LayoutParams.WRAP_CONTENT));
						radiogroup.add(rb);
						rb.setOnCheckedChangeListener(new OnCheckedChangeListener() {
							/** If a button is selected, unselect the rest. */
							@Override
							public void onCheckedChanged(CompoundButton btn,
									boolean isChecked) {
								if (isChecked) {
									for (RadioButton b : radiogroup) {
										if (b != btn) {
											b.setChecked(false);
										}
									}
								}
								
							}//onCheckChanged
						});
						ans.addView(rb);
					}
					else {
						CheckBox cb = new CheckBox(this);
						cb.setLayoutParams(new LinearLayout.LayoutParams(
								LinearLayout.LayoutParams.FILL_PARENT, 
								LinearLayout.LayoutParams.WRAP_CONTENT));
						ans.addView(cb);
					}
					TextView tv = new TextView(this);
					tv.setText(option);
					tv.setTextColor(Color.BLACK);
					tv.setLayoutParams(new LinearLayout.LayoutParams(
							LinearLayout.LayoutParams.FILL_PARENT, 
							LinearLayout.LayoutParams.WRAP_CONTENT));
					ans.addView(tv);
					layouts[i].addView(ans);
				}
			}
			else if (questions[i].type == Question.WRITTEN_RESPONSE) {
				EditText et = new EditText(this);
				et.setSingleLine(questions[i].isSingleLine());
				et.setGravity(Gravity.TOP);
				et.setLayoutParams(new LinearLayout.LayoutParams(
						LinearLayout.LayoutParams.FILL_PARENT, 
						LinearLayout.LayoutParams.FILL_PARENT));
				layouts[i].addView(et);
			}
		}
		return layouts;
	}//renderForm
	
}//Sense
