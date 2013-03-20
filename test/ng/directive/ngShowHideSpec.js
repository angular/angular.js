'use strict';

describe('ngShow / ngHide', function() {
  var element;


  afterEach(function() {
    dealoc(element);
  });

  describe('ngShow', function() {
    it('should show and hide an element', inject(function($rootScope, $compile) {
      element = jqLite('<div ng-show="exp"></div>');
      element = $compile(element)($rootScope);
      $rootScope.$digest();
      expect(isCssVisible(element)).toEqual(false);
      $rootScope.exp = true;
      $rootScope.$digest();
      expect(isCssVisible(element)).toEqual(true);
    }));


    it('should make hidden element visible', inject(function($rootScope, $compile) {
      element = jqLite('<div style="display: none" ng-show="exp"></div>');
      element = $compile(element)($rootScope);
      expect(isCssVisible(element)).toBe(false);
      $rootScope.exp = true;
      $rootScope.$digest();
      expect(isCssVisible(element)).toBe(true);
    }));
  });

  describe('ngHide', function() {
    it('should hide an element', inject(function($rootScope, $compile) {
      element = jqLite('<div ng-hide="exp"></div>');
      element = $compile(element)($rootScope);
      expect(isCssVisible(element)).toBe(true);
      $rootScope.exp = true;
      $rootScope.$digest();
      expect(isCssVisible(element)).toBe(false);
    }));
  });
});

describe('ngShow / ngHide - ngAnimate', function() {
  var element, window;
  var vendorPrefix;

  beforeEach(module(function($animationProvider, $provide) {
    $provide.value('$window', window = angular.mock.createMockWindow());
    return function($sniffer) {
      vendorPrefix = '-' + $sniffer.vendorPrefix + '-';
    };
  }));

  afterEach(function() {
    dealoc(element);
  });

  describe('ngShow', function() {
    it('should fire off the animator.show and animator.hide animation', inject(function($compile, $rootScope, $sniffer) {
      var $scope = $rootScope.$new();
      $scope.on = true;
      element = $compile(
        '<div ' +
          'style="'+vendorPrefix+'transition: 1s linear all"' +
          'ng-show="on" ' +
          'ng-animate="{show: \'custom-show\', hide: \'custom-hide\'}">' +
        '</div>'
      )($scope);
      $scope.$digest();

      if ($sniffer.supportsTransitions) {
        expect(element.attr('class')).toContain('custom-show-setup');
        window.setTimeout.expect(1).process();

        expect(element.attr('class')).toContain('custom-show-start');
        window.setTimeout.expect(1000).process();
      } else {
        expect(window.setTimeout.queue).toEqual([]);
      }

      expect(element.attr('class')).not.toContain('custom-show-start');
      expect(element.attr('class')).not.toContain('custom-show-setup');

      $scope.on = false;
      $scope.$digest();
      if ($sniffer.supportsTransitions) {
        expect(element.attr('class')).toContain('custom-hide-setup');
        window.setTimeout.expect(1).process();
        expect(element.attr('class')).toContain('custom-hide-start');
        window.setTimeout.expect(1000).process();
      } else {
        expect(window.setTimeout.queue).toEqual([]);
      }

      expect(element.attr('class')).not.toContain('custom-hide-start');
      expect(element.attr('class')).not.toContain('custom-hide-setup');
    }));
  });

  describe('ngHide', function() {
    it('should fire off the animator.show and animator.hide animation', inject(function($compile, $rootScope, $sniffer) {
      var $scope = $rootScope.$new();
      $scope.off = true;
      element = $compile(
          '<div ' +
              'style="'+vendorPrefix+'transition: 1s linear all"' +
              'ng-hide="off" ' +
              'ng-animate="{show: \'custom-show\', hide: \'custom-hide\'}">' +
              '</div>'
      )($scope);
      $scope.$digest();

      if ($sniffer.supportsTransitions) {
        expect(element.attr('class')).toContain('custom-hide-setup');
        window.setTimeout.expect(1).process();

        expect(element.attr('class')).toContain('custom-hide-start');
        window.setTimeout.expect(1000).process();
      } else {
        expect(window.setTimeout.queue).toEqual([]);
      }

      expect(element.attr('class')).not.toContain('custom-hide-start');
      expect(element.attr('class')).not.toContain('custom-hide-setup');

      $scope.off = false;
      $scope.$digest();

      if ($sniffer.supportsTransitions) {
        expect(element.attr('class')).toContain('custom-show-setup');
        window.setTimeout.expect(1).process();
        expect(element.attr('class')).toContain('custom-show-start');
        window.setTimeout.expect(1000).process();
      } else {
        expect(window.setTimeout.queue).toEqual([]);
      }

      expect(element.attr('class')).not.toContain('custom-show-start');
      expect(element.attr('class')).not.toContain('custom-show-setup');
    }));
  });
});
