package org.folksource.model;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

public class VotingTask extends Task {

    public Integer deciding_question_id;

    public VotingTask() {
        super();
        this.type="voting_task";
    }

    //used by the TaskDto
    public VotingTask(Integer id, String name, String instructions, Boolean required, Set<Submission> subs, Set<Question> qs, Set<LocationLayer> locs) {
        super(id, name, instructions, required, subs, qs, locs);
        this.type = "voting_task";
    }

    public void makeDecision() {
        Set<Submission> submissions = this.getSubmissions();
        for(Submission s : submissions) {
        }
    }
}
