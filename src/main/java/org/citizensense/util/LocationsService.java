package org.citizensense.util;

//import java.util.Collections;
import java.util.List;

import org.citizensense.model.*;
//import org.hibernate.Query;
import org.hibernate.Session;

public class LocationsService {

	public static List<Locations> getLocations() {
		List<Locations> locations;
		
		Session session = HibernateUtil.getSession(true);
		
		locations = session.createQuery("from Locations").list();
		
		return locations;
	}
	
	public static Locations getLocationById(Integer id) {
		List<Locations> locations;
		Session session = HibernateUtil.getSession(true);
		
		locations = session.createQuery("from Locations where id= " + id).list();
		return locations.get(0);
	}
	
	public static List<Locations> getLocationsByTask(Task t) {
		List<Locations> locations;
		Session session = HibernateUtil.getSession(true);
		
		locations = session.createQuery("from Locations where task_id= " + t.getId()).list();
		
		return locations;
	}
	
	public static void save(Locations l) {
		Session session = HibernateUtil.getSession(true);
		session.save(l);
	}
}
