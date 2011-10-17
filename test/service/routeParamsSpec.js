'use strict';

describe('$routeParams', function() {
  it('should publish the params into a service', inject(function($rootScope, $route, $location, $routeParams) {
    $route.when('/foo');
    $route.when('/bar/:barId');

    $location.path('/foo').search('a=b');
    $rootScope.$digest();
    expect($routeParams).toEqual({a:'b'});

    $location.path('/bar/123').search('x=abc');
    $rootScope.$digest();
    expect($routeParams).toEqual({barId:'123', x:'abc'});
  }));
});
