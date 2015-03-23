package org.folksource.dao.jpa.impl;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;

import org.folksource.dao.jpa.GenericJpaDao;

public class GenericJpaDaoImpl implements GenericJpaDao {

    @PersistenceContext
    protected EntityManager em;
    
    @Override
    public void flush() {
        em.flush();
    }

    @Override
    public void clear() {
        em.clear();
    }
}
