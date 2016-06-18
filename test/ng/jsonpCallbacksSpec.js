'use strict';

describe('$jsonpCallbacks', function() {

  beforeEach(module(function($provide) {
    // mock out the $window object
    $provide.value('$window', { angular: {} });
  }));

  describe('createCallback(url)', function() {

    it('should return a new unique path to a callback function on each call', inject(function($jsonpCallbacks) {
      var path = $jsonpCallbacks.createCallback('http://some.dummy.com/jsonp/request');
      expect(path).toEqual('angular.callbacks._0');

      path = $jsonpCallbacks.createCallback('http://some.dummy.com/jsonp/request');
      expect(path).toEqual('angular.callbacks._1');

      path = $jsonpCallbacks.createCallback('http://some.dummy.com/jsonp/request');
      expect(path).toEqual('angular.callbacks._2');

      path = $jsonpCallbacks.createCallback('http://some.dummy.com/jsonp/request');
      expect(path).toEqual('angular.callbacks._3');
    }));

    it('should add a callback method to the $window.angular.callbacks collection on each call', inject(function($window, $jsonpCallbacks) {
      $jsonpCallbacks.createCallback('http://some.dummy.com/jsonp/request');
      expect($window.angular.callbacks._0).toEqual(jasmine.any(Function));

      $jsonpCallbacks.createCallback('http://some.dummy.com/jsonp/request');
      expect($window.angular.callbacks._1).toEqual(jasmine.any(Function));

      $jsonpCallbacks.createCallback('http://some.dummy.com/jsonp/request');
      expect($window.angular.callbacks._2).toEqual(jasmine.any(Function));

      $jsonpCallbacks.createCallback('http://some.dummy.com/jsonp/request');
      expect($window.angular.callbacks._3).toEqual(jasmine.any(Function));
    }));
  });


  describe('wasCalled(callbackPath)', function() {

    it('should return true once the callback has been called', inject(function($window, $jsonpCallbacks) {
      var path = $jsonpCallbacks.createCallback('http://some.dummy.com/jsonp/request');
      expect($jsonpCallbacks.wasCalled(path)).toBeFalsy();
      var response = {};
      $window.angular.callbacks._0(response);
      expect($jsonpCallbacks.wasCalled(path)).toBeTruthy();
    }));
  });


  describe('getResponse(callbackPath)', function() {

    it('should retrieve the data from when the callback was called', inject(function($window, $jsonpCallbacks) {
      var path = $jsonpCallbacks.createCallback('http://some.dummy.com/jsonp/request');
      var response = {};
      $window.angular.callbacks._0(response);
      var result = $jsonpCallbacks.getResponse(path);
      expect(result).toBe(response);
    }));
  });

  describe('removeCallback(calbackPath)', function() {

    it('should remove the callback', inject(function($window, $jsonpCallbacks) {
      var path = $jsonpCallbacks.createCallback('http://some.dummy.com/jsonp/request');
      $jsonpCallbacks.removeCallback(path);
      expect($window.angular.callbacks._0).toBeUndefined();
    }));
  });
});
