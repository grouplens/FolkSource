package org.folksource.dao.jpa.impl;

import java.io.Serializable;
import java.lang.reflect.ParameterizedType;
import java.util.List;
import java.util.Map;

import javax.persistence.TypedQuery;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Predicate;
import javax.persistence.criteria.Root;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import org.folksource.dao.jpa.TypedJpaDao;
import org.folksource.entities.AbstractAuditedPersistentObject;

/**
 *
 * @param <T> 
 * @param <ID> 
 */
public abstract class TypedJpaDaoImpl<T, ID extends Serializable> extends GenericJpaDaoImpl implements TypedJpaDao<T, ID> {

	private static final Logger LOG = LoggerFactory.getLogger(TypedJpaDaoImpl.class);

    private final Class<T> clazz;
    
    @SuppressWarnings("unchecked")
    public TypedJpaDaoImpl() {
		this.clazz = (Class<T>) ((ParameterizedType) getClass()
				.getGenericSuperclass()).getActualTypeArguments()[0];
    }

    @Override
    public T find(ID id) {
        return em.find(clazz, id);
    }

    @Override
    public T getReference(ID id) {
        return em.getReference(clazz, id);
    }

    @Override
    public void remove(T t) {
        em.remove(t);
    }

    @Override
    public void detach(T t) {
        em.detach(t);
    }

    @Override
    public T merge(T t) {
        return em.merge(t);
    }

    @Override
    public void persist(T t) {
        em.persist(t);
    }

    @Override
    public void refresh(T t) {
        em.refresh(t);
    }

    @Override
    public List<T> findAll() {
    	CriteriaBuilder cb = em.getCriteriaBuilder();
    	CriteriaQuery<T> cq = cb.createQuery(this.clazz);
    	Root<T> t = cq.from(this.clazz);
    	// there is no predicate to set 
    	cq.select(t);
    	TypedQuery<T> tq = em.createQuery(cq); 
    	return tq.getResultList();
    }   
    
    @Override
    public List<T> findByNamedQuery(String namedQuery, Map<String, Object> parameters) {
    	TypedQuery<T> query = em.createNamedQuery(namedQuery, this.clazz);
    	for (Map.Entry<String, Object> entry : parameters.entrySet()) {
    		query.setParameter(entry.getKey(), entry.getValue());
    	}
    	return query.getResultList();
    }

  
    @Override
    public List<T> findByQuery(String jpaql, Map<String, Object> parameters) {
    	TypedQuery<T> typedQuery = em.createQuery(jpaql, this.clazz);
    	for (Map.Entry<String, Object> entry : parameters.entrySet()) {
    		typedQuery.setParameter(entry.getKey(), entry.getValue());
    	}
    	return typedQuery.getResultList();
    }
    
    @Override
    public List<T> findByQuery(String jpaql, Object... parameters) {
    	TypedQuery<T> typedQuery = em.createQuery(jpaql, this.clazz);
    	for (int i=0;i<parameters.length;i++) {
    		typedQuery.setParameter(i+1, parameters[i]);
    	}
    	return typedQuery.getResultList();
    }
    
    @Override
    public T findSingleByQuery(String jpaql, Object... parameters) {
    	T t = null;
    	List<T> items = findByQuery(jpaql, parameters);
    	if (items != null && items.size() > 0) {
    		t = items.get(0);
    	}
    	return t;
    }
    
    @Override
    public T findByObjectId(String objectId) {
    	CriteriaBuilder cb = em.getCriteriaBuilder();
    	CriteriaQuery<T> cq = cb.createQuery(this.clazz);
    	Root<T> t = cq.from(this.clazz);
 		cq.where(t.get("objectId").in(objectId));
    	cq.select(t);
    	TypedQuery<T> tq = em.createQuery(cq); 
    	T t1 = null;
    	try {
    		t1 = tq.getSingleResult();
    	}
    	catch(Throwable ex) {
    		LOG.error(" error while retrieving obj for id = " + objectId , ex);
    		
    		if (!AbstractAuditedPersistentObject.class.isAssignableFrom(this.clazz)) {
    			LOG.error(this.clazz.toString() + " does not extend AbstractAuditedPersistentObject");
    		}
    	}
    	return t1;
    }
}
