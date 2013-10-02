package org.citizensense.util;

import java.util.List;

import org.citizensense.model.*;

import org.hibernate.Session;

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
		List<Location> l =  session.createQuery("from Location").list();
		return l;
	}
	@SuppressWarnings("unchecked")
	public static List<Location> getLocations(int id) {
		Session session = HibernateUtil.getSession(false);
		List<Location> l =  session.createQuery("from Location").list();
		return l;
	}
}
