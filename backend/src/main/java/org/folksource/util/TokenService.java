//package org.folksource.util;
//
//import java.security.SecureRandom;
//import java.sql.Timestamp;
//import java.util.Calendar;
//import java.util.List;
//
//
//import org.folksource.model.*;
//import org.hibernate.Session;
//
//public class TokenService {
//	public static SecureRandom rng = new SecureRandom();
//	
//	public static Token getNewToken() {
//		Calendar cal = Calendar.getInstance();
//		cal.set(Calendar.MONTH, cal.get(Calendar.MONTH)+1);
//		Timestamp tmp = new Timestamp(cal.getTimeInMillis());
//		
//		return new Token(/*0,*/ rng.nextInt(), tmp);
//	}
//
//	public static void updateTtl(Token token) {
//		Calendar cal = Calendar.getInstance();
//		cal.set(Calendar.MONTH, cal.get(Calendar.MONTH)+1);
//		Timestamp tmp = new Timestamp(cal.getTimeInMillis());
//		token.setTtl(tmp);
//	}
//	public static boolean checkTokenExists(String token) {
//		Session session = HibernateUtil.getSession(false);
//		@SuppressWarnings("unchecked")
//		List<Token> tmp = session.createQuery("from Token where token=" + Integer.parseInt(token)).list();
//		return tmp.size() != 0;
//
//	}
//}
