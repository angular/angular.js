'use strict';

describe('$routeParams', function() {
  it('should publish the params into a service',  function() {
    module(function($routeProvider) {
      $routeProvider.when('/foo');
      $routeProvider.when('/bar/:barId');
    });

    inject(function($rootScope, $route, $location, $routeParams) {
      $location.path('/foo').search('a=b');
      $rootScope.$digest();
      expect($routeParams).toEqual({a:'b'});

      $location.path('/bar/123').search('x=abc');
      $rootScope.$digest();
      expect($routeParams).toEqual({barId:'123', x:'abc'});
    });
  });
});
