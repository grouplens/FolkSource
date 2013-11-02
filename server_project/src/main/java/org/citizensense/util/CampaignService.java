package org.citizensense.util;

import java.util.List;
import org.citizensense.model.*;

import org.hibernate.Session;


public class CampaignService {

	
	public static List<Campaign> getCampaigns() {
		List<Campaign> campaigns;
		Session session = HibernateUtil.getSession(true);
		campaigns = session.createQuery("from Campaign").list();
		
		return campaigns;
	}
	
	public static Campaign getCampaign(int id) {
		List<Campaign> campaigns;
		Session session = HibernateUtil.getSession(true);
		campaigns = session.createQuery("from Campaign where id= "+id).list();
		return campaigns.get(0);
	}

	public static void save(Campaign camp) {
		Session session = HibernateUtil.getSession(true);
		session.save(camp);
		for(Task t: camp.getTasks()) {
			t.setCamp_id(camp.getId());
			TaskService.save(t);
		}
	}

}
