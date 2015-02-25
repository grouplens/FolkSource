<!DOCTYPE html>

<%@ taglib uri="/struts-tags" prefix="s"%>

<head>
<%-- order of first few tags as prescribed by HTML5Boilerplate --%>
<meta charset="utf-8" />
<meta http-equiv="X-UA-Compatible" content="IE=edge">
<meta name="viewport" content="width=device-width,initial-scale=1.0" />

	<link rel="stylesheet" type="text/css" href="../bower_components/bootstrap/dist/css/bootstrap.min.css"/>

	<!-- image crop-->
	<!-- <link rel="stylesheet" type="text/css" href="<c:url value="/csslibs/image-crop-styles.css" />"/> -->
	<!-- <link rel="stylesheet" type="text/css" href="<c:url value="/csslibs/jquery.Jcrop.css" />"/> -->

	<%-- TODO: what are these for --%>
	<meta http-equiv="CACHE-CONTROL" content="no-cache"/>
	<meta http-equiv="Expires" content="-1" />

	<script src="../bower_components/jquery/dist/jquery.min.js"></script>
	<script src="../bower_components/angular/angular.min.js"></script>
	<script src="../bower_components/angular-resource/angular-resource.min.js"></script>
	<script src="../bower_components/angular-route/angular-route.min.js"></script>
	<script src="../bower_components/angular-bootstrap/ui-bootstrap-tpls.min.js"></script>
</head>

<body ng-app="folksource">

	<div ng-view class="container"></div>

<script src="../scripts/folksource/app.js"></script>
<script src="../scripts/folksource/services.js"></script>
<script src="../scripts/folksource/controllers/mainCtrl.js"></script>

</body>

