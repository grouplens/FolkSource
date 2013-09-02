package org.citizensense.util;

import java.util.concurrent.Executor;
import java.util.concurrent.Executors;

import org.citizensense.model.Locations;
import org.citizensense.model.Task;

/**
 * A single threaded executor for running computation jobs.
 * @author nick
 *
 */
public class ComputationService {

	private Executor executor = Executors.newSingleThreadExecutor();
	
	public void recieve(ComputationJob job) {
		executor.execute(job);
	}
}

/*
 * Create a new ReputationJob with the proper task and
 * location and pass it to ComputationService for execution.
 *
 */

/**
 * A runnable to update reputation following completion of a 
 * task at a given location.
 * @author nick
 *
 */
class ReputationJob extends ComputationJob {

	private final Task task;
	private final Locations location;
	
	public ReputationJob(Task task, Locations location) {
		this.task = task;
		this.location = location;
	}
	@Override
	public void run() {
		ReputationService.updateReputation(task, location);
	}
	
}