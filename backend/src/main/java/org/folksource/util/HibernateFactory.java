package org.folksource.util;

import org.hibernate.SessionFactory;
import org.hibernate.cfg.Configuration;

public class HibernateFactory {
	public static SessionFactory seshfact = buildSessionFactory();

	static SessionFactory buildSessionFactory() {
		try{
			return new Configuration().configure().buildSessionFactory();
		}catch (Exception e) {
			System.out.print("Error: " + e);
			throw new ExceptionInInitializerError(e.getCause());
		}

	}
	
	public static SessionFactory getSessionFactory() {
		return seshfact;
	}

}
