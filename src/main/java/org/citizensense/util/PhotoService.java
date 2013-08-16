package org.citizensense.util;

import org.citizensense.model.*;
import org.hibernate.Session;

public class PhotoService {

	public static void save(Photo p){
		Session session = HibernateUtil.getSession(true);
		session.save(p);
	}
	
}
