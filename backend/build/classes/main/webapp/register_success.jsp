<%@page import="net.sf.json.JSONObject"%>

<%response.setContentType("application/json");%>
<%
JSONObject js = new JSONObject();
js.put("uid", request.getAttribute("uid"));
js.put("points", request.getAttribute("points"));
response.getWriter().write(js.toString());
// out.print("{\"uid:\"" + request.getAttribute("uid") + ",");
// out.print("\"points:\"" + request.getAttribute("points")+"}");
%>
