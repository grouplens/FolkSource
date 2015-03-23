package org.folksource.util;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

import org.folksource.model.*;
import org.hibernate.Session;


public class LeaderboardService {

	
	public static List<LeaderboardEntry> getLeaderboard() {
		List<User> users;
		List<LeaderboardEntry> leaderboard = new ArrayList<LeaderboardEntry>();
		
		Session session = HibernateUtil.getSession(true);
		
		users = session.createQuery("from User").list();
		
		for(User u : users) {
			LeaderboardEntry l = new LeaderboardEntry();
			l.setId(u.getId());
			l.setName(u.getName());
			l.setPoints(u.getPoints());
//			getPoints(l);
			leaderboard.add(l);
			
		}
		Collections.sort(leaderboard);
		return leaderboard;
	}

	public static void save(Incentive camp) {
		Session session = HibernateUtil.getSession(true);
		session.save(camp);	
	}

}
