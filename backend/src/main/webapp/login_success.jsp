<<<<<<< HEAD

<%@page import="net.sf.json.JSONObject"%>

<%response.setContentType("application/json");%>
<%
JSONObject js = new JSONObject();
js.put("uid", request.getAttribute("uid"));
js.put("points", request.getAttribute("points"));
js.put("type", request.getAttribute("type"));
js.put("email", request.getAttribute("email"));
response.getWriter().write(js.toString());
%>
=======
<%@page import="net.sf.json.JSONObject"%>

<%response.setContentType("application/json");%>
<%
JSONObject js = new JSONObject();
js.put("uid", request.getAttribute("uid"));
js.put("points", request.getAttribute("points"));
js.put("type", request.getAttribute("type"));
js.put("email", request.getAttribute("email"));
response.getWriter().write(js.toString());
%>
>>>>>>> refs/remotes/grouplens/master
