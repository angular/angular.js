'use strict';

describe('$routeParams', function() {

  beforeEach(module('ngRoute'));


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

  it('should correctly extract the params when an optional param name is part of the route',  function() {
    module(function($routeProvider) {
      $routeProvider.when('/bar/:foo?', {});
      $routeProvider.when('/baz/:foo?/edit', {});
      $routeProvider.when('/qux/:bar?/:baz?', {});
    });

    inject(function($rootScope, $route, $location, $routeParams) {
      $location.path('/bar');
      $rootScope.$digest();
      expect($routeParams).toEqual({});

      $location.path('/bar/fooValue');
      $rootScope.$digest();
      expect($routeParams).toEqual({foo: 'fooValue'});

      $location.path('/baz/fooValue/edit');
      $rootScope.$digest();
      expect($routeParams).toEqual({foo: 'fooValue'});

      $location.path('/baz/edit');
      $rootScope.$digest();
      expect($routeParams).toEqual({});

      $location.path('/qux//bazValue');
      $rootScope.$digest();
      expect($routeParams).toEqual({baz: 'bazValue'});

    });
  });

  it('should correctly extract path params containing hashes and/or question marks', function() {
    module(function($routeProvider) {
      $routeProvider.when('/foo/:bar', {});
      $routeProvider.when('/zoo/:bar/:baz/:qux', {});
    });

    inject(function($location, $rootScope, $routeParams) {
      $location.path('/foo/bar?baz');
      $rootScope.$digest();
      expect($routeParams).toEqual({bar: 'bar?baz'});

      $location.path('/foo/bar?baz=val');
      $rootScope.$digest();
      expect($routeParams).toEqual({bar: 'bar?baz=val'});

      $location.path('/foo/bar#baz');
      $rootScope.$digest();
      expect($routeParams).toEqual({bar: 'bar#baz'});

      $location.path('/foo/bar?baz#qux');
      $rootScope.$digest();
      expect($routeParams).toEqual({bar: 'bar?baz#qux'});

      $location.path('/foo/bar?baz=val#qux');
      $rootScope.$digest();
      expect($routeParams).toEqual({bar: 'bar?baz=val#qux'});

      $location.path('/foo/bar#baz?qux');
      $rootScope.$digest();
      expect($routeParams).toEqual({bar: 'bar#baz?qux'});

      $location.path('/zoo/bar?p1=v1#h1/baz?p2=v2#h2/qux?p3=v3#h3');
      $rootScope.$digest();
      expect($routeParams).toEqual({
        bar: 'bar?p1=v1#h1',
        baz: 'baz?p2=v2#h2',
        qux: 'qux?p3=v3#h3'
      });
    });
  });

});
