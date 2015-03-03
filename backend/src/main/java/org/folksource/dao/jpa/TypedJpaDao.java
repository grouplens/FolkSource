package org.folksource.dao.jpa;

import java.io.Serializable;
import java.util.List;
import java.util.Map;

/**
 *
 * @param <T> 
 * @param <ID> 
 */
public interface TypedJpaDao<T, ID extends Serializable> extends GenericJpaDao {

    /**
     * Typesafe version of EntityManager.detach().
     * @param t     The object to detach from the EntityManager (becomes unmanaged.)
     */
    void detach(T t);

    /**
     * Typesafe version of EntityManager.find() (force SELECT).
     * @param id   The ID of the object to retrieve.
     * @return      The specified object, or null if no object matches the PK.
     */
    T find(ID id);

    /**
     * Typesafe version of EntityManager.getReference() (lazy-load).
     * @param id   The ID of the object to retrieve.
     * @return      The specified object.
     */
    T getReference(ID id);

    /**
     * Typesafe version of EntityManager.merge().  (Merges existing changes of
     * a detached object into the database.
     * @param t     The detached object with changes to merge.
     * @return      The merged (and managed) object.
     */
    T merge(T t);

    /**
     * Typesafe version of EntityManager.persist().
     * @param t     The new object to persist.
     */
    void persist(T t);

    /**
     * Typesafe version of EntityManager.refresh().  (Load the requested object
     * from the database, discarding any changes that may have been made to it.)
     * @param t     The object to reload/refresh.
     */
    void refresh(T t);

    /**
     * Typesafe version of EntityManager.delete().  (Delete the requested object
     * from the database.)
     * @param t     The object to delete.
     */
    void remove(T t);
    
    /**
     * Find all objects for a given entity
     * @return
     */
    List<T> findAll();

    /**
     * Find all objects for a given entity returned by the given named query with
     * the given substitution parameters
     * @return
     */
    List<T> findByNamedQuery(String namedQuery, Map<String, Object> parameters);

    /**
     * Find all objects for a given entity returned by the given jpaql query with
     * the given substitution parameters
     * @return
     */
    List<T> findByQuery(String jpaql, Map<String, Object> parameters);

    /**
     * Find all objects for a given entity returned by the given jpaql query
     * with substitution parameters.  The parameters in this case are positional
     * rather than keyed
     * @param jpaql
     * @param parameters
     * @return
     */
	List<T> findByQuery(String jpaql, Object... parameters);
    


	/**
	 * convenience method to return a single result or null if none found
	 * @param jpaql
	 * @param parameters
	 * @return
	 */
	T findSingleByQuery(String jpaql, Object... parameters);

	/**
	 * look up an object based on its objectId.  Its assumed that the T
	 * extends  AbstractAuditedPersistentObject
	 * @param objectId
	 * @return
	 */
	T findByObjectId(String objectId);

}
