package org.citizensense.util;

import java.util.ArrayList;
import java.util.List;
import org.citizensense.model.*;
import org.hibernate.Session;


public class LeaderboardService {

	
	public static List<LeaderboardEntry> getLeaderboard() {
		List<User> users;
		List<LeaderboardEntry> leaderboard = new ArrayList<LeaderboardEntry>();
		
		Session session = HibernateFactory.getSessionFactory().getCurrentSession();
		//Session session = HibernateFactory.getSessionFactory().getCurrentSession();
		session.beginTransaction();
		
		users = session.createQuery("from User").list();
		
		session.getTransaction().commit();
		
		for(User u : users) {
			LeaderboardEntry l = new LeaderboardEntry();
			l.setId(u.getId());
			l.setName(u.getName());
			l.setPoints(u.getPoints());
//			getPoints(l);
			leaderboard.add(l);
			
		}
		
		return leaderboard;
	}

	private static void getPoints(LeaderboardEntry l) {
		Session session = HibernateFactory.getSessionFactory().getCurrentSession();
		session.beginTransaction();
		Integer tmp;
		
		tmp = (Integer)session.createQuery("sum(from Earned_Incentive where user_id = " + l.getId() +  ")").list().get(0);
		
		session.getTransaction().commit();
		l.setPoints(tmp);
	}

	public static void save(Incentive camp) {
		Session session = HibernateFactory.getSessionFactory().getCurrentSession();
		session.beginTransaction();
		session.save(camp);
		session.getTransaction().commit();
		
	}

}
