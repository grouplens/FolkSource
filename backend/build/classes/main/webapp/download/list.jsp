<%--<%@page import="org.citizensense.model.*"%>--%>
<%--<%@page import="org.citizensense.util.*"%>--%>
<%@page import="net.sf.json.JSONObject"%>
<%@page import="java.util.*;" %>


<%@ page language="java" contentType="text/html; charset=ISO-8859-1"
	pageEncoding="ISO-8859-1"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<%@taglib uri="/struts-tags" prefix="s"%>
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=ISO-8859-1">
<title>Campaign List Page</title>
</head>
<body>
<ul>
<%--<%
List<Campaign> l = CampaignService.getCampaigns();
for (Campaign c : l) {
	response.getWriter().write("<li><a href=\"data.jsp?id="+c.getId() + "\">" + c.getTitle() + "</a></li>");
}

%>--%>
</ul>
</body>
</html>
