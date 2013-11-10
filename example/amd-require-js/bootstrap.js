/**
 * Created by igi on 04.11.13.
 */
require.config({
	baseUrl: './js/',
	paths: {
		'angular' : '../../../build/angular',
		'angular-route' : '../../../build/angular-route',
		'jquery' : '../../../bower_components/jquery/jquery'
	},
	shim: {
		'angular': {
			deps: ['jquery'],
			exports: 'angular'
		},
		'angular-route': {
			deps: ['angular']
		},
		'app': {
			deps: [
				'angular-route'
			]
		}
	}
});


requirejs(['angular', 'app'], function(angular){
	angular.bootstrap(document, ['dynamicLoading']);
});