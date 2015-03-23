(function () {
'use strict';

	var module = angular.module('folksource.services', ['ngResource']);

	module.factory('OAuth', ['$resource', function($resource) {
	    return $resource("authuri", {}, {});
	}]);


})();
