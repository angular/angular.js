/**
 * Created by igi on 04.11.13.
 */
define(['app'], function (app) {

	app.controller('HomeController', function ($scope) {
		$scope.data = [
			'Home data',
			'In array'
		];
	});

	return app;
});