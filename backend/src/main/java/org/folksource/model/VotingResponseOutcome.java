package org.folksource.model;

/**
 * Created by jts on 5/29/15.
 */
public class VotingResponseOutcome extends ResponseOutcome {
    public String outcome;
    public VotingResponseOutcome(Location l, Task task, String votingOutcome) {
        super(l, task);
        this.outcome = votingOutcome;
    }

    public String getOutcome() {
        return outcome;
    }

    public void setOutcome(String outcome) {
        this.outcome = outcome;
    }
}
