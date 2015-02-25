(function () {
'use strict';

angular.module('folksource.controllers', [
    'ngRoute',
    'folksource.services',
    'ui.bootstrap',
    ]);

var partialBase = 'partial?partial=';

angular.module('folksource', [
    'folksource.controllers'
    ]).
    config(['$routeProvider',
        function($routeProvider) {
        $routeProvider.
            when('/main', {
                templateUrl: partialBase + 'main.jsp',
                controller: 'MainCtrl'
            }).
            otherwise({
                redirectTo: '/main'
            });
    }]);
})();