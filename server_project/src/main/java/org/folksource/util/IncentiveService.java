package org.folksource.util;

import java.util.List;

import org.folksource.model.*;
import org.hibernate.Session;


public class IncentiveService {

	
	public static List<Incentive> getIncentives() {
		List<Incentive> incentives;
		Session session = HibernateFactory.getSessionFactory().getCurrentSession();
		//Session session = HibernateFactory.getSessionFactory().getCurrentSession();
		session.beginTransaction();
		
		incentives = session.createQuery("from Incentive").list();
		session.getTransaction().commit();
		
		return incentives;
	}

	public static void save(Incentive camp) {
		Session session = HibernateFactory.getSessionFactory().getCurrentSession();
		session.beginTransaction();
		session.save(camp);
		session.getTransaction().commit();
		
	}

}
