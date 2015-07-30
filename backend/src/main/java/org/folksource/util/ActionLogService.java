package org.folksource.util;

import org.folksource.model.Actionlog;
import org.hibernate.Session;

import java.util.List;


public class ActionLogService {

	
	public static List<Actionlog> getActionLogs() {
		Session session = HibernateUtil.getSession(true);
		List<Actionlog> actionLogs = session.createQuery("from ActionLog").list();

		return actionLogs;
	}

	public static void save(Actionlog actionLog) {
		Session session = HibernateUtil.getSession(true);
		session.save(actionLog);
	}

}
