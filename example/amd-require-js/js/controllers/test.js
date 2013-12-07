/**
 * Created by igi on 04.11.13.
 */
define(['app'], function (app) {

	app.controller('TestController', function ($scope) {
		$scope.data = [
			'Test data',
			'About test controller',
			'Working good'
		];
	});

	return app;
});