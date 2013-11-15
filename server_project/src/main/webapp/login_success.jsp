<%@page import="net.sf.json.JSONObject"%>

<%response.setContentType("application/json");%>
<%
JSONObject js = new JSONObject();
js.put("uid", request.getAttribute("uid"));
js.put("points", request.getAttribute("points"));
js.put("name", request.getAttribute("name"));
response.getWriter().write(js.toString());
%>
