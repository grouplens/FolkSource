package org.folksource.util;

import java.io.BufferedReader;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.net.URL;
import java.util.HashSet;
import java.util.Iterator;
import java.util.List;


import com.vividsolutions.jts.geom.*;
import org.folksource.model.Location;
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
	public static Location[] getLocationsArray() {
		Session session = HibernateUtil.getSession(true);
		List<Location> l = session.createCriteria(Location.class).list();
		Location[] locationArray = new Location[l.size()];
		System.out.println(l.size());
		l.toArray(locationArray);
		return locationArray;
	}
	@SuppressWarnings("unchecked")
	public static Location getLocationById(Integer id) {
		Session session = HibernateUtil.getSession(true);
        List<Location> l = session.createCriteria(Location.class).add(Restrictions.idEq(id)).list();
		return l.get(0);
	}

    public static void invalidateAllTiles(Integer id) {
        HashSet<String> urls = new HashSet<String>();
        Location l = getLocationById(id);
        System.out.println(l.getAllowed());
        System.out.println(l.getGeometry());
        Envelope e = l.getGeometry().getEnvelopeInternal();

        for(int i = 13; i < 18; i++) {
            Integer minX = long2tile(e.getMinX(), i);
            Integer maxX = long2tile(e.getMaxX(), i);

            Integer minY = lat2tile(e.getMinY(), i);
            Integer maxY = lat2tile(e.getMaxY(), i);

            for(int j = minX; j <= maxX; j++) {
                for (int k = minY; k <= maxY; k++) {
                    urls.add("/" + i + "/" + j + "/" + k + ".mapbox?ignore_cached=1");
                }
            }

            /*urls.add(LocationService.getTileURL(i, e.getMaxX(), e.getMinY()));
            urls.add(LocationService.getTileURL(i, e.getMaxX(), e.getMaxY()));
            urls.add(LocationService.getTileURL(i, e.getMinX(), e.getMinY()));
            urls.add(LocationService.getTileURL(i, e.getMinX(), e.getMaxY()));*/
        }


        Iterator<String> iter = urls.iterator();
        System.out.println("URLS: " + urls.size());
        while(iter.hasNext()) {
            new TileInvalidator(iter.next()).start();
        }

    }

    public static String getTileURL(Integer zoom, Double lon, Double lat) {
        return "/" + zoom + "/" + long2tile(lon, zoom) + "/" + lat2tile(lat, zoom) + ".mapbox?ignore_cached=1";
    }

    public static Integer long2tile(Double lon, Integer zoom) {
        return (int) Math.round(Math.floor((lon + 180) / 360 * Math.pow(2, zoom)));
    }

    public static Integer lat2tile(Double lat, Integer zoom)  {
        return (int) Math.round((Math.floor((1 - Math.log(Math.tan(lat * Math.PI / 180) + 1 / Math.cos(lat * Math.PI / 180)) / Math.PI) / 2 * Math.pow(2, zoom))));
    }


}
