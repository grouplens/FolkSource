/* Copyright (c) 2006-2011 Regents of the University of Minnesota.
   For licensing terms, see the file LICENSE.
 */

package com.citizensense.android;

import java.io.File;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;

import android.content.Intent;
import android.content.res.Configuration;
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

import com.citizensense.android.conf.Constants;
import com.citizensense.android.net.ImageResponseHandler;
import com.citizensense.android.net.PostRequest;
import com.google.android.maps.GeoPoint;

/**
 * Complete a task, or "Sense" data
 * 
 * @author Phil Brown
 * @author Renji Yu
 */
public class Sense extends LocationActivity {

	/** Contains the campaign object that the user is completing a task for. */
	private Campaign campaign;
	
	/** Questions defined in the campaign*/
	private Question[] questions;
	/** The index of the currently-selected question in the form. */
	private int questionsIndex;
	/**
	 * The Uri of the image that the user is submitting, or null if none has
	 * been assigned.
	 */
	private Uri imageUri;
	/** The temp Uri of the image when the user taking a photo. This may not be 
	 * assigned to imageUri, since the user may retake or cancel. */
	private Uri tempImageUri;
	
	/** Used for receiving Intent back from the camera. */
	public static final int CAMERA_CAPTURE_REQUEST_CODE = 100;

	/** Used for image upload post request. */
	public static final int IMAGE = 4;
	/**
	 * This contains all of the answers that the user has completed. Using a
	 * HashMap will be effective for storage, because 1) it is simple, 2) it is
	 * Serializable (which may be helpful), and 3) It will be easy to port
	 * answers to XML.
	 */
	private HashMap<String, String> answers;
	/** Check box indicates the status of image taken */
	private CheckBox hasTakenPhoto;
	/** Text to show the status about image taken and upload */
	private TextView photoText;
	/** Button to take a picture */
	private Button capture;
	/** Button to show next question */
	private Button next;
	/** Button to show previous question */
	private Button previous;
	/** Button to submit form and image*/
	private Button submit;
	
	private LinearLayout form_container;
	private LinearLayout[] layouts;
	
	/** TextView for campaign title */
	private TextView title;
	
	/** The user's location */
	private GeoPoint pt;


	@Override
	public void onCreate(Bundle savedInstanceState) {
		super.onCreate(savedInstanceState);
		setContentView(R.layout.sense);
		title = (TextView) findViewById(R.id.campaign_title);
		capture = (Button) findViewById(R.id.capture_photo);
		hasTakenPhoto = (CheckBox) findViewById(R.id.chkbox_photo_complete);
		photoText = (TextView) findViewById(R.id.upload_text);
		next = (Button) findViewById(R.id.next_question);
		previous = (Button) findViewById(R.id.previous_question);
		submit = (Button) findViewById(R.id.submit);
		form_container = (LinearLayout) findViewById(R.id.form_container);
		questionsIndex = 0;
		handleIntent(this.getIntent());
		initiateUI();
	}// onCreate
	
	@Override
	public void onResume(){
		super.onResume();
	}
	
	/** Unpacks passed-in campaign from the intent. */
	public void handleIntent(Intent i) {
		campaign = i.getParcelableExtra("campaign");
		int[] t = i.getIntArrayExtra("taskLocation");
		if(t != null) {
			pt = new GeoPoint(t[0], t[1]);
		}
		if(t == null)
			Log.e("SENSE", "usr's location is null");
		if(campaign == null){
			Log.e("SENSE","campaign is null");
		}else if(campaign.getTask()== null){
			Log.e("SENSE","campaign.getTask() is null");
		}else if(campaign.getTask().getForm()==null){
			Log.e("SENSE","campaign.getTask().getForm() is null");
		}else{
			questions = campaign.getTask().getForm().getQuestions();
		}
	}// handleIntent
	
	public void initiateUI(){
		layouts = getFormLayout(questions);
		setListeners();
		if(campaign!=null && campaign.getName()!=null)
			title.setText(campaign.getName());
		answers = new HashMap<String, String>();
		if(form_container==null || layouts==null) return;
		form_container.addView(layouts[questionsIndex]);
		if (layouts.length <= 1) {
			next.setVisibility(View.GONE);
			previous.setVisibility(View.GONE);
		}
		if(pt == null) {
			this.requestLocation();
		}
	}
	
	/** set listeners for UI components */
	public void setListeners(){
		//set listner for capture button
		capture.setOnClickListener(new OnClickListener() {
			@Override
			public void onClick(View v) {
				Intent intent = new Intent(MediaStore.ACTION_IMAGE_CAPTURE);
				tempImageUri = getOutputImageUri(); // create a file to save the image
				if(tempImageUri!=null){
					intent.putExtra(MediaStore.EXTRA_OUTPUT, tempImageUri); 
					startActivityForResult(intent, CAMERA_CAPTURE_REQUEST_CODE);
				}else
					Toast.makeText(Sense.this, "Sorry. Please check your storage.", Toast.LENGTH_SHORT).show();
			}
		});
		//set listener for next button
		next.setOnClickListener(new OnClickListener() {
			@Override
			public void onClick(View v) {
				if(layouts == null) return;
				
				if (questionsIndex == layouts.length - 1) {
					questionsIndex = 0;
				} else {
					questionsIndex++;
				}
				form_container.removeAllViews();
				form_container.addView(layouts[questionsIndex]);
			}
		});
		//set listener for previous button
		previous.setOnClickListener(new OnClickListener() {
			@Override
			public void onClick(View v) {
				if(layouts == null) return;
				
				if (questionsIndex == 0) {
					questionsIndex = layouts.length - 1;
				} else {
					questionsIndex--;
				}
				form_container.removeAllViews();
				form_container.addView(layouts[questionsIndex]);
			}
		});
		//set listener for submit button
		submit.setOnClickListener(new OnClickListener() {
			@Override
			public void onClick(View v) {
				submit();
			}
		});
	}


	@Override
	public void onActivityResult(int requestCode, int resultCode, Intent data) {
		if (requestCode == CAMERA_CAPTURE_REQUEST_CODE) {
			if (resultCode == RESULT_OK) {
				hasTakenPhoto.setChecked(true);
				Sense.this.imageUri = tempImageUri;
				photoText.setText("Photo is stored for upload later.");
			} else if (resultCode == RESULT_CANCELED) {
				// User canceled the image capture. Do nothing
			} else {
				// Image capture failed
				Toast.makeText(this, "could not use incompatible camera app",
						Toast.LENGTH_SHORT).show();
			}
		} else {
			super.onActivityResult(requestCode, resultCode, data);
		}
		validateForm();
	}// onActivityResult
	
	/** Returns the index of the currently-selected question. */
	public int getQuestionsIndex() {
		return this.questionsIndex;
	}// getQuestionsIndex

	/** Subclasses can set the question index. */
	protected void setQuestionsIndex(int index) {
		this.questionsIndex = index;
	}// setQuestionsIndex

	/** Create a File for saving an image */
	private Uri getOutputImageUri() {
		// To be safe, you should check that the SDCard is mounted
		File mediaStorageDir = new File(
				Environment.getExternalStorageDirectory(), "CitizenSense");
		if (!mediaStorageDir.exists()) {
			if (!mediaStorageDir.mkdirs()) {
				Log.e("CitizenSense", "failed to create directory");
				return null;
			}
		}
		// Create a media file name
		String timeStamp = new SimpleDateFormat("yyyyMMdd_HHmmss")
				.format(new Date());
		File mediaFile = new File(mediaStorageDir.getPath() + File.separator
				+ campaign.getName() + "_" + timeStamp + ".jpg");
		if (Constants.DEBUG) {
			Log.d("Sense", "Image URI set to " + mediaFile.getName());
		}
		return Uri.fromFile(mediaFile);
	}// getOutputImageUri

	
	/** Create view for question text and add it to layout */
	public void addQuestionView(LinearLayout layout, Question question){
		if(question == null || layout==null) return;
		TextView questionText = new TextView(this);
		questionText.setText(question.getQuestion());
		questionText.setTextColor(Color.WHITE);// BLACK);
		questionText.setGravity(Gravity.CENTER_HORIZONTAL);
		questionText.setLayoutParams(new LinearLayout.LayoutParams(
				LinearLayout.LayoutParams.WRAP_CONTENT,
				LinearLayout.LayoutParams.FILL_PARENT));
		layout.addView(questionText);
	}
	
	/** Create view for the answer based on question's type and add it to layout*/
	public void addAnswerView(LinearLayout layout, Question question){
		if(question==null || layout==null) return;
		
		if (question.getType() == Question.MULTIPLE_CHOICE) {
			String[] answers = question.getAnswers();
			final ArrayList<RadioButton> radiogroup = new ArrayList<RadioButton>();
			for (final String option : answers) {
				LinearLayout ans = new LinearLayout(this);
				ans.setOrientation(LinearLayout.HORIZONTAL);
				ans.setLayoutParams(new LinearLayout.LayoutParams(
						LinearLayout.LayoutParams.WRAP_CONTENT,
						LinearLayout.LayoutParams.FILL_PARENT));
				if (question.isSingleChoice()) {
					final RadioButton rb = new RadioButton(this);
					rb.setLayoutParams(new LinearLayout.LayoutParams(
							LinearLayout.LayoutParams.FILL_PARENT,
							LinearLayout.LayoutParams.WRAP_CONTENT));
					radiogroup.add(rb);
					final String questionString = question
							.getQuestion();
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
								Sense.this.answers.put(questionString,
										option);
							}
							validateForm();
						}
					});
					ans.addView(rb);
				} else {
					CheckBox cb = new CheckBox(this);
					cb.setLayoutParams(new LinearLayout.LayoutParams(
							LinearLayout.LayoutParams.FILL_PARENT,
							LinearLayout.LayoutParams.WRAP_CONTENT));
					ans.addView(cb);
					final String questionString = question.getQuestion();
					cb.setOnCheckedChangeListener(new OnCheckedChangeListener() {
						@Override
						public void onCheckedChanged(
								CompoundButton buttonView, boolean isChecked) {
							if (isChecked) {
								Sense.this.answers.put(questionString,
										option);
							}
							validateForm();
						}
					});
				}
				TextView tv = new TextView(this);
				tv.setText(option);
				tv.setTextColor(Color.WHITE);// BLACK);
				tv.setLayoutParams(new LinearLayout.LayoutParams(
						LinearLayout.LayoutParams.FILL_PARENT,
						LinearLayout.LayoutParams.WRAP_CONTENT));
				ans.addView(tv);
				layout.addView(ans);
			}
		} else if (question.getType() == Question.WRITTEN_RESPONSE) {
			EditText et = new EditText(this);
			final String questionString = question.getQuestion();
			et.setSingleLine(question.isSingleLine());
			et.setGravity(Gravity.TOP);
			et.setLayoutParams(new LinearLayout.LayoutParams(
					LinearLayout.LayoutParams.FILL_PARENT,
					LinearLayout.LayoutParams.FILL_PARENT));
			layout.addView(et);
			et.addTextChangedListener(new TextWatcher() {
				@Override
				public void afterTextChanged(Editable s) {
				}

				@Override
				public void beforeTextChanged(CharSequence s, int start,
						int count, int after) {
				}

				@Override
				public void onTextChanged(CharSequence s, int start,
						int before, int count) {
					if (s.length() != 0) {
						Sense.this.answers.put(questionString, s.toString());
						validateForm();
					} else {
						Sense.this.answers.put(questionString, null);
						invalidateForm();
					}
				}
			});
		}
		
	}
	
	/**
	 * Inflates the form object. This takes attributes from each of the
	 * questions on the form and find the best layout for them. For example,
	 * Multiple choice, single response questions use radio buttons. Multiple
	 * choice, multiple response questions use checkboxes. Written response also
	 * has a single line/multiline option.
	 * 
	 * @return An array of question layouts associated with this form.
	 */
	public LinearLayout[] getFormLayout(Question[] questions) {
		if(questions == null){
			Log.e("SENSE","questions is null");
			return null;
		}
		layouts = new LinearLayout[questions.length];
		for (int i = 0; i < questions.length; i++) {
			layouts[i] = new LinearLayout(this);
			layouts[i].setOrientation(LinearLayout.VERTICAL);
			layouts[i].setLayoutParams(new LinearLayout.LayoutParams(
					LinearLayout.LayoutParams.FILL_PARENT,
					LinearLayout.LayoutParams.FILL_PARENT));
			addQuestionView(layouts[i],questions[i]);
			addAnswerView(layouts[i],questions[i]);
		}
		return layouts;
	}// renderForm

	/**
	 * Sets the submit button to disabled. This is used when not all answers, or
	 * the location, or the image have been added.
	 */
	public void invalidateForm() {
		((Button) findViewById(R.id.submit)).setEnabled(false);
	}// invalidateForm

	/**
	 * If all the answers to the form are answered, validate that a photo and
	 * location are set and enable the submit button.
	 */
	public void validateForm() {
		if (this.answers.size() == campaign.getTask().getForm().getQuestions().length) {
			if (this.hasLocationFix() || this.pt != null) { 
				if (hasTakenPhoto.isChecked()) {
					((Button) findViewById(R.id.submit)).setEnabled(true);
				} else {
					if (Constants.DEBUG) {
						Log.d("Sense", "no image Uri");
					}
				}
			} else {
				if (Constants.DEBUG) {
					Log.d("Sense", "no location fix");
				}
			}
		} else {
			if (Constants.DEBUG) {
				Log.d("Sense", "there are unanswered questions");
			}
		}
	}// validateForm

	public void submit() {
		if (!this.hasLocationFix()) {
			if(this.pt == null) {
				this.requestLocation();
				Log.d("TAP", "submit requesting location");
			}
		} else {

			// Upload the image to server
			if (G.user.getUsername().equals("Anonymous")) {
				Toast.makeText(this,
						"Sorry. Submission is not allowed for anonymous user.",
						Toast.LENGTH_LONG).show();
			} else if(this.imageUri!=null){
				// to resolve UI conflict, move submission post request into
				// ImageResponseHandler
				uploadImageAndForm(this.imageUri, new Submission(buildXML()));
			}
		}
	}// submit

	/** Build a submission XML */
	
	/** Build XML string for the submission */
	public String buildXML() {
		StringBuilder submission = new StringBuilder();
		submission.append("<org.citizensense.model.Submission>");
		submission.append("<task_id>" + this.campaign.getTaskId()
				+ "</task_id>");
		if(this.pt == null)//user's location is not provided
			submission.append("<gps_location>" + this.location.getLatitude() + "|"
				+ this.location.getLongitude() + "</gps_location>");
		else
			//TODO fix this later
			submission.append("<gps_location>" + (double)this.pt.getLongitudeE6()/1E6 + "|"
						+ (double)this.pt.getLatitudeE6()/1E6 +";"+ this.location.getLatitude() + "|"
						+ this.location.getLongitude() + "</gps_location>");
		submission.append("<user_id>" + G.user.id + "</user_id>");				
		submission.append("<answers>");
		Form f = campaign.getTask().getForm();
		Question[] questions = f.getQuestions();
		String[] ans = new String[this.answers.size()];
		ans = this.answers.keySet().toArray(ans);
		for (int i = 0; i < ans.length; i++) {
			submission.append("<org.citizensense.model.Answer>");
			submission.append("<id>" + i + "</id>");
			submission.append("<answer>" + this.answers.get(ans[i])
					+ "</answer>");
			Question q = null;
			for (Question question : questions) {
				if (question.getQuestion().equals(ans[i])) {
					q = question;
					q.setId(i);
					break;
				}
			}
			if (q == null) {
				submission.append("<type>NaN</type>");
				submission.append("<q_id>NaN</q_id>");
			} else {
				submission.append("<type>" + q.getType() + "</type>");
				submission.append("<q_id>" + (q.getId() + 1) + "</q_id>");
			}
			submission.append("<sub_id>-1</sub_id>"); // gets reset on the
														// server depending on
														// the ID of this
														// submission
			submission.append("</org.citizensense.model.Answer>");
		}
		submission.append("</answers>");
		submission.append("</org.citizensense.model.Submission>");
		return submission.toString();
	}// buildXML

	/** Upload the photo to server. */
	
	/** Send HttpRequest to upload image and form(questions and answers) */
	public void uploadImageAndForm(Uri uri, Submission submission) {
		String imagePath = uri.getPath();
		ImageResponseHandler imageUploadHandler = new ImageResponseHandler(
				this, submission);
		new PostRequest(this, null, IMAGE, imageUploadHandler, true).execute(
				G.user.getUsername(), imagePath);
	}

	@Override
	public boolean allowsNetworksLocations() {
		return true;
	}// allowsNetworksLocations

	@Override
	public void onGpsFirstFix() {
	}

	@Override
	public void onSatelliteEvent(int count) {
	}

	@Override
	public void onGpsStarted() {
	}

	@Override
	public void onGpsStopped() {
	}
	
	@Override
	//This is called when the user rotate the screen
    public void onConfigurationChanged(Configuration newConfig) 
    {
		super.onConfigurationChanged(newConfig);
    }

}// Sense
