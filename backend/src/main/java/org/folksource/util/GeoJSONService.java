package org.folksource.util;


import com.vividsolutions.jts.geom.Point;
import com.vividsolutions.jts.geom.Polygon;
import org.folksource.model.Answer;
import org.folksource.geojson.GeoJSON;
import org.hibernate.Session;
import org.folksource.geojson.*;
import org.hibernate.spatial.GeometryType;

import java.util.ArrayList;
import java.util.List;


public class GeoJSONService {

	public static void save(Answer a) {
		Session session = HibernateUtil.getSession(true);
		session.save(a);
	}

	public static GeoJSON getGeometries() {
		Session session = HibernateUtil.getSession(true);
		List<Object> l = session.createSQLQuery("SELECT linestring FROM way_tags as t, ways as n WHERE (k='amenity' OR k='building' OR k='office') AND (v='courthouse' OR v='college' OR v='kindergarten' OR v='school' OR v='university' OR v='post_office' OR v='prison' OR v='police' OR v='townhall' OR v='dormitory' OR v='school' OR v='university' OR v='forestry' OR v='government' OR v='tax' OR v='educational_institution')AND t.way_id = n.id;").addScalar("linestring", GeometryType.INSTANCE).list();
		l.addAll(session.createSQLQuery("SELECT geom FROM node_tags as t, nodes as n WHERE (k='amenity' OR k='building' OR k='office') AND (v='courthouse' OR v='college' OR v='kindergarten' OR v='school' OR v='university' OR v='post_office' OR v='prison' OR v='police' OR v='townhall' OR v='dormitory' OR v='school' OR v='university' OR v='forestry' OR v='government' OR v='tax' OR v='educational_institution') AND t.node_id = n.id;").addScalar("geom", GeometryType.INSTANCE).list());
		ArrayList<Feature> p = new ArrayList<Feature>();
		for(Object e : l) {
			Feature f;
			if(e instanceof Point) {
				f = new Feature(new org.folksource.geojson.Point((Point) e));
			} else {
				f = new Feature(new org.folksource.geojson.Polygon((Polygon) e));
			}
			p.add(f);
		}

		return new GeoJSON(p);
	}

	public static boolean checkNearby(String[] inData) {
		String bbox = inData[0];
		String userLoc = inData[1];
//		Session session = HibernateUtil.getSession(true);
//		session.createSQLQuery("SELECT ST_Cover");

		return false;
	}
}