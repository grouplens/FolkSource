package org.citizensense.util;

import java.util.List;
import java.util.Collections;
import org.citizensense.model.*;
import org.hibernate.Session;

public class StatsService {
	
	public static List<Stats> getStats() {
		List<Stats> stats;
		
		Session session = HibernateUtil.getSession(true);
		
		stats = session.createQuery("from Stats").list();
		
		return stats;
	}
	
	public static List<Stats> getStatsByTask(Task t) {
		List<Stats> stats;
		
		Session session = HibernateUtil.getSession(true);
		
		stats = getStats();
		
		for(Stats st : stats) {
			if(t.getId() != st.getTask_id()) {
				stats.remove(st);
			}
		}
		return stats;
	}
	
	public static Stats getTaskStatsByLocation(Task t, Locations l) {
		List<Stats> stats;
		Stats s = null;
		Session session = HibernateUtil.getSession(true);
		
		stats = getStatsByTask(t);
		
		for(Stats st : stats) {
			if(st.getId() == l.getStat_id()) {
				s = st;
			}
		}
		return s;
	}
	
	public static List<Stats> getStatsByLocation(Locations l) {
		List<Stats> stats;
		
		Session session = HibernateUtil.getSession(true);
		
		stats = getStats();
		
		for(Stats st : stats) {
			if(st.getLoc_id() != l.getId()) {
				stats.remove(st);
			}
		}
		return stats;
	}
	
	public static void save(Stats s) {
		Session session = HibernateUtil.getSession(true);
		session.save(s);
	}
	
}
