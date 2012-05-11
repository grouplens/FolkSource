/** 
 * @Title: ActivityHeader.java 
 * @Package com.citizensense.android.util 
 * @author Renji Yu
 * @date 2012-5-8 
 */ 
package com.citizensense.android.util;

import android.view.View;
import android.view.View.OnClickListener;
import android.widget.ImageView;
import android.widget.TextView;
import android.widget.Toast;

import com.citizensense.android.G;
import com.citizensense.android.R;

/** 
 * @ClassName: ActivityHeader 
 * @Description: The header UI is reused in many Activities. Thus we create this class
 *               to handle the header. 
 * @author Renji Yu
 *  
 */
public class ActivityHeader implements OnClickListener {
	
	private TextView userNameText;
	private TextView userPointsText;
	
	public ActivityHeader(View v){
		setHeader(v);
	}
	
	public void setHeader(View v) {
        ((ImageView) v.findViewById(R.id.updates_menu_image)).setOnClickListener(this);
        ((ImageView) v.findViewById(R.id.updates_menu_menu)).setOnClickListener(this);
        ((TextView) v.findViewById(R.id.updates_menu_text)).setOnClickListener(this);
        ((ImageView) v.findViewById(R.id.quick_profile_image)).setOnClickListener(this);
        ((ImageView) v.findViewById(R.id.quick_profile_menu)).setOnClickListener(this);
        userNameText = (TextView) v.findViewById(R.id.quick_profile_text);
		userPointsText = (TextView) v.findViewById(R.id.quick_profile_pts);
        
		userNameText.setOnClickListener(this);
        userPointsText.setOnClickListener(this);
	}

	public void updateHeader(){
        if (G.user.getUsername() != null) {
        	userNameText.setText(G.user.getUsername());
        }
        userPointsText.setText(G.user.points+"");
	}
	
	@Override
	public void onClick(View v) {
		switch(v.getId()) {
		case R.id.updates_menu_image:
		case R.id.updates_menu_menu:
		case R.id.updates_menu_text:
			Toast.makeText(v.getContext(), "updates", Toast.LENGTH_SHORT).show();
			break;
		case R.id.quick_profile_image:
		case R.id.quick_profile_menu:
		case R.id.quick_profile_pts:
		case R.id.quick_profile_text:
			Toast.makeText(v.getContext(), "profile", Toast.LENGTH_SHORT).show();
			break;
		}
	}//onClick

}
