package org.folksource.controller;


import com.opensymphony.xwork2.ModelDriven;
import org.apache.struts2.ServletActionContext;
import org.folksource.model.ActionLog;
import org.folksource.model.ActionLogDto;
import org.folksource.util.ActionLogService;
import org.grouplens.common.dto.DtoContainer;

import javax.servlet.http.HttpServletResponse;

public class ActionLogController implements ModelDriven<DtoContainer<ActionLogDto>>{
	
	private DtoContainer<ActionLogDto> content = new DtoContainer<ActionLogDto>(ActionLogDto.class, false);
	
	@Override
	public DtoContainer<ActionLogDto> getModel() {
		return content;
	}
	
	public String index() {
		HttpServletResponse res = ServletActionContext.getResponse();
		res.setHeader("Access-Control-Allow-Origin", "*");
		res.addHeader("Access-Control-Allow-Headers", "Authorization, AuthToken");
		res.addHeader("Access-Control-Expose-Headers", "Authorization, AuthToken");
		content = new DtoContainer<ActionLogDto>(ActionLogDto.class, true);
		content.set(ActionLogDto.fromActionList(ActionLogService.getActionLogs()));
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

        ActionLogDto actionLogDto = content.getSingle();
        ActionLog actionLog = actionLogDto.toAction();

        ActionLogService.save(actionLog);

        content.set(new ActionLogDto(actionLog));

        return "create";
    }
}
