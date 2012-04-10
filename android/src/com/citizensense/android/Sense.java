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
	/** The index of the currently-selected question in the form. */
	private int questionsIndex;
	/**
	 * The Uri of the image that the user is submitting, or null if none has
	 * been assigned.
	 */
	private Uri imageUri;
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
	/** The user's location */
	private GeoPoint pt;

	@Override
	public void onActivityResult(int requestCode, int resultCode, Intent data) {
		if (requestCode == CAMERA_CAPTURE_REQUEST_CODE) {
			if (resultCode == RESULT_OK) {
				// this.imageUri = data.getData();
				// uri is already set. Do nothing.
				hasTakenPhoto.setChecked(true);
				photoText.setText("Photo is stored for upload later.");
			} else if (resultCode == RESULT_CANCELED) {
				// User canceled the image capture. Do nothing
				this.imageUri = null;
			} else {
				// Image capture failed
				Toast.makeText(this, "could not use incompatible camera app",
						Toast.LENGTH_SHORT).show();
				this.imageUri = null;
			}
		} else {
			super.onActivityResult(requestCode, resultCode, data);
		}
		validateForm();
	}// onActivityResult

	@Override
	public void onCreate(Bundle savedInstanceState) {
		super.onCreate(savedInstanceState);
		handleIntent(this.getIntent());
		setContentView(R.layout.sense);
		TextView title = (TextView) findViewById(R.id.campaign_title);
		title.setText(campaign.getName());
		Button capture = (Button) findViewById(R.id.capture_photo);

		hasTakenPhoto = (CheckBox) findViewById(R.id.chkbox_photo_complete);
		photoText = (TextView) findViewById(R.id.upload_text);

		capture.setOnClickListener(new OnClickListener() {
			@Override
			public void onClick(View v) {
				Intent intent = new Intent(MediaStore.ACTION_IMAGE_CAPTURE);

				Uri fileUri = getOutputImageUri(); // create a file to save the
													// image
				Sense.this.imageUri = fileUri;
				intent.putExtra(MediaStore.EXTRA_OUTPUT, fileUri); // set the
																	// image
																	// file name

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
				} else {
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
				} else {
					questionsIndex--;
				}
				form_container.removeAllViews();
				form_container.addView(layouts[questionsIndex]);
			}
		});

		// remove the Next and Previous buttons if we don't have anywhere to go
		if (layouts.length <= 1) {
			next.setVisibility(View.GONE);
			previous.setVisibility(View.GONE);
		}
		Button submit = (Button) findViewById(R.id.submit);
		submit.setOnClickListener(new OnClickListener() {
			@Override
			public void onClick(View v) {
				submit();
			}
		});
		this.answers = new HashMap<String, String>();
		if(pt == null) {
			this.requestLocation();
			Log.d("TAP", "onCreate requesting location");
		}
//		else {
//			this.location.setLatitude(pt.getLatitudeE6());
//			this.location.setLongitude(pt.getLongitudeE6());
//		}
	}// onCreate

	/** Unpacks passed-in campaign from the intent. */
	public void handleIntent(Intent i) {
		this.campaign = i.getParcelableExtra("campaign");
		int[] t = i.getIntArrayExtra("taskLocation");
		if(t != null) {
			Log.d("TAP", "t isn't null");
			pt = new GeoPoint(t[0], t[1]);
		}
	}// handleIntent

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

	/**
	 * Inflates the form object. This takes attributes from each of the
	 * questions on the form and find the best layout for them. For example,
	 * Multiple choice, single response questions use radio buttons. Multiple
	 * choice, multiple response questions use checkboxes. Written response also
	 * has a single line/multiline option.
	 * 
	 * @return An array of question layouts associated with this form.
	 */
	public LinearLayout[] renderForm() {
		Form f = campaign.getTask().getForm();
		Question[] questions = f.getQuestions();
		LinearLayout[] layouts = new LinearLayout[questions.length];
		for (int i = 0; i < questions.length; i++) {
			layouts[i] = new LinearLayout(this);
			layouts[i].setOrientation(LinearLayout.VERTICAL);
			layouts[i].setLayoutParams(new LinearLayout.LayoutParams(
					LinearLayout.LayoutParams.FILL_PARENT,
					LinearLayout.LayoutParams.FILL_PARENT));
			/* Question text */
			TextView question = new TextView(this);
			question.setText(questions[i].getQuestion());
			question.setTextColor(Color.WHITE);// BLACK);
			question.setGravity(Gravity.CENTER_HORIZONTAL);
			question.setLayoutParams(new LinearLayout.LayoutParams(
					LinearLayout.LayoutParams.WRAP_CONTENT,
					LinearLayout.LayoutParams.FILL_PARENT));
			layouts[i].addView(question);
			/* Responses */
			if (questions[i].getType() == Question.MULTIPLE_CHOICE) {
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
						final String questionString = questions[i]
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
						final String questionString = questions[i]
								.getQuestion();
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
					layouts[i].addView(ans);
				}
			} else if (questions[i].getType() == Question.WRITTEN_RESPONSE) {
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
			if (this.hasLocationFix() || this.pt != null) { //exclusive or
				if (this.imageUri != null) {
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
			} else {
				// to resolve UI conflict, move submission post request into
				// ImageResponseHandler
				uploadImageAndForm(this.imageUri, new Submission(buildXML()));
			}
		}
	}// submit

	/** Build a submission XML */
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
	public void uploadImageAndForm(Uri uri, Submission submission) {
		String imagePath = uri.getPath();
		ImageResponseHandler imageUploadHandler = new ImageResponseHandler(
				this, submission);
		new PostRequest(this, null, IMAGE, imageUploadHandler, true).execute(
				G.user.getUsername(), imagePath);
		// Add this code will cause problem. I find the way we are prompting the
		// user to change location setting is annoying.
		// Maybe prompt the user when he presses Submit is better?
		// if(imageUploadHandler.getResult().equalsIgnoreCase("success")){
		// validateForm();
		// }
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

}// Sense
