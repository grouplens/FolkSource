/* Copyright (c) 2006-2011 Regents of the University of Minnesota.
   For licensing terms, see the file LICENSE.
 */

package com.citizensense.android;

import java.io.File;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;

import com.citizensense.android.conf.Constants;

import android.content.Intent;
import android.graphics.Color;
import android.net.Uri;
import android.os.Bundle;
import android.os.Environment;
import android.provider.MediaStore;
import android.text.Editable;
import android.text.TextWatcher;
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
 * Complete a task, or "Sense" data
 * @author Phil Brown
 */
public class Sense extends LocationActivity {

	/** Contains the campaign object that the user is completing a task for.*/
	private Campaign campaign;
	/** The index of the currently-selected question in the form. */
	private int questionsIndex;
	/** The Uri of the image that the user is submitting, or null if none has
	 * been assigned. */
	private Uri imageUri;
	/** Used for receiving Intent back from the camera. */
	public static final int CAMERA_CAPTURE_REQUEST_CODE = 100;
	/** 
	 * This contains all of the answers that the user has completed. Using a 
	 * HashMap will be effective for storage, because 1) it is simple, 2) it
	 * is Serializable (which may be helpful), and 3) It will be easy to
	 * port answers to XML. */
	private HashMap<String, String> answers;
	
	@Override
	public void onActivityResult(int requestCode, int resultCode, Intent data) {
	    if (requestCode == CAMERA_CAPTURE_REQUEST_CODE) {
	        if (resultCode == RESULT_OK) {
	        	//this.imageUri = data.getData();
	        	//uri is already set. Do nothing.
	        	CheckBox hasTakenPhoto = (CheckBox) findViewById(R.id.chkbox_photo_complete);
	        	hasTakenPhoto.setChecked(true);
	        	validateForm();
	        	TextView uploadComplete = (TextView) findViewById(R.id.upload_text);
	        	uploadComplete.setText("Photo updated successfully!");
	        } else if (resultCode == RESULT_CANCELED) {
	            // User canceled the image capture. Do nothing
	        	this.imageUri = null;
	        } else {
	            // Image capture failed
	        	Toast.makeText(this, "could not use incompatible camera app", 
	        			       Toast.LENGTH_SHORT).show();
	        	this.imageUri = null;
	        }
	    }
	    else {
	    	super.onActivityResult(requestCode, resultCode, data);
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
			    Sense.this.imageUri = fileUri;
			    intent.putExtra(MediaStore.EXTRA_OUTPUT, fileUri); // set the image file name

			    // start the image capture Intent
			    startActivityForResult(intent, CAMERA_CAPTURE_REQUEST_CODE);
			}
		});
		Button upload = (Button) findViewById(R.id.upload_photo);
		//FIXME make this a file chooser instead.
		upload.setOnClickListener(new OnClickListener() {
			@Override
			public void onClick(View v) {
				Sense.this.imageUri=Uri.parse("fake://uri");
				CheckBox hasTakenPhoto = (CheckBox) findViewById(R.id.chkbox_photo_complete);
	        	hasTakenPhoto.setChecked(true);
	        	validateForm();
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
		Button submit = (Button) findViewById(R.id.submit);
		submit.setOnClickListener(new OnClickListener() {
			@Override
			public void onClick(View v) {
				submit();
			}
		});
		this.answers = new HashMap<String, String>();
		this.requestLocation();
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
	private Uri getOutputImageUri(){
	    // To be safe, you should check that the SDCard is mounted
	    File mediaStorageDir = new File(Environment.getExternalStorageDirectory(), "CitizenSense");
	    if (!mediaStorageDir.exists()){
	        if (!mediaStorageDir.mkdirs()){
	            Log.e("CitizenSense", "failed to create directory");
	            return null;
	        }
	    }
	    // Create a media file name
	    String timeStamp = new SimpleDateFormat("yyyyMMdd_HHmmss").format(new Date());
	    File mediaFile = new File(mediaStorageDir.getPath() + File.separator +
	        "IMG_"+ timeStamp + ".jpg");
	    if (Constants.DEBUG) {
	    	Log.d("Sense", "Image URI set to " + mediaFile.getName());
	    }
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
				for (final String option : answers) {
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
						final String questionString = questions[i].getQuestion();
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
									Sense.this.answers.put(questionString, option);
								}
								validateForm();
							}
						});
						ans.addView(rb);
					}
					else {
						CheckBox cb = new CheckBox(this);
						cb.setLayoutParams(new LinearLayout.LayoutParams(
								LinearLayout.LayoutParams.FILL_PARENT, 
								LinearLayout.LayoutParams.WRAP_CONTENT));
						ans.addView(cb);
						final String questionString = questions[i].getQuestion();
						cb.setOnCheckedChangeListener(new OnCheckedChangeListener() {
							@Override
							public void onCheckedChanged(CompoundButton buttonView,
									boolean isChecked) {
								if (isChecked) {
									Sense.this.answers.put(questionString, option);
								}
								validateForm();
							}
						});
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
				final String questionString = questions[i].getQuestion();
				et.setSingleLine(questions[i].isSingleLine());
				et.setGravity(Gravity.TOP);
				et.setLayoutParams(new LinearLayout.LayoutParams(
						LinearLayout.LayoutParams.FILL_PARENT, 
						LinearLayout.LayoutParams.FILL_PARENT));
				layouts[i].addView(et);
				et.addTextChangedListener(new TextWatcher() {
					@Override
					public void afterTextChanged(Editable s) {}

					@Override
					public void beforeTextChanged(CharSequence s, int start,
							int count, int after) {}

					@Override
					public void onTextChanged(CharSequence s, int start,
							int before, int count) {
						if (s.length() != 0) {
							Sense.this.answers.put(questionString, s.toString());
							validateForm();
						}
						else {
							Sense.this.answers.put(questionString, null);
							invalidateForm();
						}
					}
				});
			}
		}
		return layouts;
	}//renderForm
	
	/** Sets the submit button to disabled. This is used when not all answers,
	 * or the location, or the image have been added. */
	public void invalidateForm() {
		((Button) findViewById(R.id.submit)).setEnabled(false);
	}//invalidateForm
	
	/** If all the answers to the form are answered, validate that a photo and
	 * location are set and enable the submit button. */
	public void validateForm() {
		if (this.answers.size() == campaign.getTask().getForm().getQuestions().length) {
			if (this.hasLocationFix()) {
				if (this.imageUri != null) {
					((Button) findViewById(R.id.submit)).setEnabled(true);
				}
				else {
					if (Constants.DEBUG) {
						Log.d("Sense", "no image Uri");
					}
				}
			}
			else {
				if (Constants.DEBUG) {
					Log.d("Sense", "no location fix");
				}
			}
		}
		else {
			if (Constants.DEBUG) {
				Log.d("Sense", "there are unanswered questions");
			}
		}
	}//validateForm
		
	public void submit() {
		if (!this.hasLocationFix()) {
			this.requestLocation();
		}
		else {
			Toast.makeText(this, "Task Complete!", Toast.LENGTH_SHORT).show();
			//TODO get answers, image, and location written to xml and sent to server.
			this.finish();
		}
	}//submit

	@Override
	public boolean allowsNetworksLocations() {
		return true;
	}//allowsNetworksLocations

	@Override
	public void onGpsFirstFix() {}

	@Override
	public void onSatelliteEvent(int count) {}

	@Override
	public void onGpsStarted() {}

	@Override
	public void onGpsStopped() {}
	
}//Sense
