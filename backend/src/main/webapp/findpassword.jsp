<%@ page language="java" contentType="text/html; charset=ISO-8859-1"
	pageEncoding="ISO-8859-1"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<%@taglib uri="/struts-tags" prefix="s"%>
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=ISO-8859-1">
<title>Find Password</title>
</head>

<body>
	<h2>Find Password</h2>

	<form action="password" method=GET>
		<input type="hidden" name="findpwid" value="<%= request.getParameter("findpwid") %>"> 
		New Password:<input type="password" name="password" /></br> 
		Confirm Password:<input type="password" name="password2" /></br> 
		<input type="submit" value="Submit" />
	</form>

</body>
</html>