package org.folksource.geojson;

import org.folksource.entities.Location;
import org.grouplens.common.dto.Dto;

/**
 * Created by jts on 1/26/15.
 */
public class Properties extends Dto {

    public String allowed;
    public String imageURL;
    public Integer number_of_contributors;
    public Integer id;


    public Properties(Integer id, String allowed, String imgURL, Integer number_of_contributors) {
        this.id = id;
        this.allowed = allowed;
        this.imageURL = imgURL;
        this.number_of_contributors = number_of_contributors;
    }

    public Properties(Location g) {
        this.id = g.id;
//        this.allowed = g.allowed;
//        this.imageURL = g.imgURL;
//        this.number_of_contributors = g.number_of_contributors;
    }

    public String getAllowed() {
        return allowed;
    }

    public void setAllowed(String allowed) {
        this.allowed = allowed;
    }

    public String getImageURL() {
        return imageURL;
    }

    public void setImageURL(String imageURL) {
        this.imageURL = imageURL;
    }

    public Integer getNumber_of_contributors() {
        return number_of_contributors;
    }

    public void setNumber_of_contributors(Integer number_of_contributors) {
        this.number_of_contributors = number_of_contributors;
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }
}
