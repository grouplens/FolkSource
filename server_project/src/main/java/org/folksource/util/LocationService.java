package org.folksource.util;

import java.util.List;


import org.folksource.model.*;
import org.hibernate.Session;
import org.hibernate.criterion.Restrictions;

public class LocationService {

	public static void save(List<Location> list) {
		for(Location l : list) {
			save(l);
		}
	}
	public static void save(Location l) {
		Session session = HibernateUtil.getSession(true);
		session.save(l);
	}

	@SuppressWarnings("unchecked")
	public static List<Location> getLocations() {
		Session session = HibernateUtil.getSession(false);
		List<Location> l = session.createCriteria(Location.class).list();
		//List<Location> l =  session.createQuery("from Location").list();
		return l;
	}
	@SuppressWarnings("unchecked")
	public static List<Location> getLocations(int id) {
		Session session = HibernateUtil.getSession(false);
		List<Location> l = session.createCriteria(Location.class).add(Restrictions.idEq(id)).list();
		//List<Location> l =  session.createQuery("from Location").list();
		return l;
	}
}
