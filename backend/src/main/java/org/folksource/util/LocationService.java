package org.folksource.util;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.Iterator;
import java.util.List;


import com.vividsolutions.jts.geom.*;
import org.folksource.model.*;
import org.folksource.model.Location;
import org.hibernate.Session;
import org.hibernate.criterion.Restrictions;
import org.hibernate.spatial.criterion.SpatialRestrictions;

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
	public static Location[] getLocations() {
		Session session = HibernateUtil.getSession(true);
		GeometryFactory gf = new GeometryFactory();
		Coordinate[] c = {
				new Coordinate(-93.50189208984375, 44.75453548416007),
				new Coordinate(-93.50189208984375, 45.15686396890044),
				new Coordinate(-92.900390625, 45.15686396890044),
				new Coordinate(-92.900390625, 44.75453548416007),
				new Coordinate(-93.50189208984375, 44.75453548416007)
		};
		LinearRing lr = gf.createLinearRing(c);
		lr.setSRID(4326);
		Polygon p = gf.createPolygon(lr, new LinearRing[0]);
		p.setSRID(4326);
		System.out.println(p);
		Envelope e = new Envelope(-93.501892, 44.754535, -92.900390, 45.156863);
//		List<Location> l = session.createQuery("from Location l where within(l.geometry, :filter) is true").setParameter("filter", p).list();
		List<Location> l = session.createCriteria(Location.class).add(SpatialRestrictions.filter("geometry", e, 4326))
				.list();
//		SpatialRestrictions.
		Location[] locationArray = new Location[l.size()];
		System.out.println(l.size());
		l.toArray(locationArray);
		return locationArray;
	}
	@SuppressWarnings("unchecked")
	public static List<Location> getLocations(int id) {
		Session session = HibernateUtil.getSession(true);
		List<Location> l = session.createCriteria(Location.class).add(Restrictions.idEq(id)).list();
		//List<Location> l =  session.createQuery("from Location").list();
		return l;
	}

    public static void invalidateAllTiles(Integer id) {
        HashSet<String> urls = new HashSet<String>();
        Session session = HibernateUtil.getSession(false);
        Location l = (Location)session.createCriteria(Location.class).add(Restrictions.idEq(id)).list().get(0);
        Envelope e = l.getGeometry().getEnvelopeInternal();
        String type  = l.getGeometry().getGeometryType();

//        for(int i = 13; i < 18; i++) {
//            urls.add(LocationService.getTileURL(i, e.getMaxX(), e.getMinY()));
//            urls.add(LocationService.getTileURL(i, e.getMaxX(), e.getMaxY()));
//            urls.add(LocationService.getTileURL(i, e.getMinX(), e.getMinY()));
//            urls.add(LocationService.getTileURL(i, e.getMinX(), e.getMaxY()));
//        }

        urls.add(LocationService.getTileURL(12, e.getMaxX(), e.getMinY()));
        urls.add(LocationService.getTileURL(12, e.getMaxX(), e.getMaxY()));
        urls.add(LocationService.getTileURL(12, e.getMinX(), e.getMinY()));
        urls.add(LocationService.getTileURL(12, e.getMinX(), e.getMaxY()));

        urls.add(LocationService.getTileURL(14, e.getMaxX(), e.getMinY()));
        urls.add(LocationService.getTileURL(14, e.getMaxX(), e.getMaxY()));
        urls.add(LocationService.getTileURL(14, e.getMinX(), e.getMinY()));
        urls.add(LocationService.getTileURL(14, e.getMinX(), e.getMaxY()));

        Iterator<String> iter = urls.iterator();
        while(iter.hasNext()) {
            String ext = iter.next();
            try {
                URL url = new URL("http://localhost:8080/vector-points" + ext);
                URL url2 = new URL("http://localhost:8080/vector-polygons" + ext);
                BufferedReader br = new BufferedReader(new InputStreamReader(url.openStream()));
                BufferedReader br2 = new BufferedReader(new InputStreamReader(url2.openStream()));
                String strTemp = "";
                while (null != (strTemp = br.readLine())) {
                    System.out.println(strTemp);
                }
                while (null != (strTemp = br2.readLine())) {
                    System.out.println(strTemp);
                }
            } catch (Exception ex) {
                ex.printStackTrace();
            }
            System.out.println(ext + " DONE");
        }

    }

    public static String getTileURL(Integer zoom, Double lon, Double lat) {
        return "/" + zoom + "/" + long2tile(lon, zoom) + "/" + lat2tile(lat, zoom) + ".geojson?ignore_cached=1";
    }

    public static Integer long2tile(Double lon, Integer zoom) {
        return (int) Math.round(Math.floor((lon + 180) / 360 * Math.pow(2, zoom)));
    }

    public static Integer lat2tile(Double lat, Integer zoom)  {
        return (int) Math.round((Math.floor((1 - Math.log(Math.tan(lat * Math.PI / 180) + 1 / Math.cos(lat * Math.PI / 180)) / Math.PI) / 2 * Math.pow(2, zoom))));
    }

    public static Location getLocationById(Integer location_id) {
        return getLocations((int)location_id).get(location_id);
    }
}
