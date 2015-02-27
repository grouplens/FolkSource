package org.folksource.util;

import org.folksource.model.ActionLog;
import org.folksource.model.Incentive;
import org.folksource.model.LeaderboardEntry;
import org.folksource.model.User;
import org.hibernate.Session;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;


public class ActionLogService {

	
	public static List<ActionLog> getActionLogs() {
		Session session = HibernateUtil.getSession(true);
		List<ActionLog> actionLogs = session.createQuery("from ActionLog").list();

		return actionLogs;
	}

	public static void save(ActionLog actionLog) {
		Session session = HibernateUtil.getSession(true);
		session.save(actionLog);
	}

}
