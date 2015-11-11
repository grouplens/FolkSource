(function () {
'use strict';
/**
*  ChangePassword Controller
*/

angular.module('folksource.controllers').controller('MainCtrl', 
    ['$scope', 'OAuth', 'fileUpload',
    function ($scope, OAuth, fileUpload) {


    $scope.getAuthUri = function(){
    	var promise = OAuth.get().$promise;
    	promise.then(function(data){
    		$scope.message = data.message;
    	});
    };

    $scope.upload = function() {
    	fileUpload.uploadFileToUrl($scope.file, "upload")
    }

}]);

})();