package org.citizensense.util;

import java.util.List;
import java.util.Collections;
import org.citizensense.model.*;
import org.hibernate.Session;

public class StatsService {
	
	/**
	 * Get all stats
	 * @return-a list of Stats objects
	 */
	public static List<Stats> getStats() {
		List<Stats> stats;
		
		Session session = HibernateUtil.getSession(true);
		
		stats = session.createQuery("from Stats").list();
		
		return stats;
	}
	
	//public static List<Stats> getStatsByCampaign()//
	/* May want to implement the above method and add 
	 * campaign id to the stats db
	 */
	
	/**
	 * Get all Stats for a task
	 * @param tid-id of the task
	 * @return-a list of Stats objects
	 */
	public static List<Stats> getStatsByTaskId(Integer tid) {
		List<Stats> stats;
		
		Session session = HibernateUtil.getSession(true);
		
		stats = session.createQuery("from Stats where task_id=" + tid).list();
		
		return stats;
	}
	
	/**
	 * Get Stats for a particular location and task
	 * @param tid-id of the task
	 * @param lid-id of the location
	 * @return-Stats object corresponding to (task,location)
	 */
	public static Stats getTaskStatByLocation(Integer tid, Integer lid) {
		List<Stats> stats;
		
		Session session = HibernateUtil.getSession(true);
		
		stats = session.createQuery("from Stats where task id=" + tid + "and loc_id=" + lid).list();
		
		return stats.get(0);
	}
	
	/**
	 * Get all Stats objects for a location
	 * @param lid-a location id
	 * @return-a list of stats corresponding to a location
	 */
	public static List<Stats> getStatsByLocation(Integer lid) {
		List<Stats> stats;
		
		Session session = HibernateUtil.getSession(true);
		
		stats = session.createQuery("from stats where loc_id=" + lid).list();
		
		return stats;
	}
	
	/**
	 * Increment the number of submissions in the
	 * Stats object for the task and location to 
	 * which the submission belongs
	 * @param s - the incoming submission
	 */
	public static void newSub(Submission s) {
		Integer tid = s.getTask_id();
		Integer lid = s.getLoc_id();
		
		Stats stat = getTaskStatByLocation(tid,lid);
		Integer sbp = stat.getNum_submissions();
		
		sbp++;
		stat.setNum_submissions(sbp);
		
		update(stat);		
	}
	
	/**
	 * Update Database entry corresponding to Stats object
	 * @param s - The Stat object
	 * @return - true
	 */
	public static boolean update(Stats s) {
		Session session = HibernateUtil.getSession(true);
		session.update(s);
		return true;
	}
	
	/**
	 * Create a new entry in the stats table of the DB
	 * @param s-The stat object to add to the DB
	 * @return true
	 */
	public static boolean save(Stats s) {
		Session session = HibernateUtil.getSession(true);
		session.save(s);
		return true;
	}
	
}
