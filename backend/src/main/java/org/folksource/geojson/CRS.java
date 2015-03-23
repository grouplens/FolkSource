package org.folksource.geojson;

import org.grouplens.common.dto.Dto;

/**
 * Created by jts on 1/26/15.
 */
public class CRS extends Dto {
    public String type = "name";
    public CRSProperties properties = new CRSProperties();

    public CRS() {
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public CRSProperties getProperties() {
        return properties;
    }

    public void setProperties(CRSProperties properties) {
        this.properties = properties;
    }
}
