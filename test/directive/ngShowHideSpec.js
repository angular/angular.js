'use strict';

describe('ng:show / ng:hide', function() {
  var element;


  afterEach(function() {
    dealoc(element);
  });

  describe('ng:show', function() {
    it('should show and hide an element', inject(function($rootScope, $compile) {
      element = jqLite('<div ng:show="exp"></div>');
      element = $compile(element)($rootScope);
      $rootScope.$digest();
      expect(isCssVisible(element)).toEqual(false);
      $rootScope.exp = true;
      $rootScope.$digest();
      expect(isCssVisible(element)).toEqual(true);
    }));


    it('should make hidden element visible', inject(function($rootScope, $compile) {
      element = jqLite('<div style="display: none" ng:show="exp"></div>');
      element = $compile(element)($rootScope);
      expect(isCssVisible(element)).toBe(false);
      $rootScope.exp = true;
      $rootScope.$digest();
      expect(isCssVisible(element)).toBe(true);
    }));
  });

  describe('ng:hide', function() {
    it('should hide an element', inject(function($rootScope, $compile) {
      element = jqLite('<div ng:hide="exp"></div>');
      element = $compile(element)($rootScope);
      expect(isCssVisible(element)).toBe(true);
      $rootScope.exp = true;
      $rootScope.$digest();
      expect(isCssVisible(element)).toBe(false);
    }));
  });
});
