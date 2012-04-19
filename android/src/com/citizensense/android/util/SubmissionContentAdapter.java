/** 
 * @Title: SubmissionContentAdapter.java 
 * @Package com.citizensense.android.util 
 * @author Renji Yu
 * @date 2012-4-15 
 */ 
package com.citizensense.android.util;

import java.util.ArrayList;

import android.content.Context;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ArrayAdapter;
import android.widget.TextView;

import com.citizensense.android.Answer;
import com.citizensense.android.Question;
import com.citizensense.android.R;

/** 
 * @ClassName: SubmissionContentAdapter 
 * @Description: TODO
 *  
 */
public class SubmissionContentAdapter extends ArrayAdapter<Answer> {
	/** context in order to allow access to resources and system services */
	private Context context;
	/** The answers to inflate */
	private ArrayList<Answer> answers;
	/** The questions to inflate*/
	private ArrayList<Question> questions;

	public SubmissionContentAdapter(Context context,
			ArrayList<Answer> answers,ArrayList<Question> questions) {
		super(context, 0, answers);
		this.context = context;
		this.answers = answers;
		this.questions = questions;
	}

	/** Inflate submission content */
	@Override
	public View getView(int position, View convertView, ViewGroup parent) {
		int index = position+1;
		LayoutInflater inflater = (LayoutInflater) context
				.getSystemService(Context.LAYOUT_INFLATER_SERVICE);
		View rowView = inflater.inflate(R.layout.sub_content_item, parent, false);
		TextView questionView = (TextView) rowView.findViewById(R.id.question);
		//FIXME: add question content later
		String questionText = "Q"+index+": ";
		if(questions!=null) questionText += questions.get(position).getQuestion();
		questionView.setText(questionText);
		
		//FIXME: think about how to display the answer when we have different answer types
		TextView answerView = (TextView) rowView.findViewById(R.id.answer);
		String answerText = "A"+index+": ";
		if(answers!=null){
			answerText += answers.get(position).getAnswer();
		}
		answerView.setText(answerText);
		return rowView;
	}// getView
}
