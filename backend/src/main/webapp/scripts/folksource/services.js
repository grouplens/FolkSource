(function () {
'use strict';

	var module = angular.module('folksource.services', ['ngResource']);

	module.factory('OAuth', ['$resource', function($resource) {
	    return $resource("authuri", {}, {});
	}]);

	module.service('fileUpload', ['$http', function ($http) {
	    this.uploadFileToUrl = function(file, uploadUrl){
	        var fd = new FormData();
	        console.log(file);
	        fd.append('file', file);
	        $http.post(uploadUrl, fd, {
	            transformRequest: angular.identity,
	            headers: {'Content-Type': undefined}
	        })
	        .success(function(){
	        })
	        .error(function(){
	        });
	    }
	}]);

})();
