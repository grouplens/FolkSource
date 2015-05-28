package org.folksource.model;

import org.grouplens.common.dto.Dto;

import java.text.DateFormat;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

public class ActionLogDto extends Dto {
	public Integer id;
	public String client_timestamp;
	public Integer user_id;
	public String event_provenance;
	public String category;
	public String server_timestamp;

	public ActionLogDto(){
		super();
	}

	public ActionLogDto(ActionLog act) {
		super();
		//ISO 8601 in order to ensure timezone get's stored in PSQL properly
		DateFormat sf = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss.SSSZ");
		this.id = act.getId();
		this.user_id = act.getUser_id();
		this.event_provenance = act.getEvent_provenance();
		this.category = act.getCategory();
		this.client_timestamp = sf.format(act.client_timestamp);
		this.server_timestamp = sf.format(act.server_timestamp);

		}

		/**
		* Returns a list of SubmissionDto objects given a list of Submission objects.
		* @param actionLogs
		* @return
		*/
		public static List<ActionLogDto> fromActionList(List<ActionLog> actionLogs){
			List<ActionLogDto> actionLogDtos = new ArrayList<ActionLogDto>();
			for (ActionLog a : actionLogs){
				ActionLogDto dto = new ActionLogDto((a));
				System.out.println(dto.client_timestamp);
				actionLogDtos.add(dto);
			}
			return actionLogDtos;
		}
		public static ActionLogDto[] fromActionDto(ActionLog[] actionLogs){
			ActionLogDto[] actionLogDtos = new ActionLogDto[actionLogs.length];
			for (int i=0; i < actionLogs.length; i++){
				actionLogDtos[i] = new ActionLogDto(actionLogs[i]);
			}
			return actionLogDtos;
		}

		/**
		* Returns a new Submission object from this SubmissionDto.
		* @return
		*/
		public ActionLog toAction(){
			//ISO 8601 in order to ensure timezone get's stored in PSQL properly
			SimpleDateFormat df = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss.SSSZ");
			try {
				Date client_date = df.parse(this.client_timestamp);
				Date server_date = new Date();
				return new ActionLog(this.id, client_date, this.user_id, this.event_provenance, this.category, server_date);
			} catch (ParseException e) {
				e.printStackTrace();
				return null;
			}
		}

		public static ActionLog[] toActionArray(ActionLogDto[] actDtos){
			ActionLog[] actionLogs = new ActionLog[actDtos.length];
			for (int i=0; i < actDtos.length; i++){
				actionLogs[i] = actDtos[i].toAction();
			}
			return actionLogs;
		}
}
