package org.folksource.model;

import java.util.List;

/**
 * Created by jts on 5/29/15.
 */
public abstract class ResponseOutcome {
    private Location location;
    private Task task;

    public ResponseOutcome(Location l, Task t) {
        this.location = l;
        this.task = t;
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
}
