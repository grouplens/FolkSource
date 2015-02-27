package org.folksource.geojson;

import org.grouplens.common.dto.Dto;

/**
 * Created by jts on 1/26/15.
 */
public class CRSProperties extends Dto {
    public String name = "urn:ogc:def:crs:OGC:1.3:CRS84";

    public CRSProperties() {
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

}
