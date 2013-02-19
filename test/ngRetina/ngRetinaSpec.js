'use strict';

describe('test module angular-retina', function() {
  var $window;

  describe('on high resolution displays', function() {
    var $httpBackend, scope;

    beforeEach(function() {
      module(function($provide) {
        $provide.provider('$window', function() {
          this.$get = function() {
            try {
              window.devicePixelRatio = 2;
            } catch (TypeError) {
              // in Firefox window.devicePixelRatio only has a getter
            }
            window.matchMedia = function(query) {
              return {matches: true};
            };
            return window;
          };
        });
      });
      module('ngRetina');
    });

    beforeEach(inject(function($injector, $rootScope) {
      scope = $rootScope.$new();
      $httpBackend = $injector.get('$httpBackend');
    }));

    describe('for static "ng-src" tags', function() {
      it('should set src tag with a highres image', inject(function($compile) {
        var element = angular.element('<input ng-src="/image.png">');
        $httpBackend.when('HEAD', '/image@2x.png').respond(200);
        $compile(element)(scope);
        scope.$digest();
        $httpBackend.flush();
        expect(element.attr('src')).toBe('/image@2x.png');
      }));
    });

    describe('for marked up "ng-src" tags', function() {
      var element;

      beforeEach(inject(function($compile) {
        element = angular.element('<input ng-src="/{{image_url}}">');
        scope.image_url = 'image.png';
        $httpBackend.when('HEAD', '/image@2x.png').respond(200);
        $compile(element)(scope);
        scope.$digest();
        $httpBackend.flush();
      }));

      it('should copy content from "ng-src" to "src" tag', function() {
        expect(element.attr('src')).toBe('/image@2x.png');
      });

      describe('should observe scope.image_url', function() {
        beforeEach(function() {
          $httpBackend.when('HEAD', '/picture@2x.png').respond(200);
          scope.image_url = 'picture.png';
          scope.$digest();
          $httpBackend.flush();
        });

        it('and replace src tag with another picture', function() {
          expect(element.attr('src')).toBe('/picture@2x.png');
        });

        it('and check if the client side cache is working', function() {
          scope.image_url = 'image.png';
          scope.$digest();
          expect(element.attr('src')).toBe('/image@2x.png');
        });
      });
    });

    describe('if the high resolution image is not available', function() {
      beforeEach(function() {
        $httpBackend.when('HEAD', '/image@2x.png').respond(404);
      });

      it('should copy content from "ng-src" to "src" tag', inject(function($compile) {
        var element = angular.element('<input ng-src="/image.png">');
        $compile(element)(scope);
        scope.$digest();
        $httpBackend.flush();
        expect(element.attr('src')).toBe('/image.png');
      }));

      it('should copy content from scope object to "src" tag', inject(function($compile) {
        var element = angular.element('<input ng-src="/{{image_url}}">');
        scope.image_url = 'image.png';
        $compile(element)(scope);
        scope.$digest();
        $httpBackend.flush();
        expect(element.attr('src')).toBe('/image.png');
      }));
    });
  });

  describe('on standard resolution displays using images in their low resolution version', function() {
    var $httpBackend, scope;

    beforeEach(function() {
      module(function($provide) {
        $provide.provider('$window', function() {
          this.$get = function() {
            try {
              window.devicePixelRatio = 1;
            } catch (TypeError) {
              // in Firefox window.devicePixelRatio only has a getter
            }
            window.matchMedia = function(query) {
              return {matches: false};
            };
            return window;
          };
        });
      });
      module('ngRetina');
    });

    beforeEach(inject(function($injector, $rootScope) {
      scope = $rootScope.$new();
    }));

    it('should copy content from "ng-src" to "src" tag', inject(function($compile) {
      var element = angular.element('<input ng-src="/image.png">');
      $compile(element)(scope);
      scope.$digest();
      expect(element.attr('src')).toBe('/image.png');
    }));

    it('should copy content from scope object to "src" tag', inject(function($compile) {
      var element = angular.element('<input ng-src="/{{image_url}}">');
      scope.image_url = 'image.png';
      $compile(element)(scope);
      scope.$digest();
      expect(element.attr('src')).toBe('/image.png');
    }));
  });

});
