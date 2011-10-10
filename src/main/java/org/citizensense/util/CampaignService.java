package org.citizensense.util;

import java.util.List;
import org.citizensense.model.*;
import org.citizensense.util.*;
import org.hibernate.Session;


public class CampaignService {

	
	public static List<Campaign> getCampaigns() {
		List<Campaign> campaigns;
		Session session = HibernateFactory.getSessionFactory().getCurrentSession();
		//Session session = HibernateFactory.getSessionFactory().getCurrentSession();
		session.beginTransaction();
		
		campaigns = session.createQuery("from Campaign").list();
		session.getTransaction().commit();
		
		return campaigns;
	}

}
