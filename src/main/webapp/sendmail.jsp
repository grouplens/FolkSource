<%@ page language="java" contentType="text/html; charset=ISO-8859-1"
	pageEncoding="ISO-8859-1"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<%@taglib uri="/struts-tags" prefix="s"%>
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=ISO-8859-1">
<title>Forget password</title>
</head>
<body>
<h2>Please type your email. We will send a message to find your password.</h2>

<form action="email" method="POST">
		Email:<input type="text" name="email"/></br>
		<input type="submit" value="Submit" />
</form>
</body>
</html>