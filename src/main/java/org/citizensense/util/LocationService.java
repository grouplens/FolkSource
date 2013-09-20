package org.citizensense.util;

import java.util.List;

import org.citizensense.model.*;

import org.hibernate.Session;

import com.vividsolutions.jts.geom.Point;
import com.vividsolutions.jts.geom.Polygon;
import com.vividsolutions.jts.io.ParseException;
import com.vividsolutions.jts.io.WKTReader;


public class LocationService {

	public static void save(List<Location> list) {
		for(Location l : list) {
			save(l);
		}
	}
	public static void save(Location l) {
		Session session = HibernateUtil.getSession(true);
//		WKTReader reader = new WKTReader();
//
//		try {
//			if(reader.read(l.getGeometryString()) instanceof Point) {
//				PointLocation loc = new PointLocation();
//				loc.setId(l.getId());
//				loc.setTask_id(l.getTask_id());
//				loc.setGeometry(reader.read(l.getGeometryString()));
//				loc.getGeometry().setSRID(4326);
//				session.saveOrUpdate(loc);
//				
//			} else if (reader.read(l.getGeometryString()) instanceof Polygon) {
//				PolygonLocation loc = new PolygonLocation(l.getId(), l.getTask_id(), reader.read(l.getGeometryString()));
//				loc.setId(l.getId());
//				loc.setTask_id(l.getTask_id());
//				loc.setGeometry(reader.read(l.getGeometryString()));
//				loc.getGeometry().setSRID(4326);
//				session.saveOrUpdate(loc);
//			}
//		} catch (ParseException e) {
//			e.printStackTrace();
//		}
		session.save(l);
	}

	@SuppressWarnings("unchecked")
	public static List<Location> getLocations() {
		Session session = HibernateUtil.getSession(false);
		List<Location> l =  session.createQuery("from Location").list();
//		List<Location> l =  session.createQuery("from PointLocation").list();
//		l.addAll(session.createQuery("from PolygonLocation").list());
		return l;
	}
	@SuppressWarnings("unchecked")
	public static List<Location> getLocations(int id) {
		Session session = HibernateUtil.getSession(false);
		List<Location> l =  session.createQuery("from Location").list();
//		List<Location> l =  session.createQuery("from PointLocation where task_id=" + id).list();
//		l.addAll(session.createQuery("from PolygonLocation where task_id=" + id).list());
		return l;
	}
}
