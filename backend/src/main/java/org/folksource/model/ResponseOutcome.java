package org.folksource.model;

import java.util.List;

/**
 * Created by jts on 5/29/15.
 */
public class ResponseOutcome {
    public Integer id;
    private Location location;
    private Task task;
    public String type;
    public String outcome;

    public ResponseOutcome() {

    }

    public ResponseOutcome(Location l, Task t, String outcome) {
        this.location = l;
        this.task = t;
        this.outcome = outcome;
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public Location getLocation() {
        return location;
    }

    public void setLocation(Location location) {
        this.location = location;
    }

    public Task getTask() {
        return task;
    }

    public void setTask(Task task) {
        this.task = task;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getOutcome() {
        return outcome;
    }

    public void setOutcome(String outcome) {
        this.outcome = outcome;
    }
}