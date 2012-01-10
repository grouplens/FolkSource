<%@ page language="java" contentType="text/html; charset=ISO-8859-1"
	pageEncoding="ISO-8859-1"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<%@taglib uri="/struts-tags" prefix="s"%>
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=ISO-8859-1">
<title>Login Page</title>
</head>
<body>
<h2>This is Login page</h2>

<form action="login" method="POST">
		User Name:<input type="text" name="name"/></br>
		Password:<input type="password" name="password"/></br>
		<input type="submit" value="Login" />
</form>
<a href="/citizensense/register.jsp">New account</a>
</body>
</html>