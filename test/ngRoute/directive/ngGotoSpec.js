'use strict';

describe('ngGoto', function() {
  var element,
      $httpBackend;

  beforeEach(module('ngRoute'));

  beforeEach(module(function() {
    return function(_$httpBackend_) {
      $httpBackend = _$httpBackend_;
      $httpBackend.when('GET', 'Chapter.html').respond('chapter');
    };
  }));

  afterEach(function() {
    dealoc(element);
  });

  it('should maintain a links href attribute and assign an active class', function() {
    module(function($routeProvider) {
      $routeProvider.when('/Book/:book/Chapter/:chapter',
          {controller: angular.noop, templateUrl: 'Chapter.html', name: 'chapter'});
    });
    inject(function($route, $location, $rootScope, $compile) {
      element = $compile('<a ng-goto="chapter"></a>')($rootScope);
      $rootScope.$digest();

      expect(element.hasClass('ng-route-active')).toEqual(false);
      expect(element.attr('href')).toEqual('#/Book//Chapter/');

      $route.to.chapter({book: 'Moby', chapter: 'Intro'}, 'p=123');
      $rootScope.$digest();
      $httpBackend.flush();

      expect(element.hasClass('ng-route-active')).toEqual(true);
      expect(element.attr('href')).toEqual('#/Book/Moby/Chapter/Intro');
    });
  });

  it('should maintain a links href attribute and respect html5 mode routing', function() {
    module(function($routeProvider, $locationProvider) {
      $locationProvider.html5Mode(true);

      $routeProvider.when('/Book/:book/Chapter/:chapter',
          {controller: angular.noop, templateUrl: 'Chapter.html', name: 'chapter'});
    });
    inject(function($route, $location, $rootScope, $compile) {
      element = $compile('<a ng-goto="chapter"></a>')($rootScope);
      $rootScope.$digest();

      expect(element.hasClass('ng-route-active')).toEqual(false);
      expect(element.attr('href')).toEqual('/Book//Chapter/');

      $route.to.chapter({book: 'Moby', chapter: 'Intro'}, 'p=123');
      $rootScope.$digest();
      $httpBackend.flush();

      expect(element.hasClass('ng-route-active')).toEqual(true);
      expect(element.attr('href')).toEqual('/Book/Moby/Chapter/Intro');
    });
  });

  it('should maintain a links href attribute and update requested params without search', function() {
    module(function($routeProvider, $locationProvider) {
      $routeProvider.when('/Book/:book/Chapter/:chapter',
          {controller: angular.noop, templateUrl: 'Chapter.html', name: 'chapter'});
    });
    inject(function($route, $location, $rootScope, $compile) {
      element = $compile('<a ng-goto="chapter" chapter="Lord"></a>')($rootScope);
      $rootScope.$digest();

      expect(element.hasClass('ng-route-active')).toEqual(false);
      expect(element.attr('href')).toEqual('#/Book//Chapter/Lord');

      $route.to.chapter({book: 'Moby', chapter: 'Intro'}, 'p=123');
      $rootScope.$digest();
      $httpBackend.flush();

      expect(element.hasClass('ng-route-active')).toEqual(true);
      expect(element.attr('href')).toEqual('#/Book/Moby/Chapter/Lord');
    });
  });

  it('should maintain a links href attribute and update requested params with search', function() {
    module(function($routeProvider, $locationProvider) {
      $routeProvider.when('/Book/:book/Chapter/:chapter',
          {controller: angular.noop, templateUrl: 'Chapter.html', name: 'chapter'});
    });
    inject(function($route, $location, $rootScope, $compile) {
      element = $compile('<a ng-goto="chapter" search="true" chapter="Lord"></a>')($rootScope);
      $rootScope.$digest();

      expect(element.hasClass('ng-route-active')).toEqual(false);
      expect(element.attr('href')).toEqual('#/Book//Chapter/Lord');

      $route.to.chapter({book: 'Moby', chapter: 'Intro'}, 'p=123');
      $rootScope.$digest();
      $httpBackend.flush();

      expect(element.hasClass('ng-route-active')).toEqual(true);
      expect(element.attr('href')).toEqual('#/Book/Moby/Chapter/Lord?p=123');
    });
  });

  it('should not add href unless a link', function() {
    module(function($routeProvider, $locationProvider) {
      $routeProvider.when('/Book/:book/Chapter/:chapter',
          {controller: angular.noop, templateUrl: 'Chapter.html', name: 'chapter'});
    });
    inject(function($route, $location, $rootScope, $compile) {
      element = $compile('<div ng-goto="chapter" chapter="Lord"></div>')($rootScope);
      $rootScope.$digest();

      expect(element.hasClass('ng-route-active')).toEqual(false);
      expect(element.attr('href')).toEqual(undefined);

      $route.to.chapter({book: 'Moby', chapter: 'Intro'}, 'p=123');
      $rootScope.$digest();
      $httpBackend.flush();

      expect(element.hasClass('ng-route-active')).toEqual(true);
      expect(element.attr('href')).toEqual(undefined);
    });
  });

  it('should update route on click', function() {
    module(function($routeProvider, $locationProvider) {
      $routeProvider.when('/Book/:book/Chapter/:chapter',
          {controller: angular.noop, templateUrl: 'Chapter.html', name: 'chapter'});
    });
    inject(function($route, $location, $rootScope, $compile) {
      element = $compile('<div ng-goto="chapter" book="Moby" chapter="Lord"></div>')($rootScope);
      $rootScope.$digest();

      expect(element.hasClass('ng-route-active')).toEqual(false);

      element.scope().ngGotoHandler();
      $rootScope.$digest();
      $httpBackend.flush();

      expect(element.hasClass('ng-route-active')).toEqual(true);
      expect($location.url()).toEqual('/Book/Moby/Chapter/Lord');
    });
  });
});
