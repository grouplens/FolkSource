package org.folksource.action.controller;

import javax.servlet.http.HttpServletResponse;

import org.apache.struts2.ServletActionContext;
import org.folksource.action.BaseAction;

public class ActionLogAction extends BaseAction{
		
	public String index() {
		HttpServletResponse res = ServletActionContext.getResponse();
		res.setHeader("Access-Control-Allow-Origin", "*");
		res.addHeader("Access-Control-Allow-Headers", "Authorization, AuthToken");
		res.addHeader("Access-Control-Expose-Headers", "Authorization, AuthToken");
		//content = new DtoContainer<ActionLogDto>(ActionLogDto.class, true);
		//content.set(ActionLogDto.fromActionList(ActionLogService.getActionLogs()));
		return "index";
	}

	public String options() {
		HttpServletResponse res = ServletActionContext.getResponse();
		res.setHeader("Access-Control-Allow-Origin", "*");
		res.addHeader("Access-Control-Allow-Headers", "Authorization, AuthToken");
		res.addHeader("Access-Control-Expose-Headers", "Authorization, AuthToken");
		return "options_success";
	}

    public String create() {

        HttpServletResponse res = ServletActionContext.getResponse();

        res.addHeader("Access-Control-Allow-Origin", "*");
        res.addHeader("Access-Control-Allow-Headers", "Cache-Control");

        //ActionLogDto actionLogDto = content.getSingle();
        //ActionLog actionLog = actionLogDto.toAction();

        //ActionLogService.save(actionLog);

        //content.set(new ActionLogDto(actionLog));

        return "create";
    }
}
