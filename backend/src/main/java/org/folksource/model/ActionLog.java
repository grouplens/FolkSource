package org.folksource.model;

import java.util.Date;

public class ActionLog {
	public Integer id;
	// public String client_timestamp;
	public Date client_timestamp;
	public Integer user_id;
	public String event_provenance;
	public String category;
	public Date server_timestamp;

    public ActionLog(Integer id, Date client_timestamp, Integer user_id, String event_provenance, String category, Date server_timestamp) {
        super();
        this.setId(id);
        this.setClient_timestamp(client_timestamp);
        this.setUser_id(user_id);
        this.setEvent_provenance(event_provenance);
        this.setCategory(category);
        this.setServer_timestamp(server_timestamp);
    }

	public ActionLog(){
		super();
	}

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public Integer getUser_id() {
        return user_id;
    }

    public void setUser_id(Integer user_id) {
        this.user_id = user_id;
    }

    public String getEvent_provenance() {
        return event_provenance;
    }

    public void setEvent_provenance(String event_provenance) {
        this.event_provenance = event_provenance;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public Date getClient_timestamp() {
        return client_timestamp;
    }

    public void setClient_timestamp(Date client_timestamp) {
        this.client_timestamp = client_timestamp;
    }

    public Date getServer_timestamp() {
        return server_timestamp;
    }

    public void setServer_timestamp(Date server_timestamp) {
        this.server_timestamp = server_timestamp;
    }
}
