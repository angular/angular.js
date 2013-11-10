/**
 * Created by igi on 04.11.13.
 */
define(['app'], function (app) {

	app.controller('ErrorController', function ($scope) {
		$scope.data = [
			'Error example',
			'Controller dynamic loading is working'
		];
	});

	return app;
});