<%@ taglib uri="/struts-tags" prefix="s" %>

<fieldset>
<legend>Test OAuth Connection</legend>

<div class="row">
	<div class="col-xs-6">
		
		<a class="btn btn-primary" ng-click="getAuthUri()">Get Auth URI</a> 

		<br/>
		{{message}}
		
	</div>
</div>
<br/><br/>
<div class="row">
	<div class="col-xs-6">
		<input type="file" ng-model="file"/>
		<br/>
		<a class="btn btn-success" ng-click="upload()">Upload</a>
	</div>
</div>

</fieldset>
