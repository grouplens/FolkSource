package org.folksource.dao.jpa;

public interface GenericJpaDao {

    /**
     * Clear the contents of the EntityManager, causing all objects to become
     * detached.
     */
    void clear();

    /**
     * Flush all pending changes to the database.
     */
    void flush();
}
