/**
 * Created by igi on 04.11.13.
 */
define(['angular', 'routes'], function(angular, routes){
	var module = angular.module('dynamicLoading', ['ngRoute']);
	module.config(function($routeProvider, $locationProvider){
		//$locationProvider.html5Mode(true);

		routes.forEach(function(value){
			$routeProvider.when(value.route, value.options);
		});

		$routeProvider.otherwise({
			templateUrl: './html/404.html',
			resolve: {
				resource: function($q){
					var d = $q.defer();
					requirejs(['controllers/error'], function(){
						d.resolve(console.log('Resource loaded'));
					});
					return d.promise;
				}
			}
		})
	});

	module.controller('RootController', function($scope){
		$scope.header = 'Amd solution proposal';
	});
	return module;
});