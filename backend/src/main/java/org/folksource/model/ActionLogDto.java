package org.folksource.model;

import org.grouplens.common.dto.Dto;

import java.text.DateFormat;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

public class ActionlogDto extends Dto {
	public Integer id;
	public String client_timestamp;
	public Integer user_id;
	public String event_provenance;
	public String category;
	public String server_timestamp;

	public ActionlogDto(){
		super();
	}

	public ActionlogDto(Actionlog act) {
		super();
		//ISO 8601 in order to ensure timezone get's stored in PSQL properly
		DateFormat sf = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss.SSS'Z'");
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
		public static List<ActionlogDto> fromActionList(List<Actionlog> actionLogs){
			List<ActionlogDto> actionLogDtos = new ArrayList<ActionlogDto>();
			for (Actionlog a : actionLogs){
				ActionlogDto dto = new ActionlogDto((a));
				System.out.println(dto.client_timestamp);
				actionLogDtos.add(dto);
			}
			return actionLogDtos;
		}
		public static ActionlogDto[] fromActionDto(Actionlog[] actionLogs){
			ActionlogDto[] actionLogDtos = new ActionlogDto[actionLogs.length];
			for (int i=0; i < actionLogs.length; i++){
				actionLogDtos[i] = new ActionlogDto(actionLogs[i]);
			}
			return actionLogDtos;
		}

		/**
		* Returns a new Submission object from this SubmissionDto.
		* @return
		*/
		public Actionlog toAction(){
			//ISO 8601 in order to ensure timezone get's stored in PSQL properly
			SimpleDateFormat df = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss.SSS'Z'");
			try {
				Date client_date = df.parse(this.client_timestamp);
				Date server_date = new Date();
				Actionlog a = new Actionlog(this.id, client_date, this.user_id, this.event_provenance, this.category, server_date);
				return a;
			} catch (ParseException e) {
				e.printStackTrace();
				return null;
			}
		}

		public static Actionlog[] toActionArray(ActionlogDto[] actDtos){
			Actionlog[] actionLogs = new Actionlog[actDtos.length];
			for (int i=0; i < actDtos.length; i++){
				actionLogs[i] = actDtos[i].toAction();
			}
			return actionLogs;
		}
}
