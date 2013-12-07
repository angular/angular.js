/**
 * Created by igi on 04.11.13.
 */
define(function () {
	return [
		{
			route: '/home',
			options: {
				templateUrl: './html/home.html',
				controller: 'HomeController',
				resolve: {
					resources: function ($q) {
						var d = $q.defer();
						requirejs(['controllers/home'], function(){
							d.resolve(console.log('Home loaded'));
						});
						return d.promise;
					}
				}
			}
		},
		{
			route: '/test',
			options: {
				templateUrl: './html/test.html',
				controller: 'TestController',
				resolve: {
					resources: function ($q) {
						var d = $q.defer();
						requirejs(['controllers/test'], function(){
							d.resolve(console.log('Test loaded'));
						});
						return d.promise;
					}
				}
			}
		}
	]
});