package org.folksource.util;

/*
 * GroupLens Common Utilities
 * Copyright © 2011 Regents of the University of Minnesota
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions
 * are met:
 *
 *  * Redistributions of source code must retain the above copyright
 *    notice, this list of conditions and the following disclaimer.
 *
 *  * Redistributions in binary form must reproduce the above copyright
 *    notice, this list of conditions and the following disclaimer in the
 *    documentation and/or other materials provided with the
 *    distribution.
 *
 *  * Neither the name of the University of Minnesota nor the names of
 *    its contributors may be used to endorse or promote products derived
 *    from this software without specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS
 * "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT
 * LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR
 * A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT
 * HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL,
 * SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
 * LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE,
 * DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY
 * THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
 * OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 *
 * This software has been partly funded by NSF grant IIS 08-08692.
 */

import java.util.logging.Level;
import java.util.logging.Logger;

import org.apache.commons.lang.StringUtils;
import org.hibernate.HibernateException;
import org.hibernate.Interceptor;
import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.hibernate.Transaction;
import org.hibernate.cfg.Configuration;

/**
 * Standard HibernateUtil copied from _Hibernate In Action_,
 * except that we throw HibernateExceptions rather than wrapping them
 * in our our system exception type.
 */
public class HibernateUtil {
    private static final Logger LOG = Logger.getLogger(HibernateUtil.class.getName());

    private static final SessionFactory SESSION_FACTORY;
    private static final Configuration CONFIG;

    static {
        try {
        	Configuration config = new Configuration().configure();
        	String interceptor = config.getProperty("hibernate.interceptor");
        	if (interceptor != null && !StringUtils.isBlank(interceptor)) {
        	   	Interceptor it = (Interceptor) Class.forName(interceptor).newInstance();
        		config.setInterceptor(it);
        	}
        	
        	SESSION_FACTORY = config.buildSessionFactory();
        	CONFIG = config;
 
        } catch (Throwable ex) {
            LOG.log(Level.SEVERE, "SessionFactory init failed.", ex);
            throw new ExceptionInInitializerError(ex);
        }
    }

    private static final ThreadLocal<Session> SESSION = new ThreadLocal<Session>();
    private static final ThreadLocal<Transaction> TRANSACTION = new ThreadLocal<Transaction>();
    
    public static Configuration getConfiguration() {
        return CONFIG;
    }
    
    public static Session getSession(boolean requireTransaction) throws HibernateException {
    	if (requireTransaction) {
    		beginTransaction();
    	}
        if (!isOpen()) {
            SESSION.set(SESSION_FACTORY.openSession());
        }
        return SESSION.get();
    }

    /**
     * Calling this function guarantees the closing and releasing of both session and transaction.
     * If there was an unclosed transaction in the session we rollback the transaction. 
     */
    public static void closeSession() {
        Session s = SESSION.get();
        Transaction t = TRANSACTION.get();
        
        SESSION.set(null);
        TRANSACTION.set(null);

        if (t != null && t.isActive()) {
            t.rollback();
        }
        if (s != null && s.isOpen()) {
            s.close();
        }
    }
    
    private static void beginTransaction() throws HibernateException {
        if (TRANSACTION.get() == null) {
        	TRANSACTION.set(getSession(false).beginTransaction());
        }
    }
    
    public static void commit() throws HibernateException {
        Transaction t = TRANSACTION.get();
        TRANSACTION.set(null);
        try {
            if (t != null && !t.wasCommitted() && !t.wasRolledBack()) {
                t.commit();
            }
        } catch (HibernateException e) {
            t.rollback();
            throw e;
        }
    }
    
    public static void rollback() throws HibernateException {
        Transaction t = TRANSACTION.get();
        TRANSACTION.set(null);
        
        if (t != null && !t.wasCommitted() && !t.wasRolledBack()) {
            t.rollback();
        }
    }

    @SuppressWarnings("unchecked")
    public static <T> T get(Class<T> clazz, Integer id) {
        return (T) getSession(false).get(clazz, id);
    }
    
    public static void commitAndClose() throws HibernateException {
        commit();
    	closeSession();
    }
    
    public static boolean isOpen() {
    	return SESSION.get() != null;
    }
}