'use strict';

describe('$routeParams', function() {
  it('should publish the params into a service',  function() {
    module(function($routeProvider) {
      $routeProvider.when('/foo', {});
      $routeProvider.when('/bar/:barId', {});
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

  it('should correctly extract the params when a param name is part of the route',  function() {
    module(function($routeProvider) {
      $routeProvider.when('/bar/:foo/:bar', {});
    });

    inject(function($rootScope, $route, $location, $routeParams) {
      $location.path('/bar/foovalue/barvalue');
      $rootScope.$digest();
      expect($routeParams).toEqual({bar:'barvalue', foo:'foovalue'});
    });
  });

  it('should support route params not preceded by slashes', function() {
    module(function($routeProvider) {
      $routeProvider.when('/bar:barId/foo:fooId/', {});
    });

    inject(function($rootScope, $route, $location, $routeParams) {
      $location.path('/barbarvalue/foofoovalue/');
      $rootScope.$digest();
      expect($routeParams).toEqual({barId: 'barvalue', fooId: 'foovalue'});
    });
  });
});
