package com.citizensense.android;

import java.util.ArrayList;

import android.app.ListActivity;
import android.content.Context;
import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ArrayAdapter;
import android.widget.TextView;
import android.widget.Toast;

/**
 * User's main profile page. Has a picture, user info, and statuses on incentives
 * and participation in subscribed campaigns.
 * @author Phil Brown
 *
 */
public class Profile extends ListActivity {

	ArrayList<Campaign> campaigns;
	
	public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.profile);
        //TODO get user info to inflate
        
        //populate the user campaigns list by retrieving the user's campaign
        //ids and retrieving the associated campaigns from the database.
        campaigns = new ArrayList<Campaign>();
        ArrayList<String>campaign_ids = G.user.getCampaignIDs();
        for(int i = 0; i<campaign_ids.size(); i++) {
        	campaigns.add(G.db.getCampaignById(campaign_ids.get(i)));
        }
        setListAdapter(new CampaignListAdapter(this, campaigns));
	}
	
	class CampaignListAdapter extends ArrayAdapter<Campaign>{
		/** List of campaigns */
		   //private ArrayList<Campaign> campaigns;
		   /** context in order to allow access to resources and system services */
		   private Context context;
		public CampaignListAdapter(Context c, ArrayList<Campaign> campaigns) {
			super(c, 0, campaigns);
			this.context = c;
			//this.campaigns = campaigns;
		}
		@Override
		   public View getView(int position, View convertView, ViewGroup parent) {
		      View v = convertView;
		      if (v == null) {
		          LayoutInflater vi = 
		                (LayoutInflater)context.getSystemService(
		                                        Context.LAYOUT_INFLATER_SERVICE);
		          v = vi.inflate(R.layout.campaign_list_item, null);
		       }
		      Campaign campaign = this.getItem(position);
		      if(campaign != null) {
		    	  TextView title = (TextView) v.findViewById(R.id.campaign_title);
		    	  TextView stats = (TextView) v.findViewById(R.id.campaign_stats);
		    	  TextView points = (TextView) v.findViewById(R.id.campaign_points);
		    	  title.setText(campaign.getName());
		    	  if (G.user != null) {
		    		  //TODO points.setText(G.user.getPoints());
		    	  }
		    	  //TODO add stats
		      }
		      return v;
		}
	}
	 
}
