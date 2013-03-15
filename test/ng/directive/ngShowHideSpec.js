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
  var element;

  afterEach(function() {
    dealoc(element);
  });

  describe('ngShow', function() {
    it('should fire off the animator.show and animator.hide animation', function() {
      var timeouts = [];

      module(function($animationProvider, $provide) {
        $provide.value('$document', [document]);
        $provide.value('$window', {
          getComputedStyle : function() {
            return window.getComputedStyle.apply(window, arguments);
          },
          navigator : {
            userAgent: 'chrome'
          },
          setTimeout : function(fn, delay) {
            timeouts.push({
              fn: fn,
              delay: delay
            });
          }
        });
      })

      inject(function($compile, $rootScope, $sniffer) {
        var vendorPrefix = '-' + $sniffer.vendorPrefix.toLowerCase() + '-';
        var $scope = $rootScope.$new();
        $scope.on = true;
        element = $compile(
          '<div ' +
            'style="'+vendorPrefix+'transition: 1s linear all"' +
            'ng-show="on" ' +
            'ng-animate="show: customShow; hide: customHide;">' +
          '</div>'
        )($scope);
        $scope.$digest();

        expect(element.attr('class')).toContain('ng-animate-custom-show-setup');
        timeouts.pop().fn();

        expect(element.attr('class')).toContain('ng-animate-custom-show-start');
        timeouts.pop().fn();

        expect(element.attr('class')).not.toContain('ng-animate-custom-show-start');
        expect(element.attr('class')).not.toContain('ng-animate-custom-show-setup');

        $scope.on = false;
        $scope.$digest();
        expect(element.attr('class')).toContain('ng-animate-custom-hide-setup');
        timeouts.pop().fn(); //delay(1)
        expect(element.attr('class')).toContain('ng-animate-custom-hide-start');
        timeouts.pop().fn(); //after the animation

        expect(element.attr('class')).not.toContain('ng-animate-custom-hide-start');
        expect(element.attr('class')).not.toContain('ng-animate-custom-hide-setup');
      });
    });
  });

  describe('ngHide', function() {
    it('should fire off the animator.show and animator.hide animation', function() {
      var timeouts = [];

      module(function($animationProvider, $provide) {
        $provide.value('$document', [document]);
        $provide.value('$window', {
          getComputedStyle : function() {
            return window.getComputedStyle.apply(window, arguments);
          },
          navigator : {
            userAgent: 'chrome'
          },
          setTimeout : function(fn, delay) {
            timeouts.push({
              fn: fn,
              delay: delay
            });
          }
        });
      })

      inject(function($compile, $rootScope, $sniffer) {
        var vendorPrefix = '-' + $sniffer.vendorPrefix.toLowerCase() + '-';
        var $scope = $rootScope.$new();
        $scope.off = true;
        element = $compile(
          '<div ' +
            'style="'+vendorPrefix+'transition: 1s linear all"' +
            'ng-hide="off" ' +
            'ng-animate="show: customShow; hide: customHide;">' +
          '</div>'
        )($scope);
        $scope.$digest();

        expect(element.attr('class')).toContain('ng-animate-custom-hide-setup');
        timeouts.pop().fn();

        expect(element.attr('class')).toContain('ng-animate-custom-hide-start');
        timeouts.pop().fn();

        expect(element.attr('class')).not.toContain('ng-animate-custom-hide-start');
        expect(element.attr('class')).not.toContain('ng-animate-custom-hide-setup');

        $scope.off = false;
        $scope.$digest();
        expect(element.attr('class')).toContain('ng-animate-custom-show-setup');
        timeouts.pop().fn(); //delay(1)
        expect(element.attr('class')).toContain('ng-animate-custom-show-start');
        timeouts.pop().fn(); //after the animation

        expect(element.attr('class')).not.toContain('ng-animate-custom-show-start');
        expect(element.attr('class')).not.toContain('ng-animate-custom-show-setup');
      });
    });
  });
});
