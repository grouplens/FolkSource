(function () {
'use strict';
/**
*  ChangePassword Controller
*/

angular.module('folksource.controllers').controller('MainCtrl', 
    ['$scope', 'OAuth',
    function ($scope, OAuth) {


    $scope.getAuthUri = function(){
    	var promise = OAuth.get().$promise;
    	promise.then(function(data){
    		$scope.message = data.message;
    	});
    };

}]);

})();