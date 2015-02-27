<%@page import="org.citizensense.model.*"%>
<%@page import="org.citizensense.util.*"%>
<%@page import="org.hibernate.*"%>
<%@page import="net.sf.json.JSONObject"%>
<%@page import="java.util.*;" %>
<%@ taglib uri="http://displaytag.sf.net" prefix="display" %>

<%-- <%@ page language="java" contentType="text/html; charset=ISO-8859-1" --%>
<%-- 	pageEncoding="ISO-8859-1"%> --%>
<!-- <!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd"> -->
<%-- <%@taglib uri="/struts-tags" prefix="s"%> --%>
<!-- <html> -->
<!-- <head> -->
<!-- <meta http-equiv="Content-Type" content="text/html; charset=ISO-8859-1"> -->
<!-- <title>Campaign List Page</title> -->
<!-- </head> -->
<!-- <body> -->
<%
int id = Integer.parseInt(request.getParameter("id"));
Session sesh = HibernateUtil.getSession(true);
List<Object[]> l = sesh.createSQLQuery("SELECT tasks.instructions, answers.sub_id, task_submissions.gps_location, task_submissions.timestamp, answers.q_id, questions.question, answers.answer FROM tasks JOIN (task_submissions JOIN (answers JOIN questions ON answers.q_id=questions.id) ON answers.sub_id=task_submissions.id) ON task_submissions.task_id=tasks.id where tasks.campaign_id="+id+";").list();

List<BDObject> p = new ArrayList<BDObject>();
for(Object[] o : l) {
	BDObject x = new BDObject(o);
	p.add(x);
}
request.setAttribute("tab", p);
%>
<display:table type="tab" export="true">
<display:column property="sub_id" sortable="true" />
<display:column property="task_desc" sortable="true" />
<display:column property="location" sortable="true" />
<display:column property="sub_timestamp" sortable="true" />
<display:column property="question_id" sortable="true" />
notes;
<display:column property="question" sortable="true" />
<display:column property="answer" sortable="true" />
</display:table>
